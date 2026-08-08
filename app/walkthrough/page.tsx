import { EvidencePage, evidenceMetadata } from '../../components/evidence-page';
import { siteSectionBySlug } from '../../lib/content.mjs';

const page = siteSectionBySlug('walkthrough')!;
export const metadata = evidenceMetadata(page);
export default function WalkthroughPage() { return <EvidencePage page={page} />; }
