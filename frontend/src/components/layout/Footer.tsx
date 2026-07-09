"use client";

import { useTranslation } from "react-i18next";
import i18n from "@/i18n/config";

export default function Footer() {
  const { t } = useTranslation();

  const setLocale = (locale: "es" | "en") => {
    void i18n.changeLanguage(locale);
    localStorage.setItem("locale", locale);
  };

  return (
    <footer className="mt-auto border-t border-lazo-100 bg-white py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-slate-500">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </p>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>{t("footer.language")}:</span>
          <button
            type="button"
            className="rounded px-2 py-1 hover:bg-lazo-50"
            onClick={() => setLocale("es")}
          >
            ES
          </button>
          <button
            type="button"
            className="rounded px-2 py-1 hover:bg-lazo-50"
            onClick={() => setLocale("en")}
          >
            EN
          </button>
        </div>
      </div>
    </footer>
  );
}
