import { AccessHistory } from "../../components/AccessHistory";
import { BackButton } from "../../components/BackButton";

export function ClientProfileAccess() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <BackButton />

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Historial de accesos</h1>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">
          Tus entradas y salidas al gimnasio
        </p>
      </div>

      <AccessHistory />
    </div>
  );
}