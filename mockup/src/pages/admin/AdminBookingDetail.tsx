import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Clock, DoorOpen, User, Check, Ban, Eye } from "lucide-react";
import { Badge } from "../../components/Badge";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { BackButton } from "../../components/BackButton";
import { ErrorState } from "../../components/EmptyState";
import { Confirmation } from "../../components/Confirmation";
import { ClassDetailModal } from "../../components/ClassDetailModal";
import { useAdminBookings, updateBookingStatus } from "../../data/adminBookings";
import { resolveGymClasses, classTypes, classSessions, fmtShortDate } from "../../data/classes";
import { clients } from "../../data/users";
import { findEmployeeByName } from "../../data/employees";
import { useToast } from "../../hooks/useToast";
import type { GymClass } from "../../types";

export function AdminBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const bookings = useAdminBookings();
  const booking = bookings.find((b) => b.id === id);

  const gymClasses = useMemo(() => resolveGymClasses(classTypes, classSessions), []);
  const [detailClass, setDetailClass] = useState<GymClass | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!booking) return <ErrorState title="Reserva no encontrada" />;

  const client = clients.find((c) => c.id === booking.clientId);
  const gymClass = gymClasses.find((c) => c.id === booking.classId);
  const trainer = findEmployeeByName(booking.trainer);
  const canCancel = booking.status === "Confirmada" || booking.status === "Pendiente";

  const statusVariant = (s: typeof booking.status) =>
    s === "Confirmada" ? "success" : s === "Pendiente" ? "warning" : s === "Finalizada" ? "info" : "error";

  const confirmBooking = () => {
    updateBookingStatus(booking.id, "Confirmada");
    notify(`Reserva de ${booking.clientName} confirmada`);
  };

  const cancelBooking = () => {
    updateBookingStatus(booking.id, "Cancelada");
    notify(`Reserva de ${booking.clientName} cancelada`, "info");
    setConfirmCancel(false);
  };

  return (
    <div className="space-y-5">
      <BackButton />

      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar initials={client?.initials ?? "?"} color={client?.color} size="lg" />
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-stadio-black dark:text-white">
              Reserva · {booking.className}
            </h1>
            <p className="text-sm text-stadio-gray dark:text-white/50">
              {booking.clientName}{client ? ` · ${client.email}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant={statusVariant(booking.status)} dot>{booking.status}</Badge>
              <Badge variant="neutral">{fmtShortDate(booking.date)} · {booking.time}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {booking.status === "Pendiente" && (
              <Button variant="secondary" size="sm" onClick={confirmBooking}>
                <Check size={16} /> CONFIRMAR
              </Button>
            )}
            {canCancel && (
              <Button variant="danger" size="sm" onClick={() => setConfirmCancel(true)}>
                <Ban size={16} /> CANCELAR
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="DATOS DE LA RESERVA" />
          <CardBody className="grid grid-cols-2 gap-2">
            <DetailRow icon={CalendarDays} label="Fecha" value={fmtShortDate(booking.date)} />
            <DetailRow icon={Clock} label="Hora" value={booking.time} />
            <DetailRow icon={DoorOpen} label="Sala" value={booking.room} />
            <DetailRow
              icon={User}
              label="Monitor/instructor"
              value={booking.trainer}
              onClick={trainer ? () => navigate(`/admin/employees/${trainer.id}`) : undefined}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="CLASE" />
          <CardBody className="space-y-3">
            <p className="text-sm font-bold text-stadio-black dark:text-white">{booking.className}</p>
            {gymClass && (
              <p className="text-xs text-stadio-gray dark:text-white/50">
                {gymClass.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {gymClass && (
                <Button variant="secondary" size="sm" onClick={() => setDetailClass(gymClass)}>
                  <Eye size={15} /> VER CLASE
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/clients/${booking.clientId}`)}>
                <Eye size={15} /> VER CLIENTE
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <ClassDetailModal gymClass={detailClass} onClose={() => setDetailClass(null)} />

      <Confirmation
        open={confirmCancel}
        title="Cancelar reserva"
        message={`¿Cancelar la reserva de ${booking.clientName} en ${booking.className}?`}
        confirmLabel="Sí, cancelar"
        onConfirm={cancelBooking}
        onCancel={() => setConfirmCancel(false)}
        danger
      />
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: typeof User;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stadio-red/10 text-stadio-red">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stadio-gray">{label}</p>
        <p className="truncate text-sm font-bold text-stadio-black dark:text-white">{value}</p>
      </div>
    </>
  );
  const className = "flex items-center gap-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5";
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${className} text-left transition-colors hover:border-stadio-red/50`}>
        {content}
      </button>
    );
  }
  return <div className={className}>{content}</div>;
}
