import { LaunchPageTemplate, launchMetadata } from '../../components/launch-page';

const page = {
  slug: 'beginner-guide',
  title: 'Big Walk Beginner Guide — Verification in Progress',
  h1: 'Big Walk Beginner Guide',
  description: 'A first-hand Big Walk beginner guide is being prepared and will be published after the opening experience is verified.',
  active: 'beginner' as const,
  illustration: 'walker' as const,
  scope: 'The final guide will cover the opening loop, how to recognise useful clues, and how to ask for help without removing the discovery from a first playthrough.',
};

export const metadata = launchMetadata(page);
export default function BeginnerGuidePage() { return <LaunchPageTemplate page={page} />; }
