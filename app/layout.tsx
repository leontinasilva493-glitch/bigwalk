import type { Metadata } from 'next';
import { Fredoka, Inter, Shantell_Sans } from 'next/font/google';
import './globals.css';

const brandFont = Shantell_Sans({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-brand', display: 'swap' });
const displayFont = Fredoka({ subsets: ['latin'], weight: ['600'], variable: '--font-display', display: 'swap' });
const bodyFont = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://bigwalkwalkthrough.com'),
  title: {
    default: 'Big Walk Hints & Puzzle Directory',
    template: '%s | Big Walk Walkthrough',
  },
  description:
    'Find Big Walk puzzle hints by tower, item, or location. Verified solutions and original marked screenshots are added only after first-hand verification.',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Big Walk Walkthrough',
    title: 'Big Walk Hints & Puzzle Directory',
    description:
      'Find Big Walk puzzle hints by tower, item, or location. Verified solutions and original marked screenshots are added only after first-hand verification.',
  },
  twitter: {
    card: 'summary',
    title: 'Big Walk Hints & Puzzle Directory',
    description:
      'Find Big Walk puzzle hints by tower, item, or location. Verified solutions and original marked screenshots are added only after first-hand verification.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${brandFont.variable} ${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
