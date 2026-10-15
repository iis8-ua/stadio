import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, User, XCircle, ChevronRight } from "lucide-react";
import { getBookings, cancelBooking } from "../features/bookings/clientBookings";
import type { Booking } from "../types";
import { Badge } from "./Badge";
import { Confirmation } from "./Confirmation";
import { useToast } from "../hooks/useToast";
import { BookingsPeriodFilter } from "./BookingsPeriodFilter";
import { fmtShortDate } from "../data/classes";

export function BookingHistory() {
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
      <BookingsPeriodFilter bookings={bookings}>
        {(filtered) => {
          const assisted = filtered.filter((b) => b.status === "past").length;
          return (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 shadow-sm">
                  <p className="text-3xl font-extrabold text-stadio-black dark:text-white">{filtered.length}</p>
                  <p className="text-xs text-stadio-gray mt-1">reservas en este periodo</p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 shadow-sm">
                  <p className="text-3xl font-extrabold text-stadio-black dark:text-white">{assisted}</p>
                  <p className="text-xs text-stadio-gray mt-1">clases finalizadas</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm p-5">
                <h3 className="text-sm font-bold text-stadio-black dark:text-white mb-4">Historial</h3>
                {filtered.length === 0 ? (
                  <p className="text-sm text-stadio-gray dark:text-white/50">
                    {bookings.length === 0 ? "No tienes reservas." : "No hay reservas en este periodo."}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => navigate(`/client/bookings/detail/${b.id}`)}
                        className="cursor-pointer rounded-xl border border-gray-100 dark:border-white/10 p-4 transition-colors hover:border-stadio-red/50"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-stadio-black dark:text-white">{b.className}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                b.status === "confirmed" ? "success" : b.status === "cancelled" ? "neutral" : "warning"
                              }
                            >
                              {b.status === "confirmed" ? "Confirmada" : b.status === "cancelled" ? "Cancelada" : "Finalizada"}
                            </Badge>
                            <ChevronRight size={16} className="text-stadio-gray" />
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-gray-dark dark:text-white/60">
                            <CalendarDays size={15} className="text-stadio-red" /> {fmtShortDate(b.date)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-gray-dark dark:text-white/60">
                            <Clock size={15} className="text-stadio-red" /> {b.time}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-gray-dark dark:text-white/60">
                            <User size={15} className="text-stadio-red" /> {b.trainer}
                          </span>
                          {b.status === "confirmed" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setCancelTarget(b); }}
                              className="ml-auto rounded-lg p-2 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              aria-label="Cancelar reserva"
                              title="Cancelar reserva"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </BookingsPeriodFilter>

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