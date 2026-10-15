interface AvatarProps {
  initials: string;
  /** Foto de perfil (data URL o URL). Si existe, se muestra la imagen. */
  src?: string;
  size?: "sm" | "md" | "lg";
  /** @deprecated El color por usuario ya no se usa; el avatar es rojo de marca. */
  color?: string;
}

const sizes = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

export function Avatar({ initials, src, size = "md" }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`${sizes[size]} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${sizes[size]}`}
      style={{ backgroundColor: "#d71920" }}
    >
      {initials}
    </div>
  );
}
