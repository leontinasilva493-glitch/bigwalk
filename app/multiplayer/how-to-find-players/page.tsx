import { EvidencePage, evidenceMetadata } from '../../../components/evidence-page';
import { siteSectionBySlug } from '../../../lib/content.mjs';

const page = siteSectionBySlug('multiplayer/how-to-find-players')!;
export const metadata = evidenceMetadata(page);
export default function FindPlayersPage() { return <EvidencePage page={page} />; }
