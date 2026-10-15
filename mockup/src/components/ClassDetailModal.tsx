import { useState } from "react";
import { Clock, DoorOpen, Dumbbell, Users, User, Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal } from "./Modal";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Select } from "./Input";
import { Avatar } from "./Avatar";
import { getEnrolledMembers, fmtShortDate } from "../data/classes";
import { findEmployeeByName, equipment } from "../data/employees";
import { findClientByName } from "../data/users";
import { getClassMaterials, setClassMaterials } from "../features/classes/classMaterials";
import { useToast } from "../hooks/useToast";
import type { GymClass } from "../types";

interface ClassDetailModalProps {
  gymClass: GymClass | null;
  onClose: () => void;
  onEdit?: (c: GymClass) => void;
  onDelete?: (c: GymClass) => void;
}

export function ClassDetailModal({ gymClass, onClose, onEdit, onDelete }: ClassDetailModalProps) {
  return (
    <Modal open={!!gymClass} onClose={onClose} title={gymClass ? gymClass.name : ""}>
      {gymClass && (
        <ClassDetailContent
          key={gymClass.id}
          gymClass={gymClass}
          onClose={onClose}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </Modal>
  );
}

function ClassDetailContent({
  gymClass,
  onClose,
  onEdit,
  onDelete,
}: {
  gymClass: GymClass;
  onClose: () => void;
  onEdit?: (c: GymClass) => void;
  onDelete?: (c: GymClass) => void;
}) {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [editingMaterials, setEditingMaterials] = useState(false);
  const [materials, setMaterials] = useState<string[]>(() =>
    getClassMaterials(gymClass.id, gymClass.materials ?? [])
  );

  const members = getEnrolledMembers(gymClass.id, gymClass.day, gymClass.booked);
  const trainer = findEmployeeByName(gymClass.trainer);

  const saveMaterials = () => {
    const clean = [...new Set(materials.map((m) => m.trim()).filter(Boolean))];
    setClassMaterials(gymClass.id, clean);
    setMaterials(clean);
    setEditingMaterials(false);
    notify("Material actualizado");
  };

  const cancelMaterials = () => {
    setMaterials(getClassMaterials(gymClass.id, gymClass.materials ?? []));
    setEditingMaterials(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-stadio-gray-light/50 dark:bg-white/5 p-3">
        <p className="text-xs font-bold uppercase tracking-wider text-stadio-gray">
          {fmtShortDate(gymClass.date)} · {gymClass.time}
        </p>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/60">{gymClass.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <DetailRow
          icon={User}
          label="Empleado"
          value={gymClass.trainer}
          onClick={trainer ? () => navigate(`/admin/employees/${trainer.id}`) : undefined}
        />
        <DetailRow icon={Clock} label="Duración" value={gymClass.duration} />
        <DetailRow icon={DoorOpen} label="Sala" value={gymClass.room} />
        <DetailRow icon={Users} label="Ocupación" value={`${gymClass.booked} / ${gymClass.capacity} usuarios`} />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-stadio-gray">Material / Equipamiento</p>
          {!editingMaterials && (
            <button
              type="button"
              onClick={() => setEditingMaterials(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-stadio-red hover:underline"
            >
              <Pencil size={13} /> Editar
            </button>
          )}
        </div>

        {editingMaterials ? (
          <div className="space-y-2">
            {materials.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <Select
                  value={m}
                  onChange={(e) =>
                    setMaterials((ms) => ms.map((x, idx) => (idx === i ? e.target.value : x)))
                  }
                >
                  <option value="">Selecciona material…</option>
                  {equipment.map((eq) => (
                    <option key={eq.id} value={eq.name}>{eq.name}</option>
                  ))}
                  {m && !equipment.some((eq) => eq.name === m) && <option value={m}>{m}</option>}
                </Select>
                <button
                  type="button"
                  onClick={() => setMaterials((ms) => ms.filter((_, idx) => idx !== i))}
                  className="rounded-lg p-2 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/40"
                  aria-label="Quitar material"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={() => setMaterials((ms) => [...ms, ""])}>
              <Plus size={14} /> AÑADIR MATERIAL
            </Button>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={cancelMaterials}>Cancelar</Button>
              <Button size="sm" onClick={saveMaterials}>
                <Check size={14} /> Guardar
              </Button>
            </div>
          </div>
        ) : materials.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {materials.map((m, i) => (
              <span key={`${m}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-stadio-red/10 px-2.5 py-1 text-xs font-bold text-stadio-red">
                <Dumbbell size={12} /> {m}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stadio-gray dark:text-white/50">Sin material registrado</p>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-stadio-gray">Apuntados ({gymClass.booked})</p>
          <Badge variant={gymClass.booked >= gymClass.capacity ? "error" : "success"}>
            {gymClass.booked >= gymClass.capacity ? "Completa" : "Plazas disponibles"}
          </Badge>
        </div>
        <ul className="grid max-h-44 grid-cols-1 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
          {members.map((m) => {
            const member = findClientByName(m.name);
            const inner = (
              <>
                <Avatar initials={m.initials} color={m.color} size="sm" />
                <span className="truncate text-xs font-semibold text-stadio-black dark:text-white">{m.name}</span>
              </>
            );
            const base =
              "flex items-center gap-2 rounded-lg border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-1.5";
            return (
              <li key={m.id}>
                {member ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/clients/${member.id}`)}
                    className={`${base} w-full text-left transition-colors hover:border-stadio-red/50`}
                  >
                    {inner}
                  </button>
                ) : (
                  <div className={base}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex gap-2 pt-1">
          {onEdit && (
            <Button variant="primary" className="flex-1" onClick={() => { onClose(); onEdit(gymClass); }}>
              <Pencil size={15} /> Editar
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" className="flex-1" onClick={() => { onClose(); onDelete(gymClass); }}>
              <Trash2 size={15} /> Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, onClick }: { icon: typeof User; label: string; value: string; onClick?: () => void }) {
  const content = (
    <>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-stadio-red/10 text-stadio-red">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stadio-gray">{label}</p>
        <p className="truncate text-sm font-bold text-stadio-black dark:text-white">{value}</p>
      </div>
    </>
  );
  const className =
    "flex items-center gap-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5";
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${className} text-left transition-colors hover:border-stadio-red/50`}>
        {content}
      </button>
    );
  }
  return <div className={className}>{content}</div>;
}
