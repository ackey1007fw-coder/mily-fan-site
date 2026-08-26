import type { NewsImageMedia } from "../data/news";

export function NewsImage({
  media,
  className,
}: {
  media: NewsImageMedia;
  className: string;
}) {
  const image = (
    <img
      src={media.src}
      srcSet={media.srcSet}
      sizes={media.sizes}
      width={media.width}
      height={media.height}
      loading="lazy"
      decoding="async"
      alt={media.alt}
      className={className}
    />
  );

  if (!media.webpSrcSet) return image;

  return (
    <picture>
      <source type="image/webp" srcSet={media.webpSrcSet} sizes={media.sizes} />
      {image}
    </picture>
  );
}
