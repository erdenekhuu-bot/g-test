"use client";
import { Layout } from "antd";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Menu } from "./menu";

const { Sider, Content } = Layout;

export default function HomeLayout({ children }: { children?: ReactNode }) {
  return (
    <SessionProvider>
      <Layout className="h-screen bg-white">
        <Sider width="18%" theme="light">
          <Menu />
        </Sider>
        <Layout>
          <Content className="p-10">{children}</Content>
        </Layout>
      </Layout>
    </SessionProvider>
  );
}
