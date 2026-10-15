import { useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, User, MapPin, Users, CheckCircle2, CalendarCheck } from "lucide-react";
import { Card, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { BackButton } from "../../components/BackButton";
import { ErrorState } from "../../components/EmptyState";
import { Confirmation } from "../../components/Confirmation";
import { classTypes, classSessions, resolveGymClasses, fmtShortDate, fmtMonthYear } from "../../data/classes";
import { getBookings, isClassBooked, addBooking, cancelBooking } from "../../features/bookings/clientBookings";
import { isEmailVerified } from "../../features/profile/clientProfile";
import { useToast } from "../../hooks/useToast";

export function ClientClassDetail() {
  const { id } = useParams();
  const { notify } = useToast();
  const c = resolveGymClasses(classTypes, classSessions).find((g) => g.id === id);

  const [booked, setBooked] = useState(() => (c ? isClassBooked(c.id, c.day) : false));
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!c) return <ErrorState title="Clase no encontrada" />;

  const isFull = c.booked >= c.capacity;

  const handleBook = () => {
    if (!isEmailVerified()) {
      notify("Verifica tu correo electrónico para poder reservar (RF-97)", "warning");
      return;
    }
    addBooking({
      id: `b-${Date.now()}`,
      classId: c.id,
      className: c.name,
      day: c.day,
      date: c.date,
      time: c.time,
      trainer: c.trainer,
      month: fmtMonthYear(c.date),
      status: "confirmed",
    });
    setBooked(true);
    notify("Reserva confirmada");
  };

  const handleCancel = () => {
    const booking = getBookings().find(
      (b) => b.classId === c.id && b.day === c.day && b.status === "confirmed"
    );
    if (booking) cancelBooking(booking.id);
    setBooked(false);
    setConfirmCancel(false);
    notify("Reserva cancelada", "info");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <BackButton />

      <Card>
        <div className="bg-gradient-to-br from-stadio-red to-red-800 p-5">
          <Badge variant="neutral">{fmtShortDate(c.date)} · {c.time}</Badge>
          <h1 className="mt-3 text-2xl font-extrabold text-white">{c.name}</h1>
          <p className="mt-1 text-sm text-white/70">{c.duration}</p>
        </div>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
              <Clock size={18} className="text-stadio-red" />
              <div>
                <p className="text-xs text-stadio-gray">Hora</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{c.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
              <User size={18} className="text-stadio-red" />
              <div>
                <p className="text-xs text-stadio-gray">Monitor/instructor</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{c.trainer}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
              <MapPin size={18} className="text-stadio-red" />
              <div>
                <p className="text-xs text-stadio-gray">Sala</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{c.room}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
              <Users size={18} className="text-stadio-red" />
              <div>
                <p className="text-xs text-stadio-gray">Plazas</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{c.booked}/{c.capacity}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-stadio-black dark:text-white">Descripción</h3>
            <p className="mt-1 text-sm text-stadio-gray-dark dark:text-white/60">{c.description}</p>
          </div>

          {booked ? (
            <div className="rounded-xl border border-green-100 dark:border-green-900/40 bg-green-50/60 dark:bg-green-950/20 p-4">
              <div className="flex items-center gap-2 font-bold text-stadio-green">
                <CheckCircle2 size={20} />
                Reserva confirmada
              </div>
              <p className="mt-1 text-xs text-stadio-gray-dark dark:text-white/60">
                Tienes tu plaza reservada para el {fmtShortDate(c.date)} a las {c.time} con {c.trainer}.
              </p>
              <Button variant="danger" className="mt-3" size="sm" onClick={() => setConfirmCancel(true)}>
                CANCELAR RESERVA
              </Button>
            </div>
          ) : isFull ? (
            <div className="rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20 p-4 text-center">
              <p className="font-bold text-stadio-red">Clase completa</p>
              <p className="mt-1 text-xs text-stadio-gray-dark dark:text-white/60">
                No quedan plazas disponibles en esta sesión.
              </p>
            </div>
          ) : (
            <Button size="lg" className="w-full" onClick={handleBook}>
              <CalendarCheck size={18} />
              RESERVAR
            </Button>
          )}
        </CardBody>
      </Card>

      <Confirmation
        open={confirmCancel}
        title="Cancelar reserva"
        message={`¿Seguro que quieres cancelar tu plaza en ${c.name}?`}
        confirmLabel="Sí, cancelar"
        cancelLabel="No"
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(false)}
        danger
      />
    </div>
  );
}