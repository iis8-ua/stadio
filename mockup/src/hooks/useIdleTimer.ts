import { useCallback, useEffect, useRef } from "react";

interface IdleTimerOptions {
  /** Tiempo total de inactividad antes de cerrar la sesión (ms). */
  timeoutMs: number;
  /** Antelación con la que se avisa al usuario (ms). */
  warnMs: number;
  /** Se llama cuando se alcanza el aviso. */
  onWarn?: () => void;
  /** Se llama cuando expira el tiempo total. */
  onTimeout: () => void;
  enabled?: boolean;
}

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "wheel"] as const;

/** Cierra la sesión (con aviso previo) tras un periodo de inactividad. */
export function useIdleTimer({ timeoutMs, warnMs, onWarn, onTimeout, enabled = true }: IdleTimerOptions) {
  const warnRef = useRef(onWarn);
  const timeoutRef = useRef(onTimeout);
  const timers = useRef<{ warn?: number; out?: number }>({});

  useEffect(() => {
    warnRef.current = onWarn;
    timeoutRef.current = onTimeout;
  }, [onWarn, onTimeout]);

  const clear = useCallback(() => {
    if (timers.current.warn) window.clearTimeout(timers.current.warn);
    if (timers.current.out) window.clearTimeout(timers.current.out);
    timers.current = {};
  }, []);

  const reset = useCallback(() => {
    clear();
    if (!enabled) return;
    timers.current.warn = window.setTimeout(() => warnRef.current?.(), Math.max(0, timeoutMs - warnMs));
    timers.current.out = window.setTimeout(() => timeoutRef.current(), timeoutMs);
  }, [clear, enabled, timeoutMs, warnMs]);

  useEffect(() => {
    reset();
    const handler = () => reset();
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    return () => {
      clear();
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, handler));
    };
  }, [reset, clear]);

  return reset;
}
