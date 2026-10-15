import type { ReactNode } from "react";
import { Card, CardBody } from "./Card";
import { Avatar } from "./Avatar";
import { AvatarUpload } from "./AvatarUpload";

interface ProfileStat {
  value: string;
  label: string;
}

interface ProfileViewProps {
  initials: string;
  color?: string;
  avatar?: string;
  onAvatarSelect?: (dataUrl: string) => void;
  onAvatarRemove?: () => void;
  onAvatarError?: (message: string) => void;
  name: string;
  email?: string;
  badges?: ReactNode;
  meta?: ReactNode;
  stats?: ProfileStat[];
  action?: ReactNode;
  children?: ReactNode;
}

/**
 * Estructura común de perfil para cualquier tipo de usuario
 * (cabecera con avatar + datos, estadísticas y secciones libres).
 */
export function ProfileView({
  initials,
  avatar,
  onAvatarSelect,
  onAvatarRemove,
  onAvatarError,
  name,
  email,
  badges,
  meta,
  stats,
  action,
  children,
}: ProfileViewProps) {
  return (
    <div className="space-y-5">
      <Card>
        <CardBody className="flex flex-col items-center py-6 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
          {onAvatarSelect ? (
            <AvatarUpload
              initials={initials}
              src={avatar}
              size="lg"
              onSelect={onAvatarSelect}
              onRemove={onAvatarRemove}
              onError={onAvatarError}
            />
          ) : (
            <Avatar initials={initials} src={avatar} size="lg" />
          )}
          <div className="mt-4 min-w-0 sm:mt-0 sm:flex-1">
            <h1 className="text-xl font-extrabold text-stadio-black dark:text-white">{name}</h1>
            {email && <p className="text-sm text-stadio-gray dark:text-white/50">{email}</p>}
            {meta && <div className="mt-2 text-xs text-stadio-gray dark:text-white/50">{meta}</div>}
            {badges && <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">{badges}</div>}
          </div>
          {action && <div className="mt-4 sm:mt-0">{action}</div>}
        </CardBody>
      </Card>

      {stats && stats.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-extrabold text-stadio-black dark:text-white">{s.value}</p>
                <p className="text-xs text-stadio-gray">{s.label}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
