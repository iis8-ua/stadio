import logo from "../assets/logo.png";

interface LogoProps {
  withText?: boolean;
  size?: number;
}

export function Logo({ withText = true, size = 32 }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <img src={logo} alt="STADIO logo" width={size} height={size} className="object-contain" />
      {withText && (
        <span className="text-xl font-black tracking-tight text-stadio-black dark:text-white">
          STADIO
        </span>
      )}
    </div>
  );
}
