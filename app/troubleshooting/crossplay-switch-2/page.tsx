import { EvidencePage, evidenceMetadata } from '../../../components/evidence-page';
import { siteSectionBySlug } from '../../../lib/content.mjs';

const page = siteSectionBySlug('troubleshooting/crossplay-switch-2')!;
export const metadata = evidenceMetadata(page);
export default function CrossplayPage() { return <EvidencePage page={page} />; }
