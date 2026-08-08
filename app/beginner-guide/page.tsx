import { EvidencePage, evidenceMetadata } from '../../components/evidence-page';
import { siteSectionBySlug } from '../../lib/content.mjs';

const page = siteSectionBySlug('beginner-guide')!;
export const metadata = evidenceMetadata(page);
export default function BeginnerGuidePage() { return <EvidencePage page={page} />; }
