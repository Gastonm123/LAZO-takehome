"use client";

import "@/i18n/config";
import { ToastContainer } from "react-toastify";
import StoreProvider from "@/store/StoreProvider";
import MainLayout from "@/components/layout/MainLayout";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <MainLayout>{children}</MainLayout>
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </StoreProvider>
  );
}
