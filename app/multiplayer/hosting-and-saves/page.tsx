import { EvidencePage, evidenceMetadata } from '../../../components/evidence-page';
import { siteSectionBySlug } from '../../../lib/content.mjs';

const page = siteSectionBySlug('multiplayer/hosting-and-saves')!;
export const metadata = evidenceMetadata(page);
export default function HostingAndSavesPage() { return <EvidencePage page={page} />; }
