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
const gridHeight = rowHeight * rowCount + gap * (rowCount - 1);

export function ImageGrid(props: ImageGridProps) {
  const { images, className } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

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

  const innerContainerRef = useRef(null);

  useEffect(() => {
    let currentPosition = 0;
    let animationFrameId: number;
    const scrollStep = 0.3;
  
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
      className={clsx(className)}
      style={{ margin: `${gap}px`, height: gridHeight, overflowY: "hidden", willChange: "transform" }}
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
              className="relative h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                gridColumn: `span ${span}`,
                maxHeight: rowHeight,
              }}
            >
              <Image
                className="h-full object-cover select-none pointer-events-none"
                src={`/img/${image.filename}`}
                alt={image.displayName}
                width={image.width}
                height={image.height}
                placeholder="blur"
                blurDataURL={image.blurDataURL}
                quality={70}
                priority
              />
              <p className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 px-[1px] text-center text-[10px] bg-stone-900/70 text-white min-w-[100%]`}>
                {image.displayName}
              </p>
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
