export const troubleshootingGuides = [
  {
    slug: 'cant-rejoin-after-disconnect',
    title: 'Big Walk Cannot Rejoin After Disconnect — Recovery Checks',
    h1: 'Cannot Rejoin Big Walk After a Disconnect',
    description: 'Separate an expired join code, a host-world problem, and a repeatable black-screen or crash symptom before trying recovery steps.',
    summary: 'Start with the original host. Big Walk worlds are saved by the host, so a joiner cannot restore that world by opening a different save. Get a fresh code from the original host, then record whether the failure happens before loading, during loading, or after entering the world.',
    updated: '2026-08-11',
    indexable: false,
    verificationLabel: 'Official save behavior + community symptom reports',
    quickChecks: [
      'Confirm that the original host has opened the intended saved world.',
      'Use a newly displayed join code instead of reusing a code from the disconnected session.',
      'Record the exact failure point: code rejected, loading screen, black screen, or crash.',
      'Have the host and joiner both restart the game before one controlled retry.',
    ],
    diagnosticSteps: [
      { title: 'Confirm save ownership', action: 'Ask who originally hosted the world and have that player load it.', reason: 'The official FAQ says progress is saved on the host side. A different host creates a different world-state test.' },
      { title: 'Generate a fresh session code', action: 'The host should open the intended world and share the currently displayed join code.', reason: 'This rules out an old session identifier without claiming that every rejoin failure is code-related.' },
      { title: 'Classify the symptom', action: 'Note whether the joiner sees rejection, endless loading, a black screen, or a full crash.', reason: 'Community reports describe more than one failure mode; they should not be treated as a single bug.' },
      { title: 'Run one clean retry', action: 'Restart both game clients, reopen the same host world, and retry once with the fresh code.', reason: 'If the result repeats, preserve the platform, build, host/joiner role, and failure point for a useful report.' },
    ],
    sources: [
      { title: 'Big Walk FAQ', publisher: 'House House', url: 'https://bigwalk.game/faq/', note: 'Official source for host-owned saves and join-code behavior.' },
      { title: 'Black screen upon joining or hosting lobby', publisher: 'Reddit community report', url: 'https://www.reddit.com/r/BigWalk/comments/1vglb2n/black_screen_upon_joining_hosting_lobby/', note: 'A symptom report, not a confirmed universal cause or fix.' },
      { title: 'Looking for Group Megathread — 10 August 2026', publisher: 'Reddit community thread', url: 'https://www.reddit.com/r/BigWalk/comments/1vkbkpc/looking_for_group_megathread_10_august_2026/', note: 'Contains player reports involving crashes and reconnection.' },
    ],
    evidenceNeeds: [
      'A repeatable host-and-joiner test on each affected platform and current game build.',
      'Confirmation of whether a fresh code changes the result for each distinct symptom.',
      'An official support note or patch note that identifies a cause or supported recovery path.',
    ],
    relatedSlugs: ['voice-chat-not-working', 'white-screen-and-crash'],
  },
  {
    slug: 'voice-chat-not-working',
    title: 'Big Walk Voice Chat Not Working — Proximity and Mic Checks',
    h1: 'Big Walk Voice Chat Not Working',
    description: 'Check proximity behavior, microphone input, permissions, and the current quiet-microphone patch before treating normal distance falloff as a fault.',
    summary: 'Test while standing beside another player. Big Walk deliberately uses proximity voice, so distant players becoming quiet or inaudible is expected behavior. A reported August 2026 patch raises very quiet microphone input, but it does not remove distance-based falloff.',
    updated: '2026-08-11',
    indexable: false,
    verificationLabel: 'Design behavior reported from developer patch notes; device steps need local testing',
    quickChecks: [
      'Stand directly beside another player before testing input and output.',
      'Confirm the intended microphone is the operating system default input device.',
      'Check that Big Walk has microphone permission and that the microphone is not muted.',
      'Install the current game update, then restart the game after changing device settings.',
    ],
    diagnosticSteps: [
      { title: 'Rule out normal proximity falloff', action: 'Have two players stand side by side and speak at normal volume.', reason: 'The game intentionally limits how far voices carry; long-distance silence is not evidence that voice chat is broken.' },
      { title: 'Check the captured input', action: 'Verify the active system input device, its level meter, mute state, and Big Walk microphone permission.', reason: 'This separates a device or permission problem from the game’s spatial voice behavior.' },
      { title: 'Compare both directions', action: 'Test A hearing B, then B hearing A, without changing distance.', reason: 'One-way failure usually points to one player’s input or the other player’s output path.' },
      { title: 'Retest on the current patch', action: 'Update and fully restart both clients before repeating the close-range test.', reason: 'Reporting on the quiet microphone patch says low input was boosted while proximity falloff remained intentional.' },
    ],
    sources: [
      { title: 'Big Walk FAQ', publisher: 'House House', url: 'https://bigwalk.game/faq/', note: 'Official game and multiplayer context.' },
      { title: 'Big Walk patch addresses voice volume complaints', publisher: 'PC Gamer', url: 'https://www.pcgamer.com/games/puzzle/big-walk-patch-addresses-voice-volume-complaints-with-restraint-we-consider-it-an-important-part-of-the-games-design-that-you-can-only-hear-players-who-are-close-to-you/', note: 'Reports the developer patch note: quiet microphones were boosted while proximity remained part of the design.' },
    ],
    evidenceNeeds: [
      'Current close-range voice tests on PC and PS5, including one-way failure cases.',
      'Screenshots of relevant operating-system and in-game audio controls.',
      'Official troubleshooting guidance for permissions, selected devices, or known platform-specific faults.',
    ],
    relatedSlugs: ['cant-rejoin-after-disconnect', 'white-screen-and-crash'],
  },
  {
    slug: 'white-screen-and-crash',
    title: 'Big Walk White Screen or Crash — Startup Triage',
    h1: 'Big Walk White Screen or Crash',
    description: 'Identify whether Big Walk fails at launch, while joining, or during a session, then use safe platform checks without overstating community workarounds.',
    summary: 'Treat a white screen at launch, a black screen while joining, and an in-session crash as separate symptoms. Update first, verify the installation on supported PC stores, and change only one variable per retry so the result is useful.',
    updated: '2026-08-11',
    indexable: false,
    verificationLabel: 'Safe platform checks + clearly labelled community reports',
    quickChecks: [
      'Write down whether the failure occurs at launch, while joining, or after entering a world.',
      'Install pending game, launcher, operating-system, and graphics-driver updates.',
      'On Steam, verify the installed game files before reinstalling the entire game.',
      'Disconnect nonessential USB devices one at a time only as a diagnostic experiment.',
    ],
    diagnosticSteps: [
      { title: 'Name the exact symptom', action: 'Record screen color, error text, sound behavior, and the last visible screen.', reason: 'White-screen launch reports and black-screen join reports may have different causes.' },
      { title: 'Restore a known-good install state', action: 'Update the game and platform software, restart the device, then use the launcher’s file-verification feature where available.', reason: 'These are reversible platform checks; they do not assume a Big Walk-specific root cause.' },
      { title: 'Test peripherals carefully', action: 'If the failure occurs at launch, disconnect one nonessential USB device, retry once, then reconnect it.', reason: 'One community-reported USB keyboard workaround is not a confirmed fix. Single-variable testing keeps the result interpretable.' },
      { title: 'Capture a reproducible report', action: 'Save platform, game build, hardware, host/joiner role, logs or error text, and the shortest reproduction sequence.', reason: 'A precise report is more actionable than repeatedly reinstalling without knowing which symptom changed.' },
    ],
    sources: [
      { title: 'Verify integrity of game files', publisher: 'Steam Support', url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB', note: 'Platform-level file verification guidance.' },
      { title: 'Cannot launch game', publisher: 'Reddit community report', url: 'https://www.reddit.com/r/BigWalk/comments/1vfvwtt/cant_launch_game/', note: 'A community-reported USB keyboard experiment, not a confirmed fix.' },
      { title: 'Black screen upon joining or hosting lobby', publisher: 'Reddit community report', url: 'https://www.reddit.com/r/BigWalk/comments/1vglb2n/black_screen_upon_joining_hosting_lobby/', note: 'A separate join-time symptom report.' },
    ],
    evidenceNeeds: [
      'A reproducible launch failure with current build, platform, and hardware details.',
      'Controlled before-and-after results for file verification and peripheral tests.',
      'Official known-issue or patch-note confirmation before promoting any Big Walk-specific fix.',
    ],
    relatedSlugs: ['cant-rejoin-after-disconnect', 'voice-chat-not-working'],
  },
];

export function troubleshootingBySlug(slug) {
  return troubleshootingGuides.find((guide) => guide.slug === slug);
}
