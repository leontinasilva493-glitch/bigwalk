import { TroubleshootingGuide, troubleshootingMetadata } from '../../../components/troubleshooting-guide';
import { troubleshootingBySlug } from '../../../lib/troubleshooting-content.mjs';

const guide = troubleshootingBySlug('save-corrupted-or-missing')!;
export const metadata = troubleshootingMetadata(guide);
export default function SaveCorruptedPage() { return <TroubleshootingGuide guide={guide} />; }
