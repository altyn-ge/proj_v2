"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import deathSentences from '../../../public/death_sentence_exerpts.txt?raw';
import { AutomatedScrollView } from "./AutomatedScrollView";
import { useScrollPosition } from "../../hooks/useScrollPosition";

export interface DeathSentenceListProps {
  className?: string;
}

export function DeathSentenceList({
  className
}: DeathSentenceListProps) {
  const [excerpts, setExcerpts] = useState<string[]>([]);
  const { savedPosition, isLoaded, savePosition } = useScrollPosition({
    key: 'deathSentencesScrollPosition',
    debounceMs: 50,
    defaultValue: 0
  });
  const lastSaveTime = useRef<number>(0);

  useEffect(() => {
    const lines = deathSentences.split('\n').filter(line => line.trim() !== '');
    setExcerpts(lines);
  }, []);

  const onScroll = useCallback((position: number) => {
    if (position > 0) {
      const now = Date.now();
      // Only save position every 100ms to avoid overwhelming the debounce
      if (now - lastSaveTime.current > 100) {
        savePosition(position);
        lastSaveTime.current = now;
      }
    }
  }, [savePosition]);

  return (
    <div style={{
        height: 300,
        margin: '0 10px 10px',
        position: 'relative'
      }}
      className={className}>
      <span style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 8,
        pointerEvents: 'none',
        zIndex: 1,
        // draw the border as an inset stroke so it sits *inside* the rounded corner
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22)',
        // helps avoid any faintness on some GPUs
        transform: 'translateZ(0)',
      }}>
          <div style={{
            position: 'relative',
            zIndex: 0,
            height: 300,
            overflow: 'hidden',
            padding: 15,
            borderRadius: 8,
            backgroundColor: 'rgba(0,0,0,0.05)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            // optional: makes paint more predictable with transforms/scrolling children
            contain: 'paint',
            backgroundClip: 'padding-box',
            WebkitBackgroundClip: 'padding-box',

          }}>
            <AutomatedScrollView 
              startPosition={isLoaded ? savedPosition : 0} 
              windowHeight={300} 
              onScroll={onScroll}
            >
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {/* First set of items */}
              {excerpts.map((excerpt, index) => (
                <li
                  key={`first-${index}`}
                  style={{
                    marginBottom: '10px',
                    paddingBottom: '5px',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {excerpt}
                </li>
              ))}
              {/* Duplicate set of items for seamless loop */}
              {excerpts.map((excerpt, index) => (
                <li
                  key={`second-${index}`}
                  style={{
                    marginBottom: '10px',
                    paddingBottom: '5px',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {excerpt}
                </li>
              ))}
            </ul>
            </AutomatedScrollView>
          </div>
        </span>
    </div>
  );
};