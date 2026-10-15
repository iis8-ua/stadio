import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown } from "lucide-react";
import { Avatar } from "./Avatar";

interface ProfileMenuProps {
  initials: string;
  color?: string;
  avatar?: string;
  name: string;
  role: string;
  profileTo: string;
  onLogout: () => void;
}

export function ProfileMenu({ initials, avatar, name, role, profileTo, onLogout }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const goToProfile = () => {
    setOpen(false);
    navigate(profileTo);
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full p-0.5 transition-colors hover:bg-stadio-gray-light dark:hover:bg-white/10"
        aria-label="Menú de perfil"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Avatar initials={initials} src={avatar} size="sm" />
        <ChevronDown size={14} className="hidden text-stadio-gray sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-white/10 dark:bg-stadio-black">
          <div className="border-b border-gray-100 px-4 py-3 dark:border-white/10">
            <p className="truncate text-sm font-bold text-stadio-black dark:text-white">{name}</p>
            <p className="truncate text-xs capitalize text-stadio-gray dark:text-white/40">{role}</p>
          </div>

          <button
            type="button"
            onClick={goToProfile}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-stadio-gray-dark transition-colors hover:bg-stadio-gray-light dark:text-white/70 dark:hover:bg-white/10"
          >
            <User size={16} /> Ir al perfil
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-stadio-red transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
