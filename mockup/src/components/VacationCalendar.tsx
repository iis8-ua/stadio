import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarCheck2, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardBody } from "./Card";
import { Badge } from "./Badge";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import type { Employee, VacationPeriod } from "../types";
import { roleLabel } from "../data/employees";

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const YEARS = [2025, 2026, 2027];
const CURRENT_MONTH = 8;
const CURRENT_YEAR = 2026;

const selectClass =
  "rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black px-2.5 py-1.5 text-xs font-bold text-stadio-black dark:text-white outline-none focus:border-stadio-red";

function dayInPeriod(p: VacationPeriod, year: number, monthIndex: number, day: number): boolean {
  const d = new Date(year, monthIndex, day).getTime();
  const start = new Date(`${p.start}T00:00:00`).getTime();
  const end = new Date(`${p.end}T23:59:59`).getTime();
  return d >= start && d <= end;
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

interface Props {
  employees: Employee[];
  onSelectEmployee?: (e: Employee) => void;
}

export function VacationCalendar({ employees, onSelectEmployee }: Props) {
  const [monthIndex, setMonthIndex] = useState(CURRENT_MONTH);
  const [year, setYear] = useState(CURRENT_YEAR);

  const active = employees.filter((e) => e.status === "Activo");
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const lead = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const monthKey = `${MONTHS[monthIndex]} ${year}`;

  const vacationersThisMonth = active.filter((e) =>
    e.vacations.some((v) => {
      const start = new Date(`${v.start}T00:00:00`);
      const end = new Date(`${v.end}T23:59:59`);
      const first = new Date(year, monthIndex, 1);
      const last = new Date(year, monthIndex, daysInMonth);
      return start <= last && end >= first;
    })
  );

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const vacationers = active.filter((e) => e.vacations.some((v) => dayInPeriod(v, year, monthIndex, day)));
    const working = active.length - vacationers.length;
    const isWeekend = new Date(year, monthIndex, day).getDay() === 0 || new Date(year, monthIndex, day).getDay() === 6;
    return { day, vacationers, working, isWeekend, uncovered: working === 0 };
  });

  const cells: (typeof days[number] | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const goPrev = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => Math.max(YEARS[0], y - 1));
    } else {
      setMonthIndex((m) => m - 1);
    }
  };
  const goNext = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => Math.min(YEARS[YEARS.length - 1], y + 1));
    } else {
      setMonthIndex((m) => m + 1);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          title="CALENDARIO DE VACACIONES"
          subtitle="Cobertura de personal por día"
          action={
            <div className="flex items-center gap-2">
              <button onClick={goPrev} className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10" aria-label="Mes anterior">
                <ChevronLeft size={20} />
              </button>
              <select value={monthIndex} onChange={(e) => setMonthIndex(Number(e.target.value))} className={selectClass}>
                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectClass}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <button onClick={goNext} className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10" aria-label="Mes siguiente">
                <ChevronRight size={20} />
              </button>
              <Button variant="secondary" size="sm" onClick={() => { setMonthIndex(CURRENT_MONTH); setYear(CURRENT_YEAR); }}>
                <CalendarCheck2 size={14} /> HOY
              </Button>
            </div>
          }
        />
        <CardBody>
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-gray">
              <span className="h-2.5 w-2.5 rounded-full bg-stadio-green" /> En servicio
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-gray">
              <span className="h-2.5 w-2.5 rounded-full bg-stadio-red/70" /> Sin cobertura
            </span>
            <Badge variant="neutral"><AlertTriangle size={12} className="mr-1 inline" />Días sin empleados disponibles</Badge>
          </div>

          <div className="overflow-x-auto">
            <div className="grid min-w-[640px] grid-cols-7 gap-1.5">
              {WEEKDAYS.map((w) => (
                <div key={w} className="pb-1 text-center text-xs font-bold uppercase tracking-wider text-stadio-gray">
                  {w}
                </div>
              ))}
              {cells.map((cell, idx) =>
                cell ? (
                  <div
                    key={`${cell.day}-${idx}`}
                    className={`min-h-[84px] rounded-xl border p-2 ${
                      cell.uncovered
                        ? "border-stadio-red/60 bg-stadio-red/10 dark:bg-red-950/40"
                        : "border-gray-100 dark:border-white/10 bg-white dark:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${cell.isWeekend ? "text-stadio-gray" : "text-stadio-black dark:text-white"}`}>
                        {cell.day}
                      </span>
                      {cell.uncovered ? (
                        <AlertTriangle size={14} className="text-stadio-red" />
                    ) : (
                      <span className="text-[10px] font-bold text-stadio-green">{cell.working}</span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    {cell.vacationers.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => onSelectEmployee?.(e)}
                        className="flex w-full items-center gap-1 rounded text-left hover:bg-stadio-gray-light/60 dark:hover:bg-white/5"
                        title={`${e.name} de vacaciones`}
                      >
                        <Avatar initials={e.initials} color={e.color} size="sm" />
                        <span className="truncate text-[10px] font-semibold text-stadio-gray-dark dark:text-white/60">{e.initials}</span>
                      </button>
                    ))}
                    {cell.vacationers.length === 0 && (
                      <p className="text-[10px] font-semibold text-stadio-green">Toda la plantilla</p>
                    )}
                  </div>
                </div>
              ) : (
                <div key={`empty-${idx}`} className="min-h-[84px] rounded-xl border border-transparent" />
              )
            )}
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="DE VACACIONES EN ESTE MES" subtitle={monthKey} />
          <CardBody className="space-y-2">
            {vacationersThisMonth.length === 0 && (
              <p className="text-sm text-stadio-gray dark:text-white/50">Nadie de vacaciones en {monthKey.toLowerCase()}.</p>
            )}
            {vacationersThisMonth.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => onSelectEmployee?.(e)}
                className="flex w-full items-center gap-3 rounded-xl border border-gray-100 p-3 text-left transition-colors hover:bg-stadio-gray-light/60 dark:border-white/10 dark:hover:bg-white/5"
              >
                <Avatar initials={e.initials} color={e.color} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-stadio-black dark:text-white">{e.name}</p>
                  <p className="text-xs text-stadio-gray">{roleLabel(e.roles)}</p>
                </div>
                <div className="text-right">
                  {e.vacations
                    .filter((v) => {
                      const start = new Date(`${v.start}T00:00:00`);
                      const end = new Date(`${v.end}T23:59:59`);
                      const first = new Date(year, monthIndex, 1);
                      const last = new Date(year, monthIndex, daysInMonth);
                      return start <= last && end >= first;
                    })
                    .map((v) => (
                      <Badge key={v.id} variant="warning">{fmtDate(v.start)} - {fmtDate(v.end)}</Badge>
                    ))}
                </div>
              </button>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="SIN COBERTURA" subtitle={monthKey} />
          <CardBody className="space-y-2">
            {days.filter((d) => d.uncovered).length === 0 && (
              <p className="text-sm text-stadio-gray dark:text-white/50">Todos los días tienen personal disponible.</p>
            )}
            {days
              .filter((d) => d.uncovered)
              .map((d) => (
                <div key={d.day} className="flex items-center gap-3 rounded-xl border border-stadio-red/40 bg-stadio-red/10 dark:bg-red-950/40 p-3">
                  <AlertTriangle size={16} className="text-stadio-red" />
                  <p className="text-sm font-bold text-stadio-black dark:text-white">
                    {d.day} {MONTHS[monthIndex]} {year}
                  </p>
                  <p className="ml-auto text-xs font-semibold text-stadio-red">Sin empleados</p>
                </div>
              ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}