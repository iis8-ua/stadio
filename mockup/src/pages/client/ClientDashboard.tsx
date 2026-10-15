import { Link } from "react-router-dom";
import { Play, Users, ChevronRight, Flame, CalendarDays, Clock, User } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { classTypes, classSessions, resolveGymClasses, dateToKey, fmtShortDate } from "../../data/classes";
import { aforoCurrent } from "../../data/aforo";
import { getGymSettings, getTodayHours } from "../../features/settings/gymSettings";

export function ClientDashboard() {
  const gymClasses = resolveGymClasses(classTypes, classSessions);
  const todayKey = dateToKey(new Date());
  const nextClass =
    [...gymClasses]
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .find((c) => c.date >= todayKey) ?? gymClasses[0];

  const capacity = getGymSettings().capacity;
  const peopleInside = aforoCurrent.people;
  const occupancyPct = Math.round((peopleInside / capacity) * 100);
  const closedToday = getTodayHours().closed;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">
          Hola, Israel 👋
        </h1>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">¿Listo para entrenar?</p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-stadio-red to-red-800 p-6 sm:p-10 relative">
          <div className="flex items-center gap-2 text-white/90">
            <Flame size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Rutina enfocada a hipertrofia</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">Pecho + Tríceps</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> 5 ejercicios
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> 50 min aprox.
            </span>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/client/training/workout" className="sm:w-auto">
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-stadio-red shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white hover:text-stadio-red hover:shadow-lg active:scale-[0.98] sm:w-auto">
                <Play size={18} />
                EMPEZAR ENTRENAMIENTO
              </button>
            </Link>
            <Link
              to="/client/training"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/70 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
            >
              VER ENTRENAMIENTOS
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader title="PRÓXIMA CLASE" action={<CalendarDays size={18} className="text-stadio-gray" />} />
          <CardBody>
            <h3 className="text-lg font-bold text-stadio-black dark:text-white">{nextClass.name}</h3>
            <div className="mt-2 space-y-1.5 text-sm text-stadio-gray-dark dark:text-white/60">
              <p className="flex items-center gap-1.5">
                <CalendarDays size={15} className="text-stadio-red" /> {fmtShortDate(nextClass.date)}
              </p>
              <p className="flex items-center gap-1.5">
                <Clock size={15} className="text-stadio-red" /> {nextClass.time} · {nextClass.duration}
              </p>
              <p className="flex items-center gap-1.5">
                <User size={15} className="text-stadio-red" /> {nextClass.trainer}
              </p>
              <p className="flex items-center gap-1.5">
                <Users size={15} className="text-stadio-red" /> {nextClass.booked}/{nextClass.capacity} plazas
              </p>
            </div>
            <Link to={`/client/bookings/${nextClass.id}`}>
              <Button variant="secondary" size="md" className="mt-4 w-full">
                VER CLASE <ChevronRight size={16} />
              </Button>
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="ESTADO DEL GIMNASIO" action={<Users size={18} className="text-stadio-gray" />} />
          <CardBody>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${closedToday ? "bg-stadio-red" : "bg-stadio-green animate-pulse"}`} />
              <span className={`text-sm font-bold ${closedToday ? "text-stadio-red" : "text-stadio-green"}`}>
                {closedToday ? "Cerrado" : "Abierto"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-lg font-extrabold text-stadio-black dark:text-white">{peopleInside}</p>
                <p className="text-xs text-stadio-gray">personas</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-lg font-extrabold text-stadio-black dark:text-white">{occupancyPct}%</p>
                <p className="text-xs text-stadio-gray">ocupación</p>
              </div>
            </div>
            <Link to="/client/access">
              <Button variant="secondary" size="md" className="mt-4 w-full">
                VER AFORO <ChevronRight size={16} />
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
