import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const publicSourceRoots = ['app', 'components', 'lib'];
const publicSourceExtensions = new Set(['.js', '.mjs', '.ts', '.tsx']);
const discouragedLanguage = [
  { label: 'source-checked', pattern: /\bsource[- ]checked\b/i },
  { label: 'evidence status', pattern: /\bevidence status\b/i },
  { label: 'first-hand editorial status', pattern: /\bfirst[- ]hand\b/i },
  { label: 'evidence in progress', pattern: /\bevidence[- ]in[- ]progress\b/i },
  { label: 'verification in progress', pattern: /\bverification in progress\b/i },
  { label: 'unverified', pattern: /\bunverified\b/i },
  { label: 'community-reported', pattern: /\bcommunity[- ]reported\b/i },
  { label: 'to verify', pattern: /\bto verify\b/i },
  { label: 'to be verified', pattern: /\bto be verified\b/i },
  { label: 'pending verification', pattern: /\bpending[^.\n]*verification\b/i },
  { label: 'being prepared', pattern: /\bbeing prepared\b/i },
  { label: 'site still needs testing', pattern: /\b(?:this site )?still needs[^.\n]*\btest(?:ing)?\b/i },
];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return publicSourceExtensions.has(extname(entry.name)) ? [path] : [];
  }));
  return nested.flat();
}

test('public page sources avoid editorial verification-backlog language', async () => {
  const files = (await Promise.all(publicSourceRoots.map(sourceFiles))).flat();
  const findings = [];

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const lines = source.split(/\r?\n/);

    for (const { label, pattern } of discouragedLanguage) {
      lines.forEach((line, index) => {
        if (pattern.test(line)) findings.push(`${relative('.', file)}:${index + 1} (${label})`);
      });
    }

    if ((file.endsWith('.tsx') || file.endsWith('.ts')) && /verification-status/i.test(source)) {
      findings.push(`${relative('.', file)} (verification-status class)`);
    }
  }

  assert.deepEqual(findings, [], `Found public-facing editorial status language:\n${findings.join('\n')}`);
});
