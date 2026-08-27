export const GOOGLE_ANALYTICS_MEASUREMENT_ID = 'G-1EFZKE8S00';

export const GOOGLE_ANALYTICS_SCRIPT_SRC =
  `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_MEASUREMENT_ID}`;

export function createGoogleAnalyticsBootstrap() {
  return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ANALYTICS_MEASUREMENT_ID}');`;
}
