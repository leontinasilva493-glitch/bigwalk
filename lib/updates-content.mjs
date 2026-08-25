export const currentVersion = Object.freeze({
  version: '1.4.10',
  checkedAt: '2026-08-25',
  officialUrl: 'https://bigwalk.game/history/',
  summary: 'The current official history leads with network, server, error-message, host/join warning, audio, and voice-stability fixes.',
});

export const updates = Object.freeze([
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
    playerImpact: 'This is historical launch context. Update to 1.4.10 instead of treating 1.4.7 workarounds as current.',
  },
]);
export const updateSources = Object.freeze([
  { title: 'Big Walk Version History', publisher: 'House House and Panic', url: 'https://bigwalk.game/history/', purpose: 'Official changelog and current version order.' },
  { title: 'Big Walk FAQ', publisher: 'House House and Panic', url: 'https://bigwalk.game/faq/', purpose: 'Official version compatibility, hosting, connection, audio, and support checks.' },
  { title: 'Version 1.4.8 — Fixes for quiet voices', publisher: 'House House on Steam', url: 'https://store.steampowered.com/news/app/1478500/view/689765153413005645', purpose: 'Official dated announcement for the first post-release voice patch.' },
]);
