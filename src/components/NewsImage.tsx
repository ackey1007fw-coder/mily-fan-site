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

  const rendered = !media.webpSrcSet ? image : (
    <picture>
      <source type="image/webp" srcSet={media.webpSrcSet} sizes={media.sizes} />
      {image}
    </picture>
  );
  return media.fullSizeSrc ? (
    <a href={media.fullSizeSrc} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in" aria-label={`${media.alt}（原寸で開く）`}>
      {rendered}
    </a>
  ) : rendered;
}
