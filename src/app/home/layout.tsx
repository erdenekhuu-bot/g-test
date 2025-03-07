"use client";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

export default function HomeLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: "/home/create", label: "Create" },
    { key: "/home/list", label: "List" },
    { key: "/home/view", label: "View" },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <Layout className="h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>{children}</Layout>
    </Layout>
  );
}
