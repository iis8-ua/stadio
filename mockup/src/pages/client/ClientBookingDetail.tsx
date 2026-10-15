import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, User, MapPin, Users, CalendarDays, CheckCircle2, XCircle, CalendarCheck } from "lucide-react";
import { Card, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { BackButton } from "../../components/BackButton";
import { ErrorState } from "../../components/EmptyState";
import { Confirmation } from "../../components/Confirmation";
import { classTypes, classSessions, resolveGymClasses, fmtShortDate } from "../../data/classes";
import { getBookings, cancelBooking } from "../../features/bookings/clientBookings";
import { useToast } from "../../hooks/useToast";

export function ClientBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();

  const booking = getBookings().find((b) => b.id === id);
  const [status, setStatus] = useState(booking?.status);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!booking) return <ErrorState title="Reserva no encontrada" />;

  const gymClass = resolveGymClasses(classTypes, classSessions).find((c) => c.id === booking.classId);
  const cancelled = status === "cancelled";

  const handleCancel = () => {
    cancelBooking(booking.id);
    setStatus("cancelled");
    setConfirmCancel(false);
    notify("Reserva cancelada", "info");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <BackButton />

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-stadio-red to-red-800 p-5">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="neutral">{fmtShortDate(booking.date)} · {booking.time}</Badge>
            <Badge variant={cancelled ? "neutral" : status === "past" ? "warning" : "success"}>
              {cancelled ? "Cancelada" : status === "past" ? "Finalizada" : "Confirmada"}
            </Badge>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-white">{booking.className}</h1>
          <p className="mt-1 text-sm text-white/70">Tu reserva{booking.trainer ? ` con ${booking.trainer}` : ""}</p>
        </div>

        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={CalendarDays} label="Fecha" value={gymClass ? fmtShortDate(gymClass.date) : fmtShortDate(booking.date)} />
            <InfoRow icon={Clock} label="Hora" value={booking.time} />
            <InfoRow icon={User} label="Monitor/instructor" value={booking.trainer} />
            {gymClass && <InfoRow icon={MapPin} label="Sala" value={gymClass.room} />}
            {gymClass && <InfoRow icon={Users} label="Plazas" value={`${gymClass.booked}/${gymClass.capacity}`} />}
            {gymClass && <InfoRow icon={Clock} label="Duración" value={gymClass.duration} />}
          </div>

          {gymClass && (
            <div>
              <h3 className="text-sm font-bold text-stadio-black dark:text-white">Descripción</h3>
              <p className="mt-1 text-sm text-stadio-gray-dark dark:text-white/60">{gymClass.description}</p>
            </div>
          )}

          {cancelled ? (
            <div className="rounded-xl border border-gray-100 dark:border-white/10 bg-stadio-gray-light/60 dark:bg-white/5 p-4">
              <div className="flex items-center gap-2 font-bold text-stadio-gray-dark dark:text-white/70">
                <XCircle size={20} /> Reserva cancelada
              </div>
              <p className="mt-1 text-xs text-stadio-gray-dark dark:text-white/60">
                Esta reserva ya no está activa. Puedes volver a reservar tu plaza si quedan disponibles.
              </p>
              {gymClass && (
                <Button size="sm" className="mt-3" onClick={() => navigate(`/client/bookings/${gymClass.id}`)}>
                  <CalendarCheck size={15} /> RESERVAR DE NUEVO
                </Button>
              )}
            </div>
          ) : status === "past" ? (
            <div className="rounded-xl border border-green-100 dark:border-green-900/40 bg-green-50/60 dark:bg-green-950/20 p-4">
              <div className="flex items-center gap-2 font-bold text-stadio-green">
                <CheckCircle2 size={20} /> Clase asistida
              </div>
              <p className="mt-1 text-xs text-stadio-gray-dark dark:text-white/60">
                Asististe a esta clase el {gymClass ? fmtShortDate(gymClass.date) : fmtShortDate(booking.date)}.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-green-100 dark:border-green-900/40 bg-green-50/60 dark:bg-green-950/20 p-4">
              <div className="flex items-center gap-2 font-bold text-stadio-green">
                <CheckCircle2 size={20} /> Reserva confirmada
              </div>
              <p className="mt-1 text-xs text-stadio-gray-dark dark:text-white/60">
                Tienes tu plaza reservada para el {booking.date} a las {booking.time}
                {booking.trainer ? ` con ${booking.trainer}` : ""}.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {gymClass && (
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/client/bookings/${gymClass.id}`)}>
                    VER CLASE
                  </Button>
                )}
                <Button variant="danger" size="sm" onClick={() => setConfirmCancel(true)}>
                  <XCircle size={15} /> CANCELAR RESERVA
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <Confirmation
        open={confirmCancel}
        title="Cancelar reserva"
        message={`¿Seguro que quieres cancelar tu plaza en ${booking.className} (${booking.date} · ${booking.time})?`}
        confirmLabel="Sí, cancelar"
        cancelLabel="No"
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(false)}
        danger
      />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-stadio-gray-light p-3 dark:bg-white/5">
      <Icon size={18} className="text-stadio-red" />
      <div className="min-w-0">
        <p className="text-xs text-stadio-gray">{label}</p>
        <p className="truncate text-sm font-bold text-stadio-black dark:text-white">{value}</p>
      </div>
    </div>
  );
}
