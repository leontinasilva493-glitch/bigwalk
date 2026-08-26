import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import net from 'node:net';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const scriptPath = fileURLToPath(new URL('../scripts/local-review.ps1', import.meta.url));
const buildIdPath = new URL('../.next/BUILD_ID', import.meta.url);

async function availablePort() {
  return await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : undefined;
      server.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

function runReviewScript(action, port) {
  return spawnSync('powershell.exe', [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', scriptPath,
    '-Action', action,
    '-Port', String(port),
  ], {
    cwd: root,
    encoding: 'utf8',
    timeout: 30_000,
  });
}

test('local review server survives its launcher and reports a healthy production preview', { timeout: 45_000 }, async (t) => {
  if (process.platform !== 'win32') return t.skip('Windows persistence contract');
  try {
    await access(buildIdPath);
  } catch {
    return t.skip('requires a completed Next.js production build');
  }

  const port = await availablePort();
  try {
    const started = runReviewScript('start', port);
    assert.equal(started.status, 0, `${started.stdout}\n${started.stderr}`);

    const response = await fetch(`http://127.0.0.1:${port}/patch-notes`);
    assert.equal(response.status, 200, 'preview must remain reachable after the start command exits');

    const status = runReviewScript('status', port);
    assert.equal(status.status, 0, `${status.stdout}\n${status.stderr}`);
    const state = JSON.parse(status.stdout.trim());
    assert.equal(state.running, true);
    assert.equal(state.port, port);
    assert.equal(state.httpStatus, 200);
    assert.match(state.logFile, /\.local-review/i);
  } finally {
    runReviewScript('stop', port);
  }
});
