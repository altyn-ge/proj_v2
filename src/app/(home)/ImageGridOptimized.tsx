"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ImageFile } from "@/lib/getImages";
import Image from "next/image";

const rowHeight = 160;
const rowCount = 3;
const gap = 0;
// const gridHeight = rowHeight * rowCount + gap * (rowCount - 1);

interface ImageGridProps {
  images: ImageFile[];
  className?: string;
}

export function ImageGridOptimized(props: ImageGridProps) {

  const {images} = props;

  const [topRowEndIndex, setTopRowEndIndex] = useState(0);
  const [bottomRowEndIndex, setBottomRowEndIndex] = useState(5);

  const imageRef = useRef<HTMLDivElement>(null);

  const handleScroll = ()=>{
    if(imageRef.current != null && (imageRef.current.scrollTop + imageRef.current.clientHeight >= imageRef.current.scrollHeight *0.8)){
      setTopRowEndIndex(prev => prev + 1);
      setBottomRowEndIndex(prev => prev + 1);
    } 
  }

  const scrollFunc = () => {
    imageRef.current?.scrollBy({top:1, behavior:'smooth'});
    setTimeout(scrollFunc,100);
  }

  useEffect(()=>{
    if(imageRef.current){
      scrollFunc();
      imageRef.current?.addEventListener('scroll', handleScroll);
    }
  });

  const { layout, rowEndings } = layoutImages(images, 5);

  useEffect(() => {
    console.log(topRowEndIndex, bottomRowEndIndex);
  }, [topRowEndIndex, bottomRowEndIndex]);

  return (
      <div
        className="grid h-full relative"
        ref={imageRef}
        style={{
          gridTemplateColumns: `repeat(${5}, 1fr)`,
          gridTemplateRows: "repeat(3, 1fr)",
          gridAutoFlow: "dense",
          gap: `${gap}px`,
          willChange: "transform" ,
          overflowY: 'hidden',
          scrollbarWidth: 'none'
        }}
      >
        <AnimatePresence>
          {layout.slice(0,rowEndings[bottomRowEndIndex]+3).map(({image, span}) => {
          return (
            <div
              key={`${image.filename}`}
              className="relative h-full w-full px-1 mb-20"
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
            </div>
          )})}
        </AnimatePresence>
      </div>
  );
}

function layoutImages(images: ImageFile[], columnCount: number): {layout: LayoutGridCell[], rowEndings: number[]} {
  let currentRow = 0;
  let currentCol = 0;
  const gridCells: LayoutGridCell[] = [];

  const rowEndings: number[] = [];

  if (!columnCount) {
    return {
      layout: gridCells,
      rowEndings: rowEndings
    };
  }

  while (currentRow < rowCount) {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const remainingCols = columnCount - currentCol;
      const colSpan = image.isWide ? 2 : 1;

      if (colSpan <= remainingCols) {
        gridCells.push({
          image,
          span: colSpan,
        });

        currentCol += colSpan;
        if (currentCol >= columnCount) {
          currentRow++;
          currentCol = 0;
          rowEndings.push(i+1);
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

  return {layout: gridCells, rowEndings: rowEndings};
}

interface LayoutGridCell {
  image: ImageFile;
  span: number;
}
