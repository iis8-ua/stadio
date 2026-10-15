import { Component, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { LoadingState, ErrorState } from "./AsyncState";

type ResolvedStatus = "success" | "error";

/**
 * Muestra un estado de carga al entrar en una vista y permite simular un
 * error de carga añadiendo `?simulate=error` a la URL. Al cambiar de vista
 * se reinicia el ciclo de carga.
 */
export function RouteAsync({ children }: { children: ReactNode }) {
  const location = useLocation();
  const locationKey = location.pathname + location.search;
  const [retry, setRetry] = useState<{ key: string; count: number } | null>(null);
  const [resolved, setResolved] = useState<{ key: string; status: ResolvedStatus } | null>(null);

  const retriedForLocation = retry?.key === locationKey && retry.count > 0;
  const renderKey = `${locationKey}#${retriedForLocation ? retry.count : 0}`;

  useEffect(() => {
    const wantsError =
      new URLSearchParams(location.search).get("simulate") === "error" && !retriedForLocation;
    const timer = window.setTimeout(
      () => setResolved({ key: renderKey, status: wantsError ? "error" : "success" }),
      260
    );
    return () => window.clearTimeout(timer);
  }, [renderKey, location.search, locationKey, retriedForLocation]);

  const status: "loading" | ResolvedStatus = resolved?.key === renderKey ? resolved.status : "loading";

  if (status === "loading") return <LoadingState />;
  if (status === "error") {
    return (
      <ErrorState
        message="No se han podido cargar los datos de esta vista. Comprueba tu conexión e inténtalo de nuevo."
        onRetry={() => setRetry({ key: locationKey, count: (retry?.count ?? 0) + 1 })}
      />
    );
  }
  return <>{children}</>;
}

interface BoundaryState {
  hasError: boolean;
}

/** Captura errores de render y muestra un estado de error en lugar de una pantalla en blanco. */
export class ErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Error de render:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          message="Se ha producido un error inesperado en esta vista."
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }
    return this.props.children;
  }
}
