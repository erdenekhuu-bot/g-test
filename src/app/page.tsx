"use client";
import { Layout } from "antd";
import { ReactNode } from "react";

export default function Home({ children }: { children: ReactNode }) {
  const { Content } = Layout;

  return (
    <Layout className="h-screen">
      <Content>{children}</Content>
    </Layout>
  );
}
