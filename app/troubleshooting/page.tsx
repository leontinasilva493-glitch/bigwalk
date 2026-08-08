import { EvidencePage, evidenceMetadata } from '../../components/evidence-page';
import { siteSectionBySlug } from '../../lib/content.mjs';

const page = siteSectionBySlug('troubleshooting')!;
export const metadata = evidenceMetadata(page);
export default function TroubleshootingPage() { return <EvidencePage page={page} />; }
