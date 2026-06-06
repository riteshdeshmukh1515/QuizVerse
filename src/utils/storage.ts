import { useEffect, useState } from "react";

type Listener = () => void;

const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function useStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch {
      /* ignore */
    }
    return initial;
  });

  useEffect(() => {
    const l = () => {
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) setValue(JSON.parse(raw) as T);
        else setValue(initial);
      } catch {
        /* ignore */
      }
    };
    listeners.add(l);
    window.addEventListener("storage", l);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", l);
    };
  }, [key, initial]);

  const set = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      localStorage.setItem(key, JSON.stringify(resolved));
      notify();
      return resolved;
    });
  };

  return [value, set] as const;
}

export function clearKey(key: string) {
  localStorage.removeItem(key);
  notify();
}
