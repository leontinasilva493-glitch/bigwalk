/**
 * @typedef {{ title: string, publisher: string, url: string, purpose?: string }} AnswerSource
 */

/**
 * @param {{ slug: string, sourceCheckedAt: string, answerSourceUrls?: string[], sources?: AnswerSource[] }} guide
 * @returns {{ checkedAt: string, sources: AnswerSource[] } | undefined}
 */
export function answerEvidenceFor(guide) {
  if (!guide?.answerSourceUrls?.length) return undefined;

  const sourcesByUrl = new Map((guide.sources ?? []).map((source) => [source.url, source]));
  const sources = guide.answerSourceUrls.map((url) => {
    const source = sourcesByUrl.get(url);
    if (!source) throw new Error(`${guide.slug} answer evidence references an unknown source: ${url}`);
    return source;
  });

  return {
    checkedAt: guide.sourceCheckedAt,
    sources,
  };
}
