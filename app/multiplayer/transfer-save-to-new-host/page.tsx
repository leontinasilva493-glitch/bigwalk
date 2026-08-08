import { EvidencePage, evidenceMetadata } from '../../../components/evidence-page';
import { siteSectionBySlug } from '../../../lib/content.mjs';

const page = siteSectionBySlug('multiplayer/transfer-save-to-new-host')!;
export const metadata = evidenceMetadata(page);
export default function TransferSavePage() { return <EvidencePage page={page} />; }
