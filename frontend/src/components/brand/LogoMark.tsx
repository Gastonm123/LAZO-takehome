import { cn } from "@/lib/utils/cn";
import { LOGO_MARK_LABEL } from "./logoMark";

export default function LogoMark({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-lazo-600 text-sm font-bold text-white",
        className,
      )}
      aria-hidden="true"
    >
      {LOGO_MARK_LABEL}
    </span>
  );
}
