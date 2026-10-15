import { useRef } from "react";
import type { ChangeEvent } from "react";
import { Camera, X } from "lucide-react";
import { Avatar } from "./Avatar";

interface AvatarUploadProps {
  initials: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  onSelect: (dataUrl: string) => void;
  onRemove?: () => void;
  onError?: (message: string) => void;
}

const MAX_BYTES = 2 * 1024 * 1024;

/**
 * Avatar pulsable que permite subir una foto de perfil y, si ya hay una,
 * quitarla. Al hacer clic en el círculo se abre el selector de archivos y la
 * imagen se guarda como data URL.
 */
export function AvatarUpload({ initials, src, size = "lg", onSelect, onRemove, onError }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onError?.("El archivo debe ser una imagen");
      return;
    }
    if (file.size > MAX_BYTES) {
      onError?.("La imagen no puede superar 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onSelect(String(reader.result));
    reader.onerror = () => onError?.("No se pudo leer la imagen");
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative block rounded-full"
        aria-label={src ? "Cambiar foto de perfil" : "Subir foto de perfil"}
        title={src ? "Cambiar foto de perfil" : "Subir foto de perfil"}
      >
        <Avatar initials={initials} src={src} size={size} />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Camera size={size === "lg" ? 22 : 15} />
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-stadio-red text-white ring-2 ring-white dark:ring-stadio-black">
          <Camera size={11} />
        </span>
      </button>

      {src && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-stadio-black text-white ring-2 ring-white transition-colors hover:bg-stadio-red dark:ring-stadio-black"
          aria-label="Quitar foto de perfil"
          title="Quitar foto"
        >
          <X size={12} />
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
