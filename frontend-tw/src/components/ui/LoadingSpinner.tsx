"use client";

interface LoadingSpinnerProps {
  label?: string;
}

export default function LoadingSpinner({ label }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-16">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-lazo-200 border-t-lazo-600"
        role="status"
        aria-label={label ?? "Loading"}
      />
      {label ? <span className="text-sm text-slate-600">{label}</span> : null}
    </div>
  );
}
