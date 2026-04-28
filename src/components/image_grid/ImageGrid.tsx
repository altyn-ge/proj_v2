"use client"

import React, { useMemo, useRef } from "react";
import { layoutImages, LayoutGridCell, ImageFile } from "./gridLayout";
import { ImageCell } from "./ImageCell";
import { useTransformScroller } from "./hooks/useTransformScroller";

export interface ImageGridProps {
  images: ImageFile[];
  columns?: number;
  gap?: number;
  height?: number | string;   // omit => fills parent height
  speedPps?: number;
  rowHeight?: number;
  className?: string;
  style?: React.CSSProperties;
  persistKey?: string;        // enable persistence by providing a key
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  columns = 5,
  gap = 12,
  height,
  speedPps = 40,
  rowHeight = 180,
  className,
  style,
  persistKey = "imageGridScrollHeight",
}) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const { layout } = useMemo(() => layoutImages(images, columns), [images, columns]);

  // A simple signature that changes when key layout/content changes.
  // For production, consider hashing filenames instead of joining for long lists.
  const layoutSignature = useMemo(
    () => `${columns}-${rowHeight}-${gap}-${images.length}-${images.map(i => i.filename).join("|")}`,
    [columns, rowHeight, gap, images]
  );

  const { trackRef, isPaused } = useTransformScroller({
    viewportRef,
    speedPps,
    persistKey,
    layoutSignature,
  });

  const resolvedHeight = height ?? "100%";

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap,
    alignItems: "start",
  };

  return (
    <div
      ref={viewportRef}
      className={className}
      style={{ position: "relative", height: resolvedHeight, overflow: "hidden", minHeight: 0, ...style }}
    >
      <div ref={trackRef} style={{ position: "absolute", inset: 0, willChange: "transform" }}>
        {[0, 1].map((copy) => (
          <div key={copy} style={gridStyle}>
            {layout.map((cell: LayoutGridCell, idx: number) => (
              <ImageCell
                key={`${copy}-${idx}`}
                cell={cell}
                ioRoot={viewportRef.current}
                rowHeight={rowHeight}
              />
            ))}
          </div>
        ))}
      </div>
      {isPaused && (
        <div style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "rgba(0,0,0,0.55)",
          color: "rgba(255,255,255,0.85)",
          fontSize: 11,
          padding: "3px 10px",
          borderRadius: 4,
          pointerEvents: "none",
          zIndex: 2,
        }}>
          paused — Shift+S to resume
        </div>
      )}
    </div>
  );
};