import { LaunchPageTemplate, launchMetadata } from '../../../components/launch-page';

const page = {
  slug: 'multiplayer/best-group-size',
  title: 'Best Big Walk Group Size — Verification in Progress',
  h1: 'What Is the Best Group Size in Big Walk?',
  description: 'A first-hand comparison of Big Walk group sizes is being prepared and will be published after multiplayer sessions are verified.',
  active: 'multiplayer' as const,
  illustration: 'radio' as const,
  scope: 'The final comparison will document how different group sizes affect communication, exploring, and the experience of solving puzzles together.',
};

export const metadata = launchMetadata(page);
export default function BestGroupSizePage() { return <LaunchPageTemplate page={page} />; }
