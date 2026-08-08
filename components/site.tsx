import Link from 'next/link';
import type { ReactNode } from 'react';
import { LanternWalker } from './game-elements';

const navigation = [
  { href: '/puzzles', label: 'Puzzles', key: 'puzzles' },
  { href: '/beginner-guide', label: 'Beginner Guide', key: 'beginner' },
  { href: '/multiplayer', label: 'Multiplayer', key: 'multiplayer' },
  { href: '/achievements', label: 'Achievements', key: 'achievements' },
] as const;

type NavigationKey = (typeof navigation)[number]['key'];

function MountainMark() {
  return (
    <svg aria-hidden="true" className="site-mark" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 22 7.2-11.6 4.2 6.3 3.3-5.5L25 22" />
      <path d="M3 22h22" />
    </svg>
  );
}

function NavigationLinks({ active }: { active?: NavigationKey }) {
  return navigation.map((item) => (
    <Link href={item.href} key={item.key} aria-current={active === item.key ? 'page' : undefined}>
      {item.label}
    </Link>
  ));
}

export function SiteHeader({ active }: { active?: NavigationKey }) {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Link className="site-brand" href="/">
          <MountainMark />
          <span>Big Walk Walkthrough</span>
        </Link>
        <div className="site-nav-links"><NavigationLinks active={active} /></div>
        <details className="mobile-nav">
          <summary aria-label="Open navigation"><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /></summary>
          <div className="mobile-nav-panel"><NavigationLinks active={active} /></div>
        </details>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="site-footer__brand">Big Walk Walkthrough</p>
        <p>Independent fan guide - not affiliated with the developers.</p>
      </div>
      <div className="site-footer__links">
        <Link href="/puzzles">Puzzles</Link>
        <Link href="/beginner-guide">Beginner Guide</Link>
        <Link href="/multiplayer">Multiplayer</Link>
        <Link href="/achievements">Achievements</Link>
      </div>
      <p>Evidence status: first-hand verification in progress.</p>
      <LanternWalker />
    </footer>
  );
}

export function SectionHeading({ kicker, title }: { kicker?: string; title: ReactNode }) {
  return <div className="section-heading">{kicker ? <p className="section-eyebrow">{kicker}</p> : null}<h2>{title}</h2></div>;
}
