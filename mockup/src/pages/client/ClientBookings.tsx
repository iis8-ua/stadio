import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { ClientClassesCalendar } from "../../components/ClientClassesCalendar";
import { classTypes, classSessions, resolveGymClasses } from "../../data/classes";
import { getBookings, cancelBooking } from "../../features/bookings/clientBookings";
import type { Booking } from "../../types";
import { Badge } from "../../components/Badge";
import { Confirmation } from "../../components/Confirmation";
import { BookingsPeriodFilter } from "../../components/BookingsPeriodFilter";
import { fmtShortDate } from "../../data/classes";
import { useToast } from "../../hooks/useToast";

/** Marca temporal de una reserva para ordenar por fecha (date en ISO). */
function bookingTimestamp(b: Booking): number {
  return new Date(`${b.date}T12:00:00`).getTime();
}

export function ClientBookings() {
  const navigate = useNavigate();
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const { notify } = useToast();

  const bookings = getBookings();

  const confirmCancel = () => {
    if (!cancelTarget) return;
    cancelBooking(cancelTarget.id);
    notify(`Reserva de ${cancelTarget.className} cancelada`, "info");
    setCancelTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Reservas</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Reserva tu plaza en las clases</p>
        </div>
      </div>

      <ClientClassesCalendar classes={resolveGymClasses(classTypes, classSessions)} />

      <Card>
        <CardHeader title="MIS RESERVAS" />
        <CardBody>
          <BookingsPeriodFilter bookings={bookings}>
            {(filtered) => {
              const sorted = [...filtered].sort((a, b) => bookingTimestamp(b) - bookingTimestamp(a));
              return sorted.length === 0 ? (
                <p className="text-sm text-stadio-gray dark:text-white/50">
                  {bookings.length === 0 ? "No tienes reservas." : "No hay reservas en este periodo."}
                </p>
              ) : (
                <div className="space-y-3">
                  {sorted.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => navigate(`/client/bookings/detail/${b.id}`)}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-3 transition-colors hover:border-stadio-red/50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-stadio-black dark:text-white">{b.className}</p>
                        <p className="text-xs text-stadio-gray dark:text-white/50">{fmtShortDate(b.date)} · {b.time} · {b.trainer}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          variant={b.status === "confirmed" ? "success" : b.status === "cancelled" ? "neutral" : "warning"}
                        >
                          {b.status === "confirmed" ? "Confirmada" : b.status === "cancelled" ? "Cancelada" : "Finalizada"}
                        </Badge>
                        {b.status === "confirmed" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setCancelTarget(b); }}
                            className="rounded-lg p-2 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            aria-label="Cancelar reserva"
                            title="Cancelar reserva"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <ChevronRight size={16} className="text-stadio-gray" />
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          </BookingsPeriodFilter>
        </CardBody>
      </Card>

      <Confirmation
        open={cancelTarget !== null}
        title="Cancelar reserva"
        message={`¿Quieres cancelar tu plaza en ${cancelTarget?.className} (${cancelTarget ? fmtShortDate(cancelTarget.date) : ""} · ${cancelTarget?.time})? Podrás reservarla de nuevo si quedan plazas.`}
        confirmLabel="Sí, cancelar"
        danger
        onConfirm={confirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}