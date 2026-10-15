import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { revenueYears, monthlyLabels, MONTHS_FULL } from "../../data/analytics";
import { buildFeeYear, buildPendingClients } from "../../data/fees";
import type { PendingClient } from "../../data/fees";
import { findClientByName } from "../../data/users";
import { useToast } from "../../hooks/useToast";
import { getGymSettings, formatFee } from "../../features/settings/gymSettings";
import { downloadFile, toCsv, downloadJson } from "../../utils/download";

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  color: "#111",
};

const selectClass =
  "rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black px-2.5 py-1.5 text-xs font-bold text-stadio-black dark:text-white outline-none focus:border-stadio-red";

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
const maxMonthForYear = (y: number) => (y === CURRENT_YEAR ? CURRENT_MONTH : 11);

export function AdminPayments() {
  const { notify } = useToast();
  const navigate = useNavigate();
  const [sent, setSent] = useState<string[]>([]);
  const [paid, setPaid] = useState<string[]>([]);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(CURRENT_MONTH);
  const [pendYear, setPendYear] = useState(CURRENT_YEAR);
  const [pendMonth, setPendMonth] = useState(CURRENT_MONTH);

  const pendingRows = buildPendingClients(pendYear, pendMonth);
  const membershipFee = getGymSettings().membershipFee;

  const exportPendingCsv = () => {
    const rows: (string | number)[][] = [
      ["Usuario", "Mes", "Importe (EUR)"],
      ...pendingRows.map((c) => [c.name, c.month, c.amount]),
    ];
    downloadFile("cuotas-pendientes-stadio.csv", toCsv(rows), "text/csv;charset=utf-8");
    notify("Cuotas pendientes exportadas (CSV)");
  };

  const exportPendingJson = () => {
    downloadJson("cuotas-pendientes-stadio.json", {
      periodo: `${MONTHS_FULL[pendMonth]} ${pendYear}`,
      importe: membershipFee,
      pendientes: pendingRows,
    });
    notify("Cuotas pendientes exportadas (JSON)");
  };

  const changePendYear = (y: number) => {
    setPendYear(y);
    setPendMonth((m) => Math.min(m, maxMonthForYear(y)));
  };
  const changePendMonth = (m: number) => setPendMonth(m);

  const data = buildFeeYear(year).filter((_, i) => i >= from && i <= to);
  const totals = data.reduce(
    (acc, d) => ({ paid: acc.paid + d.paid, pending: acc.pending + d.pending }),
    { paid: 0, pending: 0 }
  );

  const selectFrom = (v: number) => setFrom(Math.min(v, to));
  const selectTo = (v: number) => setTo(Math.max(v, from));
  const applyPreset = (preset: "mes" | "3m" | "6m" | "año") => {
    const end = maxMonthForYear(year);
    let f = 0;
    let t = end;
    if (preset === "mes") {
      f = end;
      t = end;
    } else if (preset === "3m") {
      f = Math.max(0, end - 2);
      t = end;
    } else if (preset === "6m") {
      f = Math.max(0, end - 5);
      t = end;
    }
    setFrom(f);
    setTo(t);
  };
  const changeYear = (y: number) => {
    const max = maxMonthForYear(y);
    setYear(y);
    setFrom((f) => Math.min(f, max));
    setTo((t) => Math.min(t, max));
  };

  const rangeLabel = `${monthlyLabels[from]}–${monthlyLabels[to]} ${year}`;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Cuotas mensuales</h1>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Una única cuota · {formatFee(membershipFee)}/mes</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-stadio-black p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-stadio-gray">Año</label>
          <select value={year} onChange={(e) => changeYear(Number(e.target.value))} className={selectClass}>
            {revenueYears.filter((y) => y <= CURRENT_YEAR).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <label className="ml-2 text-xs font-bold text-stadio-gray">Desde</label>
          <select value={from} onChange={(e) => selectFrom(Number(e.target.value))} className={selectClass}>
            {monthlyLabels.map((m, i) => (
              <option key={m} value={i} disabled={i > maxMonthForYear(year)}>{m}</option>
            ))}
          </select>
          <label className="ml-2 text-xs font-bold text-stadio-gray">Hasta</label>
          <select value={to} onChange={(e) => selectTo(Number(e.target.value))} className={selectClass}>
            {monthlyLabels.map((m, i) => (
              <option key={m} value={i} disabled={i > maxMonthForYear(year)}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-white/10 bg-stadio-gray-light/60 dark:bg-stadio-black p-1">
          {([["mes", "Mes"], ["3m", "3 meses"], ["6m", "6 meses"], ["año", "Año"]] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => applyPreset(id)}
              className="rounded-md px-2.5 py-1.5 text-xs font-bold text-stadio-gray-dark hover:bg-white dark:text-white/60 dark:hover:bg-white/10"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardBody className="p-4"><p className="text-2xl font-extrabold text-stadio-green">{totals.paid.toLocaleString("es-ES")}</p><p className="text-xs text-stadio-gray">cuotas pagadas</p></CardBody></Card>
        <Card><CardBody className="p-4"><p className="text-2xl font-extrabold text-stadio-amber">{totals.pending.toLocaleString("es-ES")}</p><p className="text-xs text-stadio-gray">cuotas pendientes</p></CardBody></Card>
        <Card><CardBody className="p-4"><p className="text-2xl font-extrabold text-stadio-black dark:text-white">{(totals.paid * membershipFee).toLocaleString("es-ES")} €</p><p className="text-xs text-stadio-gray">ingresos ({rangeLabel})</p></CardBody></Card>
        <Card><CardBody className="p-4"><p className="text-2xl font-extrabold text-stadio-black dark:text-white">{(totals.pending * membershipFee).toLocaleString("es-ES")} €</p><p className="text-xs text-stadio-gray">pendiente de cobro</p></CardBody></Card>
      </div>

      <Card>
        <CardHeader title="Evolución de cuotas" subtitle={rangeLabel} />
        <CardBody>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="paid" name="Pagadas" fill="#16a34a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pending" name="Pendientes" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Usuarios con cuota pendiente"
          subtitle={`${MONTHS_FULL[pendMonth]} ${pendYear} · Recuerda la fecha de pago`}
          action={
            <div className="flex flex-wrap items-center gap-1.5">
              <select value={pendYear} onChange={(e) => changePendYear(Number(e.target.value))} className={selectClass} aria-label="Año de la cuota">
                {revenueYears.filter((y) => y <= CURRENT_YEAR).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select value={pendMonth} onChange={(e) => changePendMonth(Number(e.target.value))} className={selectClass} aria-label="Mes de la cuota">
                {monthlyLabels.map((m, i) => (
                  <option key={m} value={i} disabled={i > maxMonthForYear(pendYear)}>{m}</option>
                ))}
              </select>
              <Button variant="secondary" size="sm" onClick={exportPendingCsv} aria-label="Exportar pendientes en CSV">
                <Download size={15} /> CSV
              </Button>
              <Button variant="secondary" size="sm" onClick={exportPendingJson} aria-label="Exportar pendientes en JSON">
                <Download size={15} /> JSON
              </Button>
            </div>
          }
        />
        <DataTable<PendingClient>
          columns={[
            {
              key: "name",
              header: "Usuario",
              render: (c) => {
                const client = findClientByName(c.name);
                return client ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                    className="font-bold text-stadio-black hover:text-stadio-red dark:text-white"
                  >
                    {c.name}
                  </button>
                ) : (
                  <p className="font-bold text-stadio-black dark:text-white">{c.name}</p>
                );
              },
            },
            { key: "month", header: "Mes", render: (c) => c.month },
            { key: "amount", header: "Importe", render: (c) => `${c.amount} €` },
            {
              key: "actions",
              header: "Acciones",
              render: (c) => {
                if (paid.includes(c.id)) return <Badge variant="success" dot>Pagada</Badge>;
                return (
                  <div className="flex items-center gap-1">
                    {sent.includes(c.id) ? (
                      <Badge variant="neutral">Recordatorio enviado</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => { setSent((s) => [...s, c.id]); notify("Recordatorio de pago enviado a " + c.name); }}
                      >
                        Recordatorio
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => { setPaid((p) => [...p, c.id]); notify(`Cuota de ${c.name} marcada como pagada`); }}
                    >
                      Marcar pagada
                    </Button>
                  </div>
                );
              },
            },
          ]}
          rows={pendingRows}
        />
      </Card>
    </div>
  );
}