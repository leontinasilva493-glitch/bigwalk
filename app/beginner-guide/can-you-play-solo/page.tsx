import { EvidencePage, evidenceMetadata } from '../../../components/evidence-page';
import { siteSectionBySlug } from '../../../lib/content.mjs';

const page = siteSectionBySlug('beginner-guide/can-you-play-solo')!;
export const metadata = evidenceMetadata(page);
export default function CanYouPlaySoloPage() { return <EvidencePage page={page} />; }
