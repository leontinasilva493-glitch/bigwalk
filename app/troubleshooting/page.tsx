import type { Metadata } from 'next';
import { evidenceMetadata } from '../../components/evidence-page';
import { TroubleshootingHub } from '../../components/troubleshooting-guide';
import { siteSectionBySlug } from '../../lib/content.mjs';

const page = siteSectionBySlug('troubleshooting')!;
const baseMetadata = evidenceMetadata(page);

export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    images: [{
      url: '/images/editorial/big-walk-troubleshooting-help-fixes-guide.webp',
      width: 1536,
      height: 1024,
      alt: 'Big Walk troubleshooting help scene with explorers checking voice chat, reconnect, and startup paths',
    }],
  },
  twitter: {
    ...baseMetadata.twitter,
    card: 'summary_large_image',
    images: ['/images/editorial/big-walk-troubleshooting-help-fixes-guide.webp'],
  },
};

export default function TroubleshootingPage() { return <TroubleshootingHub />; }
