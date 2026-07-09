import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-lazo-100 bg-white p-5 shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}
