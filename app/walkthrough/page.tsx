import { EvidencePage, evidenceMetadata } from '../../components/evidence-page';
import { guides, siteSectionBySlug } from '../../lib/content.mjs';

const page = siteSectionBySlug('walkthrough')!;
const walkthroughGuides = guides.filter((guide) => guide.kind === 'walkthrough');
export const metadata = evidenceMetadata(page);
export default function WalkthroughPage() { return <EvidencePage page={page} featuredGuides={walkthroughGuides} />; }
