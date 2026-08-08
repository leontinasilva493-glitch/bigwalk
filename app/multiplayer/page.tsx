import { EvidencePage, evidenceMetadata } from '../../components/evidence-page';
import { siteSectionBySlug } from '../../lib/content.mjs';

const page = siteSectionBySlug('multiplayer')!;
export const metadata = evidenceMetadata(page);
export default function MultiplayerPage() { return <EvidencePage page={page} />; }
