"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ImageFile } from "@/lib/getImages";
import Image from "next/image";

const rowHeight = 160;
const gap = 0;
// const gridHeight = rowHeight * rowCount + gap * (rowCount - 1);
// const rowsPerScreen = 100;
const columnsPerScreen = 5;


interface ImageGridProps {
  images: ImageFile[];
  className?: string;
}

export function ImageGridOptimized(props: ImageGridProps) {

  const {images} = props;

  const [bottomRow, setBottomRow] = useState(5);

  const imageRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();
  const position = useRef(0);
  const moveSinceLastUpdate = useRef(0);
  const { layout, rowEndings } = layoutImages(images, columnsPerScreen);

  useEffect(()=>{
    let lastTimestamp = 0;

    
    const lastPosition = Number.parseFloat(localStorage.getItem('lastPosition') ?? '0');
    const lastBottomRow = Number.parseInt(localStorage.getItem('lastBottomRow') ?? '5');
    const lastMoveSinceLastUpdate = Number.parseFloat(localStorage.getItem('lastMoveSinceLastUpdate') ?? '0');

    position.current = lastPosition;
    moveSinceLastUpdate.current = lastMoveSinceLastUpdate;
    setBottomRow(lastBottomRow);

    const handleScroll = ()=>{
      if(imageRef.current != null && (moveSinceLastUpdate.current >= rowHeight + 80 )){
        setBottomRow(prev => {
          if(position.current >= rowEndings.length*(rowHeight)){
            imgs = getImagesToRender(5);
            position.current = 0;
            moveSinceLastUpdate.current = 0;

            localStorage.setItem('lastPosition',position.current.toString());
            localStorage.setItem('lastMoveSinceLastUpdate',moveSinceLastUpdate.current.toString());
            localStorage.setItem('lastBottomRow',(5).toString());

            return 5;
          }else {
            imgs = getImagesToRender(prev +1);
            moveSinceLastUpdate.current = 0;

            localStorage.setItem('lastPosition',position.current.toString());
            localStorage.setItem('lastMoveSinceLastUpdate',moveSinceLastUpdate.current.toString());
            localStorage.setItem('lastBottomRow',(prev+1).toString());

            return prev + 1;
          }
        });
      }
      
    }


    const scrollFunc = (timestamp: number) => {
      try{
        if(!lastTimestamp) lastTimestamp = timestamp;
        const delta = timestamp - lastTimestamp;

        const pixelsPerSecond = window.innerHeight/30;
        position.current += pixelsPerSecond*delta / 1000;
        moveSinceLastUpdate.current += pixelsPerSecond*delta / 1000;
        if(imageRef.current){
          // imageRef.current.style.transform = `translateY(${-position.current}px)`;
          imageRef.current.scrollTop = position.current;
          handleScroll();
        }
        lastTimestamp = timestamp;
        animationFrameId.current = requestAnimationFrame(scrollFunc);

      } catch (e){
        console.log(e);
      }
    }

    if(imageRef.current){
      requestAnimationFrame(scrollFunc);
    //   imageRef.current?.addEventList ener('scroll', handleScroll);
    }


    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // imageRef.current?.removeEventListener('scroll', handleScroll);
    };
  });

  const getImagesToRender = (bottomRow: number) => {
    return layout.slice(0,rowEndings[bottomRow]);
  }

  let imgs = getImagesToRender(bottomRow);

  useEffect(() => {
    console.log(bottomRow);
  }, [bottomRow]);

  return (
      <div
        className="grid h-full"
        ref={imageRef}
        style={{
          gridTemplateColumns: `repeat(${columnsPerScreen}, 1fr)`,
          gridTemplateRows: "repeat(3, 1fr)",
          gridAutoFlow: "dense",
          gap: `${gap}px`,
          willChange: "transform",
          overflowY: 'hidden',
          scrollbarWidth: 'none',
        }}
      >
        <AnimatePresence>
          {imgs.map(({image, span}) => {
          return (
            <div
              key={`${image.filename}`}
              className="relative h-full w-full px-1 mb-20"
              style={{
                willChange: "transform",
                gridColumn: `span ${span}`,
                height: rowHeight,
              }}
            >
              <div className="relative h-full w-full bg-gradient-to-br from-stone-800 to-stone-900 shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-4 border-stone-700">
                <div className="relative h-[calc(100%)] w-full">
                  <Image
                    className="h-full w-full object-cover select-none pointer-events-none relative z-0"
                    src={`img/${image.filename}`.replaceAll('й','%D0%B9').replaceAll('ё','%D1%91')}
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
                    {/* {image.index} */}
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
  const gridCells: LayoutGridCell[] = [];
  const copiedImages = Array.from(images);

  // console.log(copiedImages.slice(0,10).map(i => i.index));

  const rowEndings: number[] = [];

  if (!columnCount) {
    return {
      layout: gridCells,
      rowEndings: rowEndings
    };
  }

  let currentCol = 0;
  while(copiedImages.length != 0){
    const remainingCols = columnCount - currentCol;

    // Image selection logic
    let found = false;
    for(let j = 0; j < copiedImages.length && !found; j++){
      const image = copiedImages[j];
      const colSpan = image.isWide ? 2 : 1;
      if(colSpan <= remainingCols){
          gridCells.push({
            image,
            span: colSpan
          });
          copiedImages.splice(j,1);
          currentCol += colSpan;
          found = true;
      }
    }

    // Row tracking logic
    if(!found) {
      // If we get through the entirety of the list and don't find an image that fits, move on to the next row
      currentCol = 0;
      rowEndings.push(gridCells.length);
    } else if (currentCol == columnCount) {
      // If we get fill up a row completely, move on to the next one
      currentCol = 0;
      rowEndings.push(gridCells.length);
    } else if (currentCol > columnCount){
      throw Error("Error in logic. This should never occur");
    }

  }

  rowEndings.unshift(0);

  // console.log(gridCells.slice(0,10).map(i => i.image.index));

  return {layout: gridCells, rowEndings: rowEndings};
}

interface LayoutGridCell {
  image: ImageFile;
  span: number;
}
