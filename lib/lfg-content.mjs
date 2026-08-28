export const lfgGuide = Object.freeze({
  slug: 'multiplayer/how-to-find-players',
  gameVersion: '1.5.0',
  lastChecked: '2026-08-28',
  channels: Object.freeze([
    {
      name: 'Reddit r/BigWalk daily LFG Megathread',
      href: 'https://www.reddit.com/r/BigWalk/comments/1vzklgx/looking_for_group_megathread_27_august_2026/',
      fallbackHref: 'https://www.reddit.com/r/BigWalk/',
      linkLabel: 'Looking for Group Megathread (27 August 2026)',
      activity: 'Active through the 28 August check with fresh worlds, first playthroughs, tower progress, and 100% rooms. Daily threads close when the next thread opens, so use the subreddit fallback if this link is locked.',
    },
    {
      name: 'Steam Discussions — Big Walk General Discussions',
      href: 'https://steamcommunity.com/app/1478500/discussions/',
      linkLabel: 'Open Big Walk Steam Discussions',
      activity: 'The first current forum page still contains repeated player-finding posts alongside session-discovery and startup reports. Verify ownership context before following an off-site invitation.',
    },
  ]),
  postingFields: Object.freeze(['Platform', 'Region / time zone', 'Language', 'Age range', 'Mic preference', 'Current progress', 'Goal', 'Spoiler preference', 'Game version', 'Host preference', 'Availability']),
  postingExample: `Platform: PC / Mac
Region / time zone: Europe (UTC+2)
Language: English
Age range: 18+
Mic preference: Mic preferred, text okay
Current progress: Fresh world
Goal: Relaxed first playthrough
Spoiler preference: No solutions unless the group asks
Game version: 1.5.0
Host preference: I can host consistently
Availability: Friday 19:00–22:00 UTC+2`,
  fitRows: Object.freeze([
    { topic: 'Experience', matchOn: 'First-timer, returning player, or completion guide', why: 'Experienced players can unintentionally solve the session before newcomers discover it.' },
    { topic: 'World setting', matchOn: '2-player, 3-player, or 4+ world', why: 'The host selects the minimum challenge configuration; it is not the room capacity.' },
    { topic: 'Current progress', matchOn: 'Fresh, named towers complete, first ending, or 100% cleanup', why: 'Joining a late world can expose routes and ending states immediately.' },
    { topic: 'Spoiler preference', matchOn: 'Blind, hint-only, or full guidance welcome', why: 'Big Walk is discovery-led, so this boundary matters more than mechanical skill.' },
    { topic: 'Session time', matchOn: 'Time zone, start time, and expected duration', why: 'The world belongs to one host and often continues across multiple sessions.' },
    { topic: 'Communication', matchOn: 'Voice, text, language, and accessibility needs', why: 'Voice and text both follow the game communication rules; the group should plan for every player.' },
    { topic: 'Host continuity', matchOn: 'Who can reliably reopen the save', why: 'Official rules give world progress to the host, so an occasional player is a poor long-term owner.' },
    { topic: 'Safety and conduct', matchOn: 'Broad age range, moderation expectations, recording, and behavior', why: 'Agree before sharing private room credentials or entering voice chat.' },
  ]),
  safeJoinSteps: Object.freeze([
    { title: 'Post the group brief, not a live code', body: 'Share the fit fields in the current LFG space and wait for compatible replies. Do not publish a permanent contact detail, Join Code, or Session Password on this site.' },
    { title: 'Compare progress and spoiler boundaries', body: 'Confirm the world setting, completed towers, ending state, and whether the room is blind, hint-only, or completion-focused.' },
    { title: 'Choose the continuing host', body: 'Use the player who can reliably return because official rules assign the saved world to that host.' },
    { title: 'Set the required Session Password', body: 'The host loads the intended save, sets a password, and waits until their character is fully inside the world.' },
    { title: 'Exchange the current Join Code privately', body: 'Send the code and password by direct message only after the group is agreed. Anyone with both values may attempt to join.' },
    { title: 'Replace stale credentials after a restart', body: 'If the host restarts or changes the password, send the new active details privately and mark the old room as closed.' },
  ]),
  sources: Object.freeze([
    { title: 'Big Walk FAQ', publisher: 'House House and Panic', url: 'https://bigwalk.game/faq/', note: 'Official no-matchmaking, host-save, Join Code, password, moderation, and version rules.' },
    { title: 'Looking for Group Megathread — 27 August 2026', publisher: 'r/BigWalk', url: 'https://www.reddit.com/r/BigWalk/comments/1vzklgx/looking_for_group_megathread_27_august_2026/', note: 'Current real group posts across new games, tower progress, first ending, 100% cleanup, language, age, mic, and reconnect states.' },
    { title: 'Big Walk General Discussions', publisher: 'Steam Community', url: 'https://steamcommunity.com/app/1478500/discussions/', note: 'Current player-finding and session-problem posts; invitations are community-run.' },
  ]),
});
