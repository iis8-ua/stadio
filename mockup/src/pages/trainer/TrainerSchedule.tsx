import { ScheduleWeekCalendar } from "../../components/ScheduleWeekCalendar";

export function TrainerSchedule() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Horarios</h1>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Tu planificación semanal</p>
      </div>

      <ScheduleWeekCalendar />
    </div>
  );
}
