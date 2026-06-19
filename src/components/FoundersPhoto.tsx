"use client";

import { useState } from "react";

export function FoundersPhoto({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setVisible(false)}
    />
  );
}
