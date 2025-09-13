"use client"

import { ReactNode, useEffect, useRef } from "react";

type AutomatedScrollViewProps = {
    children: ReactNode;
    startPosition: number;
    windowHeight?: number;
    speed_secondsPerWindow?: number;
    onScroll?: (position: number) => void; 
    hasReachedEnd?: (position: number) => boolean;
}

export function AutomatedScrollView({ children, startPosition, windowHeight, speed_secondsPerWindow: windowsPerSecond, onScroll, hasReachedEnd }: AutomatedScrollViewProps){

    const currentPosition = useRef(startPosition);
    const animationFrameId = useRef<number>();
    const contentRef = useRef<HTMLDivElement>(null);

    // Update currentPosition when startPosition changes
    useEffect(() => {
        currentPosition.current = startPosition;
        if (contentRef.current) {
            contentRef.current.scrollTop = startPosition;
        }
    }, [startPosition]);

useEffect(()=>{
        let lastTimestamp = 0;

        windowsPerSecond ??= 30;
        const pixelsPerSecond = windowHeight ? windowHeight/windowsPerSecond : window.innerHeight/windowsPerSecond;
        windowHeight ??= window.innerHeight;
        hasReachedEnd ??= (p: number) => {
            return p > (contentRef.current!.scrollHeight - (windowHeight ?? window.innerHeight));
        }
        const onScrollActual = (p: number) => {
            if(hasReachedEnd && hasReachedEnd(p)) {
                currentPosition.current = 0;
            }
            if(onScroll) {
                onScroll(p);
            }
        }
        
        const scrollFunc = (timestamp: number) => {
        
          try{
            if(!lastTimestamp) lastTimestamp = timestamp;
            const delta = timestamp - lastTimestamp;
            currentPosition.current += pixelsPerSecond*delta / 1000;
            if(contentRef.current) contentRef.current.scrollTop = currentPosition.current;

            lastTimestamp = timestamp;
            animationFrameId.current = requestAnimationFrame(scrollFunc);
            onScrollActual(currentPosition.current);
          } catch (e){
            console.error(e);
          }
        }
    
        if(contentRef.current){
          requestAnimationFrame(scrollFunc);
        } else {
        }

        return () => {
          if (animationFrameId.current) {   
            cancelAnimationFrame(animationFrameId.current);
          }
        };
      }, [startPosition, windowHeight, windowsPerSecond, onScroll, hasReachedEnd]);

    return (
        <div ref={contentRef}
        style={{
            overflowY: "hidden",
            height: windowHeight ? `${windowHeight}px` : "100%",
        }}
        >
            {children}
        </div>
    )
}