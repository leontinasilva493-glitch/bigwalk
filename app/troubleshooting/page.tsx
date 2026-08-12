import { evidenceMetadata } from '../../components/evidence-page';
import { TroubleshootingHub } from '../../components/troubleshooting-guide';
import { siteSectionBySlug } from '../../lib/content.mjs';

const page = siteSectionBySlug('troubleshooting')!;
export const metadata = evidenceMetadata(page);
export default function TroubleshootingPage() { return <TroubleshootingHub />; }
