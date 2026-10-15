import { useEffect, useState } from "react";

let dark = false;
const listeners = new Set<(value: boolean) => void>();

function applyTheme() {
  const root = document.documentElement;
  if (dark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function useTheme() {
  const [isDark, setIsDark] = useState(dark);

  useEffect(() => {
    listeners.add(setIsDark);
    applyTheme();
    return () => {
      listeners.delete(setIsDark);
    };
  }, []);

  const toggleTheme = () => {
    dark = !dark;
    applyTheme();
    listeners.forEach((listener) => listener(dark));
  };

  return { isDark, toggleTheme };
}
