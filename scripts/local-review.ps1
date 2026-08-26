[CmdletBinding()]
param(
  [ValidateSet('start', 'status', 'stop')]
  [string]$Action = 'start',

  [ValidateRange(1024, 65535)]
  [int]$Port = 4178
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$reviewDir = Join-Path $repoRoot '.local-review'
$stateFile = Join-Path $reviewDir "review-$Port.json"
$baseUrl = "http://127.0.0.1:$Port"
$healthPaths = @('/', '/patch-notes', '/puzzles/4166-1899-coordinates', '/walkthrough/blue-tower-train')

function Read-ReviewState {
  if (-not (Test-Path -LiteralPath $stateFile)) { return $null }
  return Get-Content -LiteralPath $stateFile -Raw -Encoding UTF8 | ConvertFrom-Json
}

function Get-ReviewListener {
  return @(Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue)
}

function Test-ReviewHealth {
  $checks = foreach ($path in $healthPaths) {
    try {
      $response = Invoke-WebRequest -Uri "$baseUrl$path" -UseBasicParsing -TimeoutSec 5
      [pscustomobject]@{ path = $path; status = [int]$response.StatusCode }
    } catch {
      [pscustomobject]@{ path = $path; status = 0; error = $_.Exception.Message }
    }
  }

  return [pscustomobject]@{
    healthy = ($checks.Count -eq $healthPaths.Count -and @($checks | Where-Object { $_.status -ne 200 }).Count -eq 0)
    checks = @($checks)
  }
}

function Get-RunningReview {
  $state = Read-ReviewState
  if (-not $state) { return $null }

  $process = Get-Process -Id $state.pid -ErrorAction SilentlyContinue
  $listener = Get-ReviewListener | Where-Object { $_.OwningProcess -eq $state.pid }
  if (-not $process -or -not $listener) { return $null }

  $health = Test-ReviewHealth
  if (-not $health.healthy) { return $null }

  return [pscustomobject]@{ state = $state; process = $process; health = $health }
}

switch ($Action) {
  'status' {
    $running = Get-RunningReview
    if (-not $running) {
      [pscustomobject]@{ running = $false; port = $Port; baseUrl = $baseUrl } | ConvertTo-Json -Compress
      exit 1
    }

    [pscustomobject]@{
      running = $true
      pid = [int]$running.state.pid
      port = $Port
      baseUrl = $baseUrl
      httpStatus = 200
      buildId = $running.state.buildId
      startedAt = $running.state.startedAt
      logFile = $running.state.logFile
      errorLogFile = $running.state.errorLogFile
      checks = $running.health.checks
    } | ConvertTo-Json -Compress -Depth 4
    exit 0
  }

  'stop' {
    $state = Read-ReviewState
    if (-not $state) {
      [pscustomobject]@{ stopped = $true; alreadyStopped = $true; port = $Port } | ConvertTo-Json -Compress
      exit 0
    }

    $process = Get-Process -Id $state.pid -ErrorAction SilentlyContinue
    $listener = Get-ReviewListener | Where-Object { $_.OwningProcess -eq $state.pid }
    if ($process -and $listener -and $process.ProcessName -eq 'node') {
      Stop-Process -Id $state.pid
      Wait-Process -Id $state.pid -Timeout 10 -ErrorAction SilentlyContinue
    }
    if ($state.launcherPid) {
      $launcher = Get-Process -Id $state.launcherPid -ErrorAction SilentlyContinue
      if ($launcher -and $launcher.ProcessName -eq 'cmd') {
        Stop-Process -Id $state.launcherPid
      }
    }

    if (Test-Path -LiteralPath $stateFile) {
      Remove-Item -LiteralPath $stateFile
    }
    [pscustomobject]@{ stopped = $true; pid = [int]$state.pid; port = $Port } | ConvertTo-Json -Compress
    exit 0
  }

  'start' {
    $running = Get-RunningReview
    if ($running) {
      [pscustomobject]@{
        running = $true
        reused = $true
        pid = [int]$running.state.pid
        port = $Port
        baseUrl = $baseUrl
        httpStatus = 200
        buildId = $running.state.buildId
        startedAt = $running.state.startedAt
        logFile = $running.state.logFile
        errorLogFile = $running.state.errorLogFile
        checks = $running.health.checks
      } | ConvertTo-Json -Compress -Depth 4
      exit 0
    }

    if (Test-Path -LiteralPath $stateFile) {
      Remove-Item -LiteralPath $stateFile
    }

    $otherListeners = Get-ReviewListener
    if ($otherListeners.Count -gt 0) {
      $owners = ($otherListeners.OwningProcess | Sort-Object -Unique) -join ', '
      throw "Port $Port is already owned by process $owners. Choose another review port."
    }

    $buildIdFile = Join-Path $repoRoot '.next\BUILD_ID'
    if (-not (Test-Path -LiteralPath $buildIdFile)) {
      throw 'No production build found. Run npm.cmd run build before starting the review server.'
    }

    $nextBin = Join-Path $repoRoot 'node_modules\next\dist\bin\next'
    if (-not (Test-Path -LiteralPath $nextBin)) {
      throw "Next.js launcher not found at $nextBin"
    }

    $null = New-Item -ItemType Directory -Path $reviewDir -Force
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $stdoutLog = Join-Path $reviewDir "review-$Port-$stamp.out.log"
    $stderrLog = Join-Path $reviewDir "review-$Port-$stamp.err.log"
    $commandFile = Join-Path $reviewDir "review-$Port-$stamp.cmd"
    $nodeExe = (Get-Command node -ErrorAction Stop).Source
    $commandLine = '"' + $nodeExe + '" "' + $nextBin + '" start -H 127.0.0.1 -p ' + $Port + ' 1>>"' + $stdoutLog + '" 2>>"' + $stderrLog + '"'
    @('@echo off', $commandLine) | Set-Content -LiteralPath $commandFile -Encoding Default

    $launcherProcess = Start-Process `
      -FilePath $env:ComSpec `
      -ArgumentList @('/d', '/c', ('"' + $commandFile + '"')) `
      -WorkingDirectory $repoRoot `
      -WindowStyle Hidden `
      -PassThru

    $health = $null
    for ($attempt = 0; $attempt -lt 80; $attempt += 1) {
      Start-Sleep -Milliseconds 250
      $launcherProcess.Refresh()
      if ($launcherProcess.HasExited) { break }
      try {
        $ready = Invoke-WebRequest -Uri "$baseUrl/" -UseBasicParsing -TimeoutSec 1
        if ([int]$ready.StatusCode -eq 200) {
          $health = Test-ReviewHealth
          if ($health.healthy) { break }
        }
      } catch {
        continue
      }
    }

    if (-not $health -or -not $health.healthy) {
      if (-not $launcherProcess.HasExited) { Stop-Process -Id $launcherProcess.Id }
      $stderr = if (Test-Path -LiteralPath $stderrLog) { Get-Content -LiteralPath $stderrLog -Raw -Encoding UTF8 } else { '' }
      throw "Local review server failed its health checks. See $stderrLog. $stderr"
    }

    $serverListener = Get-ReviewListener | Select-Object -First 1
    if (-not $serverListener) {
      Stop-Process -Id $launcherProcess.Id -ErrorAction SilentlyContinue
      throw "Health checks passed but no listener was found on port $Port."
    }
    $serverProcess = Get-Process -Id $serverListener.OwningProcess -ErrorAction Stop

    $state = [pscustomobject]@{
      pid = $serverProcess.Id
      launcherPid = $launcherProcess.Id
      port = $Port
      baseUrl = $baseUrl
      buildId = (Get-Content -LiteralPath $buildIdFile -Raw -Encoding UTF8).Trim()
      startedAt = (Get-Date).ToUniversalTime().ToString('o')
      processStartedAt = $serverProcess.StartTime.ToUniversalTime().ToString('o')
      executable = $nodeExe
      commandFile = $commandFile
      logFile = $stdoutLog
      errorLogFile = $stderrLog
    }
    $state | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $stateFile -Encoding UTF8

    [pscustomobject]@{
      running = $true
      reused = $false
      pid = $serverProcess.Id
      port = $Port
      baseUrl = $baseUrl
      httpStatus = 200
      buildId = $state.buildId
      startedAt = $state.startedAt
      logFile = $stdoutLog
      errorLogFile = $stderrLog
      checks = $health.checks
    } | ConvertTo-Json -Compress -Depth 4
    exit 0
  }
}
