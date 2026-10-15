import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, CreditCard, Landmark } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { BackButton } from "../../components/BackButton";
import { Confirmation } from "../../components/Confirmation";
import { Select } from "../../components/Input";
import { payments } from "../../data/payments";
import { getClientProfile, maskIban, isAutoChargeEnabled, isEmailVerified } from "../../features/profile/clientProfile";
import { getGymSettings, formatFee } from "../../features/settings/gymSettings";
import { useToast } from "../../hooks/useToast";
import type { Payment } from "../../types";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const YEARS = [2025, 2026, 2027];
const CURRENT_YEAR = 2026;

function todayLabel(): string {
  return new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function ClientPayments() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(-1); // -1 = todos los meses
  const [list, setList] = useState<Payment[]>(payments);
  const [payTarget, setPayTarget] = useState<Payment | null>(null);
  const { notify } = useToast();

  const yearPayments = list.filter((p) => p.month.endsWith(String(year)));
  const visiblePayments =
    month === -1 ? yearPayments : yearPayments.filter((p) => p.month === `${MONTHS[month]} ${year}`);
  const periodLabel = month === -1 ? `Todo ${year}` : `${MONTHS[month]} ${year}`;

  const confirmPay = () => {
    if (!payTarget) return;
    if (!isEmailVerified()) {
      notify("Verifica tu correo electrónico para poder pagar (RF-97)", "warning");
      setPayTarget(null);
      return;
    }
    setList((l) => l.map((p) => (p.id === payTarget.id ? { ...p, status: "Pagada", date: todayLabel() } : p)));
    notify("Cuota pagada correctamente");
    setPayTarget(null);
  };

  const profile = getClientProfile();
  const bank = profile.bankAccount;
  const membershipFee = getGymSettings().membershipFee;
  const hasPending = list.some((p) => p.status === "Pendiente");

  // RF-57: cobro automático si hay cuenta bancaria configurada.
  const runAutoCharge = () => {
    const pending = list.find((p) => p.status === "Pendiente");
    if (!pending) return;
    if (!isEmailVerified()) {
      notify("Verifica tu correo electrónico para poder pagar (RF-97)", "warning");
      return;
    }
    if (!isAutoChargeEnabled()) {
      notify("No hay una cuenta bancaria configurada para el cobro automático", "error");
      return;
    }
    setList((l) => l.map((p) => (p.id === pending.id ? { ...p, status: "Pagada", date: todayLabel() } : p)));
    notify(`Cobro automático realizado: ${pending.month}`);
  };

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <BackButton />

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Historial de cuotas</h1>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">
          Tu cuota mensual · {formatFee(membershipFee)}/mes
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3">
        <div className="w-28">
          <Select value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label="Año">
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>
        </div>
        <div className="w-44">
          <Select value={month} onChange={(e) => setMonth(Number(e.target.value))} aria-label="Mes">
            <option value={-1}>Todos los meses</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader
          title="COBRO AUTOMÁTICO"
          action={
            <Badge variant={isAutoChargeEnabled() ? "success" : "neutral"} dot>
              {isAutoChargeEnabled() ? "Activo" : "Inactivo"}
            </Badge>
          }
        />
        <CardBody className="space-y-3">
          {bank ? (
            <>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-stadio-red/10 text-stadio-red">
                  <Landmark size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold text-stadio-black dark:text-white">{bank.holder}</p>
                  <p className="text-xs text-stadio-gray dark:text-white/50">{maskIban(bank.iban)}</p>
                </div>
              </div>
              <p className="text-xs text-stadio-gray dark:text-white/50">
                {bank.autoCharge
                  ? "La cuota mensual se cargará automáticamente el día de vencimiento."
                  : "El cobro automático está desactivado. Actívalo en tus datos bancarios."}
              </p>
              {hasPending && bank.autoCharge && (
                <Button size="sm" onClick={runAutoCharge}>
                  <CreditCard size={15} /> PROCESAR COBRO AUTOMÁTICO (SIMULADO)
                </Button>
              )}
            </>
          ) : (
            <p className="text-sm text-stadio-gray-dark dark:text-white/60">
              No tienes ninguna cuenta bancaria configurada.{" "}
              <Link to="/client/profile" className="font-bold text-stadio-red hover:underline">
                Configúrala en tu perfil
              </Link>{" "}
              para activar el cobro automático.
            </p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-3">
          {visiblePayments.length === 0 ? (
            <p className="text-sm text-stadio-gray dark:text-white/50">
              No hay cuotas registradas en {periodLabel}.
            </p>
          ) : (
            visiblePayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-4"
              >
                <div className="flex items-center gap-3">
                  {p.status === "Pagada" ? (
                    <CheckCircle2 size={22} className="text-stadio-green" />
                  ) : (
                    <Clock size={22} className="text-stadio-amber" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-stadio-black dark:text-white">{p.month}</p>
                    <p className="text-xs text-stadio-gray dark:text-white/50">
                      {p.date ? `Pagada el ${p.date}` : "Fecha de pago pendiente"}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={p.status === "Pagada" ? "success" : "warning"} dot>
                    {p.status}
                  </Badge>
                  {p.status === "Pendiente" && (
                    <Button size="sm" onClick={() => setPayTarget(p)}>
                      <CreditCard size={15} /> PAGAR
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <Confirmation
        open={payTarget !== null}
        title="Pagar cuota"
        message={`Vas a pagar la cuota de ${payTarget?.month} (${formatFee(membershipFee)}). El pago con tarjeta está simulado hasta integrar la pasarela.`}
        confirmLabel={`PAGAR ${formatFee(membershipFee)}`}
        onConfirm={confirmPay}
        onCancel={() => setPayTarget(null)}
      />
    </div>
  );
}
