import { useState } from "react";
import { DoorOpen, Wallet, CreditCard, Smartphone, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Field, Input } from "./Input";
import { ToggleSwitch } from "./ToggleSwitch";
import { useToast } from "../hooks/useToast";

interface IntegrationField {
  key: string;
  label: string;
  placeholder: string;
  value: string;
  secret?: boolean;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  connected: boolean;
  fields: IntegrationField[];
}

const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: "tornos",
    name: "Tornos / NFC",
    description: "Control de accesos físicos y tornos",
    icon: DoorOpen,
    connected: true,
    fields: [
      { key: "url", label: "URL del controlador", placeholder: "https://...", value: "https://tornos.stadio.local" },
      { key: "token", label: "Token de acceso", placeholder: "••••••••", value: "trn_9f2a41c7", secret: true },
    ],
  },
  {
    id: "bizum",
    name: "Pagos Bizum",
    description: "Cobros instantáneos mediante Bizum",
    icon: Wallet,
    connected: true,
    fields: [
      { key: "phone", label: "Número Bizum", placeholder: "+34 600 000 000", value: "+34 600 000 000" },
      { key: "merchant", label: "Código de comercio", placeholder: "COM-0000", value: "COM-4821" },
    ],
  },
  {
    id: "pasarela",
    name: "Pasarela de pago",
    description: "Cobros con tarjeta (TPV virtual)",
    icon: CreditCard,
    connected: false,
    fields: [
      { key: "apiKey", label: "API Key", placeholder: "pk_live_...", value: "" },
      { key: "secret", label: "Clave secreta", placeholder: "sk_live_...", value: "", secret: true },
    ],
  },
  {
    id: "app",
    name: "App móvil",
    description: "Sincronización con la app de clientes",
    icon: Smartphone,
    connected: true,
    fields: [
      { key: "appId", label: "ID de la aplicación", placeholder: "app_...", value: "app_stadio_01" },
      { key: "pushKey", label: "Clave de notificaciones push", placeholder: "••••••••", value: "fcm_2b7d19", secret: true },
    ],
  },
  {
    id: "email",
    name: "Correo electrónico",
    description: "Envío de recibos y notificaciones",
    icon: Mail,
    connected: false,
    fields: [
      { key: "smtp", label: "Servidor SMTP", placeholder: "smtp.dominio.com", value: "" },
      { key: "user", label: "Usuario", placeholder: "correo@dominio.com", value: "" },
      { key: "pass", label: "Contraseña", placeholder: "••••••••", value: "", secret: true },
    ],
  },
];

export function IntegrationsSettings() {
  const { notify } = useToast();
  const [items, setItems] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [configId, setConfigId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const configuring = items.find((i) => i.id === configId) ?? null;

  const toggleConnection = (item: Integration) => {
    const connected = !item.connected;
    setItems((list) => list.map((i) => (i.id === item.id ? { ...i, connected } : i)));
    notify(`${item.name} ${connected ? "conectada" : "desconectada"}`, connected ? "success" : "info");
  };

  const openConfig = (item: Integration) => {
    setConfigId(item.id);
    setDraft(Object.fromEntries(item.fields.map((f) => [f.key, f.value])));
  };

  const closeConfig = () => {
    setConfigId(null);
    setDraft({});
  };

  const saveConfig = () => {
    if (!configuring) return;
    setItems((list) =>
      list.map((i) =>
        i.id === configuring.id
          ? {
              ...i,
              connected: true,
              fields: i.fields.map((f) => ({ ...f, value: draft[f.key] ?? f.value })),
            }
          : i,
      ),
    );
    notify(`${configuring.name} configurada y conectada`, "success");
    closeConfig();
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className="rounded-xl border border-gray-100 p-3 dark:border-white/10">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stadio-red/10 text-stadio-red">
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-stadio-black dark:text-white">{item.name}</p>
                <p className="text-xs text-stadio-gray dark:text-white/50">{item.description}</p>
              </div>
              <ToggleSwitch
                checked={item.connected}
                onChange={() => toggleConnection(item)}
                label={`${item.connected ? "Desconectar" : "Conectar"} ${item.name}`}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <Badge variant={item.connected ? "success" : "neutral"} dot={item.connected}>
                {item.connected ? "Conectado" : "Sin conectar"}
              </Badge>
              <button
                type="button"
                onClick={() => openConfig(item)}
                className="text-xs font-semibold text-stadio-red hover:underline"
              >
                Configurar
              </button>
            </div>
          </div>
        );
      })}

      <Modal
        open={!!configuring}
        onClose={closeConfig}
        title={configuring ? `Configurar · ${configuring.name}` : "Configurar"}
      >
        {configuring && (
          <div className="space-y-3">
            {configuring.fields.map((field) => (
              <Field key={field.key} label={field.label}>
                <Input
                  type={field.secret ? "password" : "text"}
                  placeholder={field.placeholder}
                  value={draft[field.key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                />
              </Field>
            ))}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={closeConfig}>Cancelar</Button>
              <Button onClick={saveConfig}>Guardar y conectar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
