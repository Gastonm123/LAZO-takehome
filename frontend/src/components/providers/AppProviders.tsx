"use client";

import { useEffect } from "react";
import "@/i18n/config";
import i18n from "@/i18n/config";
import { ToastContainer } from "react-toastify";
import StoreProvider from "@/store/StoreProvider";
import MainLayout from "@/components/layout/MainLayout";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved === "es" || saved === "en") {
      void i18n.changeLanguage(saved);
    }
  }, []);

  return (
    <StoreProvider>
      <MainLayout>{children}</MainLayout>
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </StoreProvider>
  );
}
