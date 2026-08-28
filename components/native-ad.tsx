'use client';

import { useEffect, useRef, useState } from 'react';
import {
  mountAdsterraNativeAd,
  NATIVE_AD_CONTAINER_ID,
} from '../lib/adsterra-native.mjs';
import styles from './native-ad.module.css';

export function NativeAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      setIsFilled(container.childElementCount > 0);
    });
    observer.observe(container, { childList: true });

    const unmountAd = mountAdsterraNativeAd(document, container);

    return () => {
      observer.disconnect();
      unmountAd();
    };
  }, []);

  return (
    <section
      className={styles.placement}
      aria-label="Advertisement"
      data-ad-filled={isFilled ? 'true' : 'false'}
    >
      <div className={styles.frame}>
        <p className={styles.label}>Advertisement</p>
        <div className={styles.viewport}>
          <div
            className={styles.container}
            id={NATIVE_AD_CONTAINER_ID}
            ref={containerRef}
          />
        </div>
      </div>
    </section>
  );
}
