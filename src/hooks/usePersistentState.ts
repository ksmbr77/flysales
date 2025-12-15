import { useState, useEffect, useCallback } from "react";

// Custom event for cross-component sync
const STORAGE_EVENT = 'fly-storage-update';

export function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    return initialValue;
  });

  // Save to localStorage and dispatch custom event
  const setStateAndPersist = useCallback((value: React.SetStateAction<T>) => {
    setState((prev) => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key, value: newValue } }));
      } catch (error) {
        console.error(`Error saving to localStorage key "${key}":`, error);
      }
      return newValue;
    });
  }, [key]);

  // Listen for changes from other components
  useEffect(() => {
    const handleStorageUpdate = (e: CustomEvent<{ key: string; value: T }>) => {
      if (e.detail.key === key) {
        setState(e.detail.value);
      }
    };

    window.addEventListener(STORAGE_EVENT, handleStorageUpdate as EventListener);
    return () => window.removeEventListener(STORAGE_EVENT, handleStorageUpdate as EventListener);
  }, [key]);

  return [state, setStateAndPersist];
}
