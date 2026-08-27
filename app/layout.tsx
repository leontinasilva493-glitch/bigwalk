import type { Metadata } from 'next';
import Script from 'next/script';
import {
  GOOGLE_ANALYTICS_SCRIPT_SRC,
  createGoogleAnalyticsBootstrap,
} from '../lib/google-analytics.mjs';
import '@fontsource/shantell-sans/500.css';
import '@fontsource/shantell-sans/700.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://bigwalkwalkthrough.com'),
  title: {
    default: 'Big Walk Hints & Puzzle Directory',
    template: '%s | Big Walk Walkthrough',
  },
  description:
    'Find Big Walk puzzle hints by tower, item, or location. Detailed solutions include clear route context and links to their official, editorial, or player sources.',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Big Walk Walkthrough',
    title: 'Big Walk Hints & Puzzle Directory',
    description:
      'Find Big Walk puzzle hints by tower, item, or location. Detailed solutions include clear route context and links to their official, editorial, or player sources.',
  },
  twitter: {
    card: 'summary',
    title: 'Big Walk Hints & Puzzle Directory',
    description:
      'Find Big Walk puzzle hints by tower, item, or location. Detailed solutions include clear route context and links to their official, editorial, or player sources.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          async
          src={GOOGLE_ANALYTICS_SCRIPT_SRC}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {createGoogleAnalyticsBootstrap()}
        </Script>
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xz3u8mp8w9");`}
        </Script>
      </body>
    </html>
  );
}
