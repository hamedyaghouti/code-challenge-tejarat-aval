import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    const parsedValue: T =
      storedValue !== null ? JSON.parse(storedValue) : initialValue;
    return parsedValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return { value, setValue };
}
