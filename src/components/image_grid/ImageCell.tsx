import React, { useMemo, useState, useRef, useEffect } from "react";
import { LayoutGridCell } from "./gridLayout";
import { encodePath } from "./encodePath";
import Image from "next/image";

export const ImageCell: React.FC<{
  cell: LayoutGridCell;
  ioRoot: Element | null;
  rowHeight?: number; // fixed tile height in px (same for all images)
}> = ({ cell, ioRoot, rowHeight = 220 }) => {
  const { image, span } = cell;
  const safeSrc = useMemo(() => {
    const normalized = image.filename.normalize('NFC');
    return encodePath(`img/${normalized}`);
  }, [image.filename]);
  const [visible, setVisible] = useState(false);
//   const [loaded, setLoaded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Scoped lazy: mount <Image> only when this tile is visible inside your viewport
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        }
      },
      { root: ioRoot ?? undefined, rootMargin: "200px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ioRoot]);

  return (
    <div style={{ gridColumn: `span ${span}` }} className="self-start">
      {/* Bordered card with a fixed-height media box */}
      <div className="relative w-full bg-gradient-to-br from-stone-800 to-stone-900 shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-4 border-stone-700">
        <div
          ref={wrapperRef}
          style={{ height: rowHeight, position: "relative" }}
          className="w-full overflow-hidden"
        >
          {visible && (
            <Image
              src={safeSrc}
              alt={image.displayName}
              fill={true}
              // cover crops the image to the fixed-height box
              style={{ objectFit: "cover" }}
              placeholder={image.blurDataURL ? "blur" : "empty"}
              blurDataURL={image.blurDataURL}
              quality={70}
              // keep it lazy (no 'priority')
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            //   onLoad={() => setLoaded(true)}
            />
          )}
        </div>
      </div>

      {/* Caption outside the border */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <p className="text-[10px] text-white text-center px-2 pb-4 wrap">
          {image.displayName}
        </p>
      </div>
    </div>
  );
};