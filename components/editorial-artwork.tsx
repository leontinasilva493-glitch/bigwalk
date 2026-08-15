import Image from 'next/image';

type EditorialArtworkVariant = 'methodology' | 'lfg' | 'troubleshooting' | 'achievements';

type EditorialArtworkProps = {
  src: string;
  alt: string;
  variant: EditorialArtworkVariant;
  sizes?: string;
  placement?: 'inline' | 'hero';
  preload?: boolean;
};

export function EditorialArtwork({
  src,
  alt,
  variant,
  sizes = '(max-width: 767px) calc(100vw - 40px), 720px',
  placement = 'inline',
  preload = false,
}: EditorialArtworkProps) {
  return (
    <figure className={`editorial-artwork editorial-artwork--${variant} editorial-artwork--${placement}`}>
      <div className="editorial-artwork__media">
        <Image
          src={src}
          alt={alt}
          width={1536}
          height={1024}
          sizes={sizes}
          preload={preload}
        />
      </div>
    </figure>
  );
}
