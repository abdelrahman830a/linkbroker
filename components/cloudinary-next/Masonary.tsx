import React from "react";
import "./index.css";
import CustomImage from "./CustomImage";

export function MasonryGallery({ children }: { children: React.ReactNode }) {
  return <div className="masonry-gallery my-4">{children}</div>;
}

export function MasonryItem({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="masonry-item">
      <CustomImage src={src} alt={alt} className="rounded-lg" />
    </div>
  );
}
