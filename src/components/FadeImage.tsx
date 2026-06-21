"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { clsx } from "clsx";
import { blurFor } from "@/lib/blur";

// next/image's blur placeholder swaps to the full image with no transition.
// This keeps the blur preview underneath and cross-fades the real image in.
// Fill-mode only — the parent must be `position: relative` with a size.
export function FadeImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  // If the image is already cached/complete at mount (e.g. SSR above-the-fold),
  // `onLoad` won't fire — detect it via the ref so it doesn't stay hidden.
  const checkComplete = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete) setLoaded(true);
  }, []);

  return (
    <>
      <span
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out",
          loaded ? "opacity-0" : "opacity-100",
        )}
        style={{
          backgroundImage: `url("${blurFor(src)}")`,
          filter: "blur(8px)",
          transform: "scale(1.05)",
        }}
      />
      <Image
        ref={checkComplete}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={clsx(
          "object-cover transition duration-700 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </>
  );
}
