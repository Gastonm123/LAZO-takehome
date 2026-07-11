"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import LogoMark from "@/components/brand/LogoMark";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", key: "nav.dashboard" },
  { href: "/obligations", key: "nav.obligations" },
];

export default function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <header className="border-b border-lazo-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark />
            <span className="hidden font-semibold text-lazo-800 sm:inline">
              {t("app.title")}
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  pathname === link.href
                    ? "bg-lazo-50 text-lazo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-lazo-700",
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User className="h-5 w-5" aria-hidden="true" />
          <span>{t("app.user")}</span>
        </div>
      </div>
    </header>
  );
}
