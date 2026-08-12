import { TroubleshootingGuide, troubleshootingMetadata } from '../../../components/troubleshooting-guide';
import { troubleshootingBySlug } from '../../../lib/troubleshooting-content.mjs';

const guide = troubleshootingBySlug('cant-rejoin-after-disconnect')!;
export const metadata = troubleshootingMetadata(guide);
export default function CantRejoinPage() { return <TroubleshootingGuide guide={guide} />; }
