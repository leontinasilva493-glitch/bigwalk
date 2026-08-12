import { TroubleshootingGuide, troubleshootingMetadata } from '../../../components/troubleshooting-guide';
import { troubleshootingBySlug } from '../../../lib/troubleshooting-content.mjs';

const guide = troubleshootingBySlug('white-screen-and-crash')!;
export const metadata = troubleshootingMetadata(guide);
export default function WhiteScreenPage() { return <TroubleshootingGuide guide={guide} />; }
