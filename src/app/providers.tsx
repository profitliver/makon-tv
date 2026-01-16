"use client";

import React, { useEffect } from "react";
import { I18nProvider } from "@/lib/i18n";
import { useAuthStore } from "@/lib/auth-store";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthInitializer>{children}</AuthInitializer>
    </I18nProvider>
  );
}
