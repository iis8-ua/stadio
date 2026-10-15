import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
}

export function BackButton({ label = "Volver" }: BackButtonProps) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-stadio-gray-dark transition-colors hover:text-stadio-red dark:text-white/60 dark:hover:text-stadio-red"
    >
      <ArrowLeft size={16} /> {label}
    </button>
  );
}
