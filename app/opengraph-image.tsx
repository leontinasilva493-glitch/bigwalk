import { ImageResponse } from 'next/og';

export const alt = 'Big Walk Walkthrough original field-guide illustration';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

function Walker({ color, eyeLeft, eyeTop }: { color: string; eyeLeft: number; eyeTop: number }) {
  return (
    <div style={{ display: 'flex', position: 'relative', width: 142, height: 178 }}>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: 28,
          width: 116,
          height: 132,
          border: '8px solid #1f2420',
          borderRadius: 58,
          background: color,
        }}
      />
      <div style={{ display: 'flex', position: 'absolute', left: eyeLeft, top: eyeTop, width: 39, height: 39, borderRadius: 22, background: '#fff', border: '6px solid #1f2420' }}>
        <div style={{ display: 'flex', width: 12, height: 12, margin: 8, borderRadius: 8, background: '#1f2420' }} />
      </div>
      <div style={{ display: 'flex', position: 'absolute', left: 34, bottom: 0, width: 9, height: 36, borderRadius: 8, background: '#1f2420', transform: 'rotate(9deg)' }} />
      <div style={{ display: 'flex', position: 'absolute', right: 24, bottom: 0, width: 9, height: 36, borderRadius: 8, background: '#1f2420', transform: 'rotate(-9deg)' }} />
    </div>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'linear-gradient(130deg, #bfd9e2 0%, #d8e8ed 48%, #faf7f0 75%)', color: '#1f2420' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 680, padding: '86px 0 80px 88px' }}>
          <div style={{ display: 'flex', color: '#8a5a17', fontSize: 26, fontWeight: 700, letterSpacing: 3 }}>A FIELD GUIDE FOR CURIOUS WALKERS</div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Big Walk<br />Walkthrough</div>
          <div style={{ display: 'flex', marginTop: 26, width: 540, color: '#465148', fontSize: 30, lineHeight: 1.35 }}>Spoiler-conscious hints and evidence-checked puzzle guides.</div>
        </div>
        <div style={{ display: 'flex', position: 'absolute', right: 88, bottom: 72, width: 420, height: 340 }}>
          <div style={{ display: 'flex', position: 'absolute', left: 12, bottom: 82, transform: 'rotate(-7deg)' }}><Walker color="#3b82c4" eyeLeft={47} eyeTop={32} /></div>
          <div style={{ display: 'flex', position: 'absolute', left: 130, bottom: 126, transform: 'rotate(6deg)' }}><Walker color="#3e9b4f" eyeLeft={50} eyeTop={29} /></div>
          <div style={{ display: 'flex', position: 'absolute', left: 90, bottom: 0, transform: 'rotate(-3deg)' }}><Walker color="#e8913a" eyeLeft={45} eyeTop={36} /></div>
          <div style={{ display: 'flex', position: 'absolute', right: 8, bottom: 2, transform: 'rotate(8deg)' }}><Walker color="#efa3b8" eyeLeft={48} eyeTop={31} /></div>
        </div>
        <div style={{ display: 'flex', position: 'absolute', right: -95, bottom: -130, width: 650, height: 300, border: '2px solid #9ebdca', borderRadius: 340 }} />
        <div style={{ display: 'flex', position: 'absolute', right: 148, top: 146, width: 18, height: 18, borderRadius: 9, background: '#f0b93c' }} />
        <div style={{ display: 'flex', position: 'absolute', right: 104, top: 115, width: 18, height: 18, borderRadius: 9, background: '#d8492b' }} />
      </div>
    ),
    size,
  );
}
