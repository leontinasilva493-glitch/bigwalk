import type { CSSProperties } from 'react';

type WalkerColor = 'blue' | 'red' | 'green' | 'pink' | 'orange';
type WalkerPose = 'stand' | 'walk' | 'wave' | 'lift';

const walkerColors: Record<WalkerColor, string> = {
  blue: '#3B82C4',
  red: '#D8492B',
  green: '#3E9B4F',
  pink: '#EFA3B8',
  orange: '#E8913A',
};

export function Walker({ color = 'blue', pose = 'stand', className = '' }: { color?: WalkerColor; pose?: WalkerPose; className?: string }) {
  const style = { '--walker-body': walkerColors[color] } as CSSProperties;
  const legs = pose === 'walk' ? <><path d="M28 62 20 76" /><path d="M38 62 47 76" /></> : <><path d="M29 62 26 76" /><path d="M37 62 40 76" /></>;
  const arms = pose === 'wave'
    ? <><path d="M24 44 14 33 12 20" /><path d="M42 44 51 51" /></>
    : pose === 'lift'
      ? <><path d="M24 44 17 29" /><path d="M42 44 49 29" /></>
      : <><path d="M24 45 15 54" /><path d="M42 45 51 54" /></>;

  return (
    <svg aria-hidden="true" className={`walker ${className}`} viewBox="0 0 64 80" fill="none" style={style}>
      <ellipse cx="33" cy="43" rx="18" ry="23" fill="var(--walker-body)" stroke="#1F2420" strokeWidth="3.5" />
      <ellipse cx="33" cy="36" rx="10" ry="12" fill="#fff" stroke="#1F2420" strokeWidth="3" />
      <circle cx="33" cy="37" r="5" fill="#1F2420" />
      <circle cx="35" cy="35" r="1.8" fill="#fff" />
      <g stroke="#1F2420" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">{arms}{legs}</g>
    </svg>
  );
}

export function WalkerStack() {
  return (
    <div className="walker-stack" aria-hidden="true">
      <svg className="trail-dashes" viewBox="0 0 250 64" fill="none"><path d="M8 52C78 16 148 70 242 20" /></svg>
      <Walker color="orange" pose="lift" className="walker-stack__orange" />
      <Walker color="pink" pose="walk" className="walker-stack__pink" />
      <Walker color="blue" pose="stand" className="walker-stack__blue" />
      <Walker color="green" pose="wave" className="walker-stack__green" />
      <span className="brand-orb brand-orb--red" />
      <span className="brand-orb brand-orb--blue" />
      <span className="brand-orb brand-orb--sun" />
    </div>
  );
}

export function SignalFlareIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 40 40" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 17 8 15-7 4-8-15 7-4Z" fill="#C0392B" stroke="#8D241D" strokeWidth="2" />
      <path d="m13 10 3 3m6-7v5m8 2-4 2m-13-8 2 4" stroke="#F0B93C" strokeWidth="3" />
    </svg>
  );
}

export function LanternWalker() {
  return (
    <div className="lantern-walker" aria-hidden="true">
      <Walker color="blue" pose="wave" />
      <span className="lantern-walker__lamp"><i /></span>
    </div>
  );
}

export function RadioIcon({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16h20a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4Z" /><path d="m18 16 6-8" /><circle cx="19" cy="28" r="4" /><path d="M29 26h4m-4 6h4" /></svg>;
}

export function TrophyIcon({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8h16v11a8 8 0 0 1-16 0V8Z" /><path d="M16 12H8c0 7 3 10 10 10m14-10h8c0 7-3 10-10 10M24 27v9m-8 5h16" /><path d="M19 13h10" /></svg>;
}

export function MapIcon({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m7 11 11-4 12 4 11-4v29l-11 4-12-4-11 4V11Z" /><path d="M18 7v29m12-25v29" /><path d="m12 19 4 3-4 3" /></svg>;
}
