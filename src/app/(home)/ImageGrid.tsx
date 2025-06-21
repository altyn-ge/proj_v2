"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { ImageFile } from "@/lib/getImages";
import Image from "next/image";

interface ImageGridProps {
  images: ImageFile[];
  className?: string;
}

const rowHeight = 160;
const rowCount = 3;
const gap = 0;
// const gridHeight = rowHeight * rowCount + gap * (rowCount - 1);

export function ImageGrid(props: ImageGridProps) {
  const { images, className } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(0);
  const [scrollPosition] = useState(0);

  const randomImages = useMemo(() => {
    const imgsCopy = [...images];
    imgsCopy.sort((a,b) => a.displayName.localeCompare(b.displayName));
    return imgsCopy;
  }, [images]);

  useEffect(() => {
    const calculateDimensions = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const baseImageWidth = rowHeight * 0.75; // Using 3:4 as base ratio
      const cols = Math.max(1, Math.floor(containerWidth / baseImageWidth));
      setColumnCount(cols);
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, []);

  // useEffect(() => {
  //   const animateScroll = () => {
  //     setScrollPosition((prev) => prev + 1); // Adjust the increment as needed
  //     requestAnimationFrame(animateScroll);
  //   };
  
  //   const animationFrame = requestAnimationFrame(animateScroll);
  //   return () => cancelAnimationFrame(animationFrame);
  //   }, []);

  const innerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentPosition =  parseInt(localStorage.getItem("image_scroll_position") ?? "0");
    let animationFrameId: number;
    const scrollStep = 0.2;
  
    const animateScroll = () => {
      if (innerContainerRef.current) {
        const totalHeight = innerContainerRef.current.scrollHeight;
        // Reset once we've scrolled through all the content
        if (currentPosition >= totalHeight) {
          currentPosition = 0;
        } else {
          currentPosition += scrollStep;
        }
        innerContainerRef.current.style.transform = `translateY(-${currentPosition}px)`;
        localStorage.setItem("image_scroll_position", currentPosition.toString())
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };
  
    animationFrameId = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);  const layout = useMemo(() => {
    return layoutImages(randomImages, columnCount);
  }, [randomImages, columnCount]);
  return (
    <div
      ref={containerRef}
      className={clsx(className, "h-full")}
      style={{ margin: `${gap}px`, height: `100%`, overflowY: "hidden", willChange: "transform" }}
    >
      <div
        className="grid h-full relative"
        ref={innerContainerRef}
        style={{
          transform: `translateY(-${scrollPosition}px)`,
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gridTemplateRows: "repeat(3, 1fr)",
          gridAutoFlow: "dense",
          gap: `${gap}px`,
          willChange: "transform" 
        }}
      >
        <AnimatePresence>
          {layout.map(({ image, span }) => (
            <motion.div
              key={`${image.filename}`}
              className="relative h-full w-full px-1 mb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                gridColumn: `span ${span}`,
                maxHeight: rowHeight,
              }}
            >
              <div className="relative h-full w-full bg-gradient-to-br from-stone-800 to-stone-900 shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-4 border-stone-700">
                <div className="relative h-[calc(100%)] w-full">
                  <Image
                    className="h-full w-full object-cover select-none pointer-events-none relative z-0"
                    src={`img/${image.filename}`}
                    alt={image.displayName}
                    width={image.width}
                    height={image.height}
                    placeholder="blur"
                    blurDataURL={image.blurDataURL}
                    quality={70}
                    priority
                  />
                </div>
                <div className="absolute bottom-[-50px] left-0 right-0 h-6 flex items-center justify-center z-20">
                  <p className="text-[10px] text-white text-center px-2 wrap">
                    {image.displayName}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function layoutImages(images: ImageFile[], columnCount: number) {
  let currentRow = 0;
  let currentCol = 0;
  const gridCells: LayoutGridCell[] = [];

  if (!columnCount) {
    return gridCells;
  }

  while (currentRow < rowCount) {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const remainingCols = columnCount - currentCol;
      const colSpan = image.isWide ? 2 : 1;

      if (colSpan <= remainingCols) {
        gridCells.push({
          image,
          row: currentRow,
          col: currentCol,
          span: colSpan,
        });

        currentCol += colSpan;
        if (currentCol >= columnCount) {
          currentRow++;
          currentCol = 0;
        }

        // if (currentRow >= rowCount) break;
      }
    }

    // If we can't fit any more images in this row, move to next row
    if (currentCol < columnCount && currentRow < rowCount) {
      currentRow++;
      currentCol = 0;
    }
  }

  return gridCells;
}

interface LayoutGridCell {
  image: ImageFile;
  row: number;
  col: number;
  span: number;
}
