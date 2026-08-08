import { LaunchPageTemplate, launchMetadata } from '../../components/launch-page';

const page = {
  slug: 'achievements',
  title: 'Big Walk Achievements & Trophies — Verification in Progress',
  h1: 'Big Walk Achievements and Trophies',
  description: 'A verified Big Walk achievements and trophies reference is being prepared with first-hand requirements and annotated evidence.',
  active: 'achievements' as const,
  illustration: 'trophy' as const,
  scope: 'The finished reference will list only achievements whose conditions can be verified, with screenshots where they clarify a requirement.',
};

export const metadata = launchMetadata(page);
export default function AchievementsPage() { return <LaunchPageTemplate page={page} />; }
