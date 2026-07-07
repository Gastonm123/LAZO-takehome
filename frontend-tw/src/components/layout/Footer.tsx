"use client";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto border-t border-lazo-100 bg-white py-6">
      <p className="text-center text-sm text-slate-500">
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
