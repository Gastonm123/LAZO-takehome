import { cn } from "@/lib/utils/cn";

const variants = {
  primary:
    "bg-lazo-600 text-white hover:bg-lazo-700 focus-visible:ring-lazo-500",
  secondary:
    "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
  danger:
    "bg-white text-red-700 ring-1 ring-red-200 hover:bg-red-50 focus-visible:ring-red-400",
  ghost: "text-lazo-700 hover:bg-lazo-50",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export default function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
