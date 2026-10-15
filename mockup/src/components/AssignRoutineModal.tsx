import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Field, Input, Select } from "./Input";
import { setRoutineForDate } from "../features/routines/routineAssignments";

interface Option {
  id: string;
  name: string;
}

interface AssignRoutineModalProps {
  open: boolean;
  onClose: () => void;
  clients: Option[];
  routines: Option[];
  presetClientId?: string;
  presetRoutineId?: string;
  onAssigned?: () => void;
}

function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function AssignRoutineModal({ open, ...rest }: AssignRoutineModalProps) {
  if (!open) return null;
  return <AssignRoutineForm {...rest} />;
}

function AssignRoutineForm({
  onClose,
  clients,
  routines,
  presetClientId,
  presetRoutineId,
  onAssigned,
}: Omit<AssignRoutineModalProps, "open">) {
  const [clientId, setClientId] = useState(presetClientId ?? "");
  const [routineId, setRoutineId] = useState(presetRoutineId ?? "");
  const [date, setDate] = useState(todayIso());

  const confirm = () => {
    const routine = routines.find((r) => r.id === routineId);
    if (!clientId || !routine || !date) return;
    setRoutineForDate(clientId, date, routineId, routine.name);
    onAssigned?.();
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Asignar rutina a un día">
      <div className="space-y-3">
        <Field label="Cliente">
          <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Selecciona un cliente…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Rutina">
          <Select value={routineId} onChange={(e) => setRoutineId(e.target.value)}>
            <option value="">Selecciona una rutina…</option>
            {routines.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Día">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={confirm} disabled={!clientId || !routineId || !date}>Asignar</Button>
        </div>
      </div>
    </Modal>
  );
}
