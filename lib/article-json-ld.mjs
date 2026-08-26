/**
 * @param {{
 *   site: { name: string, url: string },
 *   headline: string,
 *   description: string,
 *   datePublished?: string,
 *   dateModified: string,
 *   url: string,
 *   image?: string,
 * }} input
 */
export function buildArticleJsonLd({
  site,
  headline,
  description,
  datePublished,
  dateModified,
  url,
  image,
}) {
  const organization = {
    '@type': 'Organization',
    name: site.name,
    url: site.url,
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    datePublished,
    dateModified,
    mainEntityOfPage: url,
    author: organization,
    publisher: organization,
    ...(image ? { image } : {}),
  };
}
