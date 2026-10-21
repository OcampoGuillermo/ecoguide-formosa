"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ServiceWorkerRegistration />
      {children}
      <Toaster
        position="bottom-center"
        offset={16}
        toastOptions={{
          classNames: {
            toast:
              "!rounded-[2px] !border !border-[var(--color-ink)] !bg-[var(--color-chalk)] !text-[var(--color-ink)] !shadow-none !font-sans",
            description: "!text-[var(--field-soft)]",
            actionButton:
              "!bg-[var(--color-rust)] !text-[var(--color-chalk)] !rounded-[2px]",
            cancelButton: "!bg-transparent !text-[var(--field)] !rounded-[2px]",
          },
        }}
      />
    </SessionProvider>
  );
}
