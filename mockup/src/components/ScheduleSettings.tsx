import { useState } from "react";
import { CalendarDays, Plus, Trash2, Ban } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Field, Input } from "./Input";
import { getGymSettings, updateGymSettings } from "../features/settings/gymSettings";
import type { DayHours, Holiday } from "../features/settings/gymSettings";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const WEEKDAY_SHORT = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function weekdayOf(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return WEEKDAY_SHORT[d.getDay()] ?? "";
}

function ClosedToggle({ closed, onChange, label = "Cerrado" }: { closed: boolean; onChange: () => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={closed}
      onClick={onChange}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
        closed
          ? "bg-stadio-red text-white"
          : "bg-stadio-gray-light text-stadio-gray-dark hover:bg-gray-200 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15"
      }`}
    >
      <Ban size={13} />
      {label}
    </button>
  );
}

export function ScheduleSettings() {
  const initial = getGymSettings();
  const [week, setWeek] = useState<DayHours[]>(initial.week);
  const [holidays, setHolidays] = useState<Holiday[]>(initial.holidays);

  const [newDate, setNewDate] = useState("");
  const [newClosed, setNewClosed] = useState(false);
  const [newOpen, setNewOpen] = useState("10:00");
  const [newClose, setNewClose] = useState("14:00");

  const updateDay = (index: number, patch: Partial<DayHours>) =>
    setWeek((w) => {
      const next = w.map((d, i) => (i === index ? { ...d, ...patch } : d));
      updateGymSettings({ week: next });
      return next;
    });

  const addHoliday = () => {
    if (!newDate) return;
    const holiday: Holiday = {
      id: `h-${newDate}-${Date.now()}`,
      date: newDate,
      open: newOpen,
      close: newClose,
      closed: newClosed,
    };
    setHolidays((h) => {
      const next = [...h, holiday].sort((a, b) => a.date.localeCompare(b.date));
      updateGymSettings({ holidays: next });
      return next;
    });
    setNewDate("");
    setNewClosed(false);
  };

  const removeHoliday = (id: string) =>
    setHolidays((h) => {
      const next = h.filter((x) => x.id !== id);
      updateGymSettings({ holidays: next });
      return next;
    });

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stadio-gray dark:text-white/40">
          Horario semanal
        </p>
        <div className="space-y-2">
          {week.map((d, i) => (
            <div
              key={DAYS[i]}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-3"
            >
              <span className="w-24 text-sm font-bold text-stadio-black dark:text-white">{DAYS[i]}</span>

              {d.closed ? (
                <Badge variant="error" dot>Cerrado todo el día</Badge>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-28">
                    <Input
                      type="time"
                      value={d.open}
                      onChange={(e) => updateDay(i, { open: e.target.value })}
                      aria-label={`Hora de apertura del ${DAYS[i].toLowerCase()}`}
                    />
                  </div>
                  <span className="text-xs text-stadio-gray dark:text-white/40">a</span>
                  <div className="w-28">
                    <Input
                      type="time"
                      value={d.close}
                      onChange={(e) => updateDay(i, { close: e.target.value })}
                      aria-label={`Hora de cierre del ${DAYS[i].toLowerCase()}`}
                    />
                  </div>
                </div>
              )}

              <div className="ml-auto">
                <ClosedToggle closed={d.closed} onChange={() => updateDay(i, { closed: !d.closed })} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 dark:border-white/10 p-3">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays size={16} className="text-stadio-red" />
          <div>
            <p className="text-sm font-bold text-stadio-black dark:text-white">Festivos y días especiales</p>
            <p className="text-xs text-stadio-gray dark:text-white/50">
              Elige la fecha en el calendario y define su horario o márcalo como cerrado.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Fecha">
            <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
          </Field>

          {!newClosed && (
            <div className="grid grid-cols-2 gap-2">
              <Field label="Apertura">
                <Input type="time" value={newOpen} onChange={(e) => setNewOpen(e.target.value)} />
              </Field>
              <Field label="Cierre">
                <Input type="time" value={newClose} onChange={(e) => setNewClose(e.target.value)} />
              </Field>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <ClosedToggle closed={newClosed} onChange={() => setNewClosed((c) => !c)} label="Cerrado ese día" />
          <Button size="sm" variant="secondary" onClick={addHoliday} disabled={!newDate}>
            <Plus size={14} /> Añadir festivo
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {holidays.length === 0 && (
            <p className="text-sm text-stadio-gray dark:text-white/50">No hay festivos configurados.</p>
          )}
          {holidays.map((h) => (
            <div
              key={h.id}
              className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-3"
            >
              <span className="text-sm font-bold text-stadio-black dark:text-white">
                {fmtDate(h.date)}
                <span className="ml-2 text-xs font-semibold capitalize text-stadio-gray">{weekdayOf(h.date)}</span>
              </span>
              {h.closed ? (
                <Badge variant="error" dot>Cerrado</Badge>
              ) : (
                <Badge variant="info">{h.open} - {h.close}</Badge>
              )}
              <button
                type="button"
                onClick={() => removeHoliday(h.id)}
                className="ml-auto rounded-lg p-1.5 text-stadio-gray-dark hover:bg-stadio-gray-light hover:text-stadio-red dark:text-white/60 dark:hover:bg-white/10"
                aria-label={`Eliminar festivo del ${fmtDate(h.date)}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
