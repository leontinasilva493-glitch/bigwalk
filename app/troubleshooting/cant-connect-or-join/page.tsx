import { TroubleshootingGuide, troubleshootingMetadata } from '../../../components/troubleshooting-guide';
import { troubleshootingBySlug } from '../../../lib/troubleshooting-content.mjs';

const guide = troubleshootingBySlug('cant-connect-or-join')!;
export const metadata = troubleshootingMetadata(guide);
export default function CantConnectOrJoinPage() { return <TroubleshootingGuide guide={guide} />; }
