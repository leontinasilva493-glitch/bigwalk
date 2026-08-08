import { EvidencePage, evidenceMetadata } from '../../../components/evidence-page';
import { siteSectionBySlug } from '../../../lib/content.mjs';

const page = siteSectionBySlug('troubleshooting/voice-chat-not-working')!;
export const metadata = evidenceMetadata(page);
export default function VoiceChatPage() { return <EvidencePage page={page} />; }
