"use client";
import { CldImage } from "next-cloudinary";

export default function CustomImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <CldImage
      src={src}
      alt={alt}
      width="500"
      height="500"
      crop={{
        type: "auto",
        source: true,
      }}
      className={className}
    />
  );
}
