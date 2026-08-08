import { LaunchPageTemplate, launchMetadata } from '../../../components/launch-page';

const page = {
  slug: 'multiplayer/drop-in-host-save',
  title: 'Big Walk Drop-In, Host & Save Guide — Verification in Progress',
  h1: 'Big Walk Drop-In, Host, and Save Guide',
  description: 'Verified notes about joining, leaving, hosting, and saves in Big Walk are being prepared from first-hand sessions.',
  active: 'multiplayer' as const,
  illustration: 'radio' as const,
  scope: 'The finished page will separate directly observed multiplayer behaviour from unverified reports and will include the game version checked.',
};

export const metadata = launchMetadata(page);
export default function DropInHostSavePage() { return <LaunchPageTemplate page={page} />; }
