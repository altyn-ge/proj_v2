"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollPositionOptions {
  key: string;
  debounceMs?: number;
  defaultValue?: number;
}

export function useScrollPosition({ 
  key, 
  debounceMs = 100, 
  defaultValue = 0 
}: UseScrollPositionOptions) {
  const [savedPosition, setSavedPosition] = useState<number>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Load position from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        const parsed = Number.parseFloat(stored);
        if (!Number.isNaN(parsed)) {
          setSavedPosition(parsed);
        }
      }
    } catch (error) {
      console.warn('Failed to load scroll position from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  // Save position to localStorage with debouncing
  const savePosition = useCallback((position: number) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, position.toString());
      } catch (error) {
        console.warn('Failed to save scroll position to localStorage:', error);
      }
    }, debounceMs);
  }, [key, debounceMs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    savedPosition,
    isLoaded,
    savePosition
  };
}
