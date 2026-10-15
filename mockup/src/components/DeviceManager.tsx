import { useState } from "react";
import { Router, Plus, Trash2, Copy } from "lucide-react";
import { Card, CardHeader, CardBody } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Field, Input } from "./Input";
import { Confirmation } from "./Confirmation";
import { useToast } from "../hooks/useToast";
import { addDevice, revokeDevice, useDevices } from "../features/settings/devices";
import type { Device } from "../features/settings/devices";

/**
 * Gestión de dispositivos (tornos/lectores NFC) del administrador (RF-80):
 * alta con emisión de token (se muestra una sola vez) y revocación.
 */
export function DeviceManager() {
  const devices = useDevices();
  const { notify } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [newToken, setNewToken] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<Device | null>(null);

  const save = () => {
    if (!name.trim()) {
      notify("Indica un nombre para el dispositivo", "warning");
      return;
    }
    const token = addDevice(name, location);
    setName("");
    setLocation("");
    setAddOpen(false);
    setNewToken(token);
    notify("Dispositivo registrado");
  };

  const confirmRevoke = () => {
    if (revokeTarget) {
      revokeDevice(revokeTarget.id);
      notify("Dispositivo revocado", "info");
    }
    setRevokeTarget(null);
  };

  const copyToken = () => {
    if (newToken && navigator.clipboard) {
      navigator.clipboard
        .writeText(newToken)
        .then(() => notify("Token copiado"))
        .catch(() => notify("No se pudo copiar el token", "error"));
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title="DISPOSITIVOS (TORNOS / NFC)"
          subtitle="Alta, estado y revocación de los lectores de acceso"
          action={
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus size={15} /> REGISTRAR
            </Button>
          }
        />
        <CardBody className="space-y-3">
          {devices.length === 0 ? (
            <p className="py-4 text-center text-sm text-stadio-gray dark:text-white/50">No hay dispositivos registrados.</p>
          ) : (
            devices.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-3">
                <div className="flex items-center gap-3">
                  <span className={`grid h-9 w-9 place-items-center rounded-lg ${d.active ? "bg-stadio-red/10 text-stadio-red" : "bg-gray-100 text-stadio-gray dark:bg-white/10"}`}>
                    <Router size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-stadio-black dark:text-white">{d.name}</p>
                    <p className="text-xs text-stadio-gray">
                      {d.location} · última conexión {d.lastConnection}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={d.active ? "success" : "neutral"} dot>{d.active ? "Activo" : "Inactivo"}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setRevokeTarget(d)} aria-label={`Revocar ${d.name}`}>
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Registrar dispositivo">
        <div className="space-y-3">
          <Field label="Nombre">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Torno entrada principal" />
          </Field>
          <Field label="Ubicación">
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Recepción" />
          </Field>
          <p className="text-xs text-stadio-gray dark:text-white/50">
            Al registrar se emite un token (Sanctum) con la ability <span className="font-semibold">acceso:registrar</span>. Solo se muestra una vez.
          </p>
          <Button className="w-full" onClick={save}>REGISTRAR DISPOSITIVO</Button>
        </div>
      </Modal>

      <Modal open={newToken !== null} onClose={() => setNewToken(null)} title="Token del dispositivo">
        <div className="space-y-3">
          <p className="text-sm text-stadio-gray dark:text-white/60">
            Copia el token ahora: no volverá a mostrarse. El torno lo usa para autenticarse.
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-gray-100 dark:border-white/10 bg-stadio-gray-light dark:bg-white/5 p-3">
            <code className="flex-1 break-all text-xs font-semibold text-stadio-black dark:text-white">{newToken}</code>
            <Button variant="ghost" size="sm" onClick={copyToken} aria-label="Copiar token">
              <Copy size={15} />
            </Button>
          </div>
          <Button className="w-full" onClick={() => setNewToken(null)}>HECHO</Button>
        </div>
      </Modal>

      <Confirmation
        open={revokeTarget !== null}
        title="Revocar dispositivo"
        message={`¿Seguro que quieres revocar "${revokeTarget?.name}"? Su token dejará de funcionar.`}
        confirmLabel="REVOCAR"
        danger
        onConfirm={confirmRevoke}
        onCancel={() => setRevokeTarget(null)}
      />
    </>
  );
}
