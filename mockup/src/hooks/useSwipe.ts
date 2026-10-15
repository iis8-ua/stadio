import { useRef } from "react";
import type { TouchEvent } from "react";

/** Detecta un gesto de deslizamiento horizontal y llama al callback correspondiente. */
export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void, threshold = 50) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    startX.current = null;
    startY.current = null;
    // Ignora gestos cortos o predominantemente verticales (scroll).
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) onSwipeLeft();
    else onSwipeRight();
  };

  return { onTouchStart, onTouchEnd };
}
