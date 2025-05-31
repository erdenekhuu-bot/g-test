"use client";
import { Layout } from "antd";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Menu } from "./menu";
import NavContent from "@/components/window/usable/menu/page";

const { Sider, Content, Header } = Layout;

export default function HomeLayout({ children }: { children?: ReactNode }) {
  return (
    <SessionProvider>
      <Layout className="h-screen bg-white">
        <Sider width="18%" theme="light">
          <Menu />
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: "white" }}>
            <NavContent />
          </Header>
          <Content className="p-10">{children}</Content>
        </Layout>
      </Layout>
    </SessionProvider>
  );
}
