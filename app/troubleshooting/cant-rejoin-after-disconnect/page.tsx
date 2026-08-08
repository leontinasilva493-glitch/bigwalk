import { EvidencePage, evidenceMetadata } from '../../../components/evidence-page';
import { siteSectionBySlug } from '../../../lib/content.mjs';

const page = siteSectionBySlug('troubleshooting/cant-rejoin-after-disconnect')!;
export const metadata = evidenceMetadata(page);
export default function CantRejoinPage() { return <EvidencePage page={page} />; }
