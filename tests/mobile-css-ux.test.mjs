import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const styles = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');

test('mobile guide table of contents is a 44px touch-friendly horizontal strip', () => {
  const mobileRules = styles.match(/@media \(max-width: 768px\) \{[\s\S]*\n\}/)?.[0] ?? '';

  assert.match(mobileRules, /\.guide-toc\s*\{[^}]*overflow-x:\s*auto[^}]*white-space:\s*nowrap/s);
  assert.match(mobileRules, /\.guide-toc\s+a\s*\{[^}]*min-height:\s*44px/s);
  assert.match(mobileRules, /\.guide-toc\s*\{[^}]*-webkit-overflow-scrolling:\s*touch/s);
});

test('recovery guidance uses a desktop table and mobile disclosure cards', () => {
  assert.match(styles, /\.route-recovery__mobile-list\s*\{[^}]*display:\s*none/s);

  const mobileRules = styles.match(/@media \(max-width: 767px\) \{[\s\S]*\n\}/)?.[0] ?? '';
  assert.match(mobileRules, /\.route-recovery__table-wrap\s*\{[^}]*display:\s*none/s);
  assert.match(mobileRules, /\.route-recovery__mobile-list\s*\{[^}]*display:\s*grid/s);
  assert.match(mobileRules, /\.route-recovery__mobile-card\s+summary\s*\{[^}]*min-height:\s*44px/s);
});

test('homepage hero actions stack at full width on phones', () => {
  const mobileRules = styles.match(/@media \(max-width: 767px\) \{[\s\S]*\n\}/)?.[0] ?? '';

  assert.match(mobileRules, /\.home-path-actions\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(mobileRules, /\.home-path-action\s*\{[^}]*width:\s*100%/s);
});

test('tablet landscape uses the compact navigation through 1024px', () => {
  const tabletRules = styles.match(/@media \(max-width: 1024px\) \{[\s\S]*?\n\}/)?.[0] ?? '';

  assert.match(tabletRules, /\.site-nav-links\s*\{[^}]*display:\s*none/s);
  assert.match(tabletRules, /\.mobile-nav\s*\{[^}]*display:\s*block/s);
  assert.match(styles, /\.site-brand\s*\{[^}]*min-height:\s*44px[^}]*white-space:\s*nowrap/s);
});

test('high-frequency mobile links provide at least a 44px touch area', () => {
  assert.match(styles, /\.popular-links a\s*\{[^}]*min-height:\s*44px/s);
  assert.match(styles, /\.site-footer__links a\s*\{[^}]*min-height:\s*44px/s);
  assert.match(styles, /\.beginner-video-meta a\s*\{[^}]*min-height:\s*44px/s);
});
