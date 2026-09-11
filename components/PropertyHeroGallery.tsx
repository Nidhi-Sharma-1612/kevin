import Image from "next/image";

// Airbnb-style hero grid: one large photo on the left, two stacked on the
// right. Only renders once we have 3+ genuinely distinct photos (from a
// future Lodgify gallery) — with just the single cover photo most mock
// listings have today, repeating it into 3 panels reads as a broken
// gallery rather than a real one, so we fall back to one clean hero.
export default function PropertyHeroGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  if (images.length < 3) {
    return (
      <div className="relative h-72 w-full overflow-hidden rounded-2xl shadow-soft sm:h-[28rem] lg:rounded-3xl">
        <Image
          src={images[0]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  const [primary, second, third] = images;

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-3 overflow-hidden rounded-2xl lg:h-[32rem] lg:rounded-3xl">
      <div className="relative col-span-2 row-span-2 h-72 sm:h-96 lg:col-span-1 lg:h-full">
        <Image
          src={primary}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 700px"
          className="object-cover"
          priority
        />
      </div>

      <div className="relative h-36 sm:h-44 lg:h-full">
        <Image
          src={second}
          alt={`${alt} — additional view`}
          fill
          sizes="(max-width: 1024px) 50vw, 350px"
          className="object-cover"
        />
      </div>

      <div className="relative h-36 sm:h-44 lg:h-full">
        <Image
          src={third}
          alt={`${alt} — additional view`}
          fill
          sizes="(max-width: 1024px) 50vw, 350px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
