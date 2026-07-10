"use client";

import { useTranslation } from "react-i18next";
import LoadingSpinner from "./LoadingSpinner";

export default function TranslatedLoadingSpinner() {
  const { t } = useTranslation();
  return <LoadingSpinner label={t("common.loading")} />;
}
