"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Toaster } from "sonner";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ServiceWorkerRegistration />
      {children}
      <Toaster
        position="bottom-center"
        offset={16}
        toastOptions={{
          classNames: {
            toast:
              "!rounded-[2px] !border !border-[var(--color-ink)] !bg-[var(--color-chalk)] !text-[var(--field)] !shadow-none !font-sans",
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
