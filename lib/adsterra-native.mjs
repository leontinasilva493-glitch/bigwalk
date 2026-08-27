export const NATIVE_AD_CONTAINER_ID = 'container-ad7a012e1693b7d27de84829a3838a5c';

export const NATIVE_AD_SCRIPT_SRC =
  'https://pl31052446.profitableratecpmnetwork.com/ad7a012e1693b7d27de84829a3838a5c/invoke.js';

export function mountAdsterraNativeAd(document, container) {
  container.replaceChildren();

  const script = document.createElement('script');
  script.async = true;
  script.setAttribute('data-cfasync', 'false');
  script.src = NATIVE_AD_SCRIPT_SRC;

  container.parentNode?.insertBefore(script, container);

  return () => {
    script.remove();
    container.replaceChildren();
  };
}
