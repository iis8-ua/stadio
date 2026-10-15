import { useState } from "react";
import { ShieldCheck, RotateCcw } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Field, Input } from "./Input";
import { useToast } from "../hooks/useToast";
import {
  DEFAULT_ROLES,
  PERMISSIONS,
  PERMISSION_GROUPS,
  useRoles,
  updateRoleConfig,
} from "../features/settings/rolePermissions";
import type { Permission, RolePermissionConfig } from "../features/settings/rolePermissions";
import type { Role } from "../types";

function PermissionRow({
  permission,
  checked,
  onToggle,
}: {
  permission: Permission;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 text-left transition-colors hover:bg-stadio-gray-light/60 dark:border-white/10 dark:hover:bg-white/5"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-stadio-black dark:text-white">{permission.label}</span>
        <span className="block text-xs text-stadio-gray dark:text-white/50">{permission.description}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-stadio-red" : "bg-stadio-gray-light dark:bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function RolesPermissions() {
  const { notify } = useToast();
  const roles = useRoles();
  const [editingId, setEditingId] = useState<Role | null>(null);
  const [draft, setDraft] = useState<{ name: string; permissions: Set<string> } | null>(null);

  const editing = roles.find((r) => r.id === editingId) ?? null;

  const openEditor = (role: RolePermissionConfig) => {
    setEditingId(role.id);
    setDraft({ name: role.name, permissions: new Set(role.permissions) });
  };

  const closeEditor = () => {
    setEditingId(null);
    setDraft(null);
  };

  const togglePermission = (id: string) => {
    setDraft((d) => {
      if (!d) return d;
      const next = new Set(d.permissions);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...d, permissions: next };
    });
  };

  const save = () => {
    if (!editing || !draft) return;
    const name = draft.name.trim() || editing.name;
    updateRoleConfig(editing.id, { name, permissions: [...draft.permissions] });
    notify(`Permisos de ${name} actualizados`, "success");
    closeEditor();
  };

  const restoreDefaults = () => {
    if (!editing) return;
    const original = DEFAULT_ROLES.find((r) => r.id === editing.id);
    if (!original) return;
    setDraft({ name: original.name, permissions: new Set(original.permissions) });
    notify(`Valores por defecto de ${original.name} cargados`, "info");
  };

  return (
    <div className="space-y-2">
      {roles.map((role) => (
        <div
          key={role.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 dark:border-white/10"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stadio-red/10 text-stadio-red">
              <ShieldCheck size={16} />
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-bold text-stadio-black dark:text-white">
                {role.name}
                <Badge variant="neutral">{role.permissions.length} permisos</Badge>
              </p>
              <p className="truncate text-xs text-stadio-gray dark:text-white/50">{role.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openEditor(role)}
            className="text-xs font-semibold text-stadio-red hover:underline"
          >
            Editar permisos
          </button>
        </div>
      ))}

      <Modal
        open={!!editing}
        onClose={closeEditor}
        title={`Editar rol · ${draft?.name.trim() || editing?.name || ""}`}
      >
        {draft && (
          <div className="space-y-5">
            <Field label="Nombre del rol">
              <Input
                value={draft.name}
                onChange={(e) => setDraft((d) => (d ? { ...d, name: e.target.value } : d))}
              />
            </Field>

            <div className="space-y-4">
              {PERMISSION_GROUPS.map((group) => (
                <div key={group}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stadio-gray dark:text-white/40">
                    {group}
                  </p>
                  <div className="space-y-2">
                    {PERMISSIONS.filter((p) => p.group === group).map((p) => (
                      <PermissionRow
                        key={p.id}
                        permission={p}
                        checked={draft.permissions.has(p.id)}
                        onToggle={() => togglePermission(p.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={restoreDefaults}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stadio-gray-dark hover:text-stadio-red dark:text-white/50"
              >
                <RotateCcw size={13} /> Restaurar por defecto
              </button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={closeEditor}>Cancelar</Button>
                <Button onClick={save}>Guardar cambios</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
