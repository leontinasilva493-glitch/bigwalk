import { TroubleshootingGuide, troubleshootingMetadata } from '../../../components/troubleshooting-guide';
import { troubleshootingBySlug } from '../../../lib/troubleshooting-content.mjs';

const guide = troubleshootingBySlug('voice-chat-not-working')!;
export const metadata = troubleshootingMetadata(guide);
export default function VoiceChatPage() { return <TroubleshootingGuide guide={guide} />; }
