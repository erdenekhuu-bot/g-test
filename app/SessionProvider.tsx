"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function SessionLayout({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
