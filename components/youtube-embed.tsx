'use client';

import { useState } from 'react';

type YouTubeEmbedProps = {
  id: string;
  title: string;
  startAt?: number;
};

export function YouTubeEmbed({ id, title, startAt }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${id}${startAt ? `?start=${startAt}` : ''}`;

  if (isLoaded) {
    return (
      <div className="video-frame">
        <iframe
          title={title}
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="video-frame video-frame--placeholder">
      <button className="video-load-button" type="button" onClick={() => setIsLoaded(true)}>
        <span className="video-load-button__icon" aria-hidden="true">▶</span>
        <span>
          <strong>Load video</strong>
          <small>YouTube connects only after you choose to play.</small>
        </span>
      </button>
    </div>
  );
}
