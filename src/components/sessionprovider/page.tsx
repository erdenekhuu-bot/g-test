"use client";
import { Layout } from "antd";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function SessionWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <Layout className="h-screen bg-white">
        <Layout.Sider width="20%" theme="light">
          <div>Menu</div>
        </Layout.Sider>
        <Layout>
          <Layout.Content className="p-10">{children}</Layout.Content>
        </Layout>
      </Layout>
    </SessionProvider>
  );
}
