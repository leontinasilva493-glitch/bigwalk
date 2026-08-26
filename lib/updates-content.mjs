export const currentVersion = Object.freeze({
  version: '1.5.0',
  checkedAt: '2026-08-26',
  pagePublishedAt: '2026-08-25',
  officialUrl: 'https://bigwalk.game/history/',
  faqUrl: 'https://bigwalk.game/faq/',
  summary: 'The newest official entry is 1.5.0, a one-line maintenance patch for a patch of trees that was missing collision.',
  directAnswer: 'As checked on August 26, 2026, House House lists Big Walk 1.5.0 as the newest official version. The official history does not publish a release date, so this page cannot confirm that it shipped today. The entry contains one fix for a patch of trees that was missing collision.',
  conditions: [
    'Version 1.5.0 lists one collision fix and no new island, puzzle, or gameplay feature.',
    'Version 1.4.10 remains the larger network and voice-stability update immediately below it.',
    'The official FAQ says the first two version numbers must match, so 1.4.x and 1.5.x players cannot join one another.',
  ],
});

export const updates = Object.freeze([
  {
    version: '1.5.0',
    releaseDate: null,
    label: 'Missing tree collision',
    official: true,
    changes: [
      'Fixes one patch of trees that was missing collision.',
    ],
    playerImpact: 'Update before comparing collision behavior around tree patches. The official note lists no new island, puzzle, or progression content.',
  },
  {
    version: '1.4.10',
    releaseDate: '2026-08-21',
    label: 'Connection and voice stability',
    official: true,
    changes: [
      'Improves network connection and stability.',
      'Fixes a server that could stop responding after a player disconnects.',
      'Adds more specific network failure messages and host/join warnings.',
      'Makes player voices less likely to cut out or stop working.',
      'Adjusts locator-item audio and fixes the start of the flare-item sound effect.',
    ],
    playerImpact: 'Install this version before diagnosing repeat disconnects or voice dropouts. Copy any new warning or exact error message before contacting support.',
  },
  {
    version: '1.4.9',
    releaseDate: '2026-08-20',
    label: 'Passwords, display settings, and save protection',
    official: true,
    changes: [
      'Requires a Session Password when starting a game.',
      'Adds Invert Look X, Frame Rate Limit, and half-rate Vsync options.',
      'Enables Vsync by default and improves save-data protection.',
      'Fixes repeated-completion, wall clipping, turnstile, collider, and carried-player disconnect cases.',
    ],
    playerImpact: 'A host who cannot start a session should set a password first. Groups returning to an older save should update before repeating a challenge that appeared completed.',
  },
  {
    version: '1.4.8',
    releaseDate: '2026-08-07',
    label: 'Quiet voice normalization',
    official: true,
    changes: [
      'Fixes loading failures caused by gamepads with unusual names.',
      'Normalizes voice input so unusually quiet microphones sound closer to the intended level.',
    ],
    playerImpact: 'This patch raises quiet input; it does not remove Big Walk’s intentional distance-based voice falloff.',
  },
  {
    version: '1.4.7',
    releaseDate: '2026-08-04',
    label: 'Launch connection fixes',
    official: true,
    changes: [
      'Improves connection and moderation warnings.',
      'Improves host stability and the friends-game browser.',
      'Fixes very short passwords when an on-screen keyboard is used.',
    ],
    playerImpact: 'This is historical launch context. Update to 1.5.0 instead of treating 1.4.7 workarounds as current.',
  },
]);
export const updateSources = Object.freeze([
  { title: 'Big Walk Version History', publisher: 'House House and Panic', url: 'https://bigwalk.game/history/', purpose: 'Official changelog and current version order.' },
  { title: 'Big Walk FAQ', publisher: 'House House and Panic', url: 'https://bigwalk.game/faq/', purpose: 'Official version compatibility, hosting, connection, audio, and support checks.' },
  { title: 'Version 1.4.8 — Fixes for quiet voices', publisher: 'House House on Steam', url: 'https://store.steampowered.com/news/app/1478500/view/689765153413005645', purpose: 'Official dated announcement for the first post-release voice patch.' },
]);
