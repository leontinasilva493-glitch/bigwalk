import { EvidencePage, evidenceMetadata } from '../../../components/evidence-page';
import { siteSectionBySlug } from '../../../lib/content.mjs';

const page = siteSectionBySlug('puzzles/purple-challenges')!;
export const metadata = evidenceMetadata(page);
export default function PurpleChallengesPage() { return <EvidencePage page={page} />; }
