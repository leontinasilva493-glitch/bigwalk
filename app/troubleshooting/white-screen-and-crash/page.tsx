import { EvidencePage, evidenceMetadata } from '../../../components/evidence-page';
import { siteSectionBySlug } from '../../../lib/content.mjs';

const page = siteSectionBySlug('troubleshooting/white-screen-and-crash')!;
export const metadata = evidenceMetadata(page);
export default function WhiteScreenPage() { return <EvidencePage page={page} />; }
