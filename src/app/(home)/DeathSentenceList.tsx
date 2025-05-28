"use client";

import React, { useEffect, useRef, useState } from "react";
import deathSentences from '../../../public/death_sentence_exerpts.txt?raw';

export function DeathSentenceList() {
  const [excerpts, setExcerpts] = useState<string[]>([]);
  const innerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lines = deathSentences.split('\n').filter(line => line.trim() !== '');
    setExcerpts(lines);
  }, []);

  useEffect(() => {
    let currentPosition = 0;
    let animationFrameId: number;
    const scrollStep = 0.1;
  
    const animateScroll = () => {
      if (innerContainerRef.current) {
        // const containerHeight = innerContainerRef.current.parentElement?.offsetHeight || 0;
        const contentHeight = innerContainerRef.current.scrollHeight / 2;
        
        // Reset position when we've scrolled through one set of content
        if (currentPosition >= contentHeight) {
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
  }, []);

  return (
    <div style={{ 
      height: '300px', 
      overflow: 'hidden', 
      padding: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      backdropFilter: 'blur(10px)'
    }}>
      <div 
        ref={innerContainerRef}
        style={{ 
          willChange: 'transform',
          position: 'relative'
        }}
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
      </div>
    </div>
  );
};