"use client";
import { Layout, Menu, theme, Button } from "antd";
import { ReactNode, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PaperClipOutlined,
  SelectOutlined,
  LoginOutlined,
  SettingOutlined,
  MailOutlined,
  FullscreenExitOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const { Header, Content, Footer, Sider } = Layout;

export default function HomeLayout({ children }: { children?: ReactNode }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const manager = session?.user.name;
  const menu: any = [
    {
      key: "1",
      icon: <PaperClipOutlined />,
      label: "Баталгаажуулах хуудас",
      onClick: () => router.push("/paper"),
    },
    {
      key: "2",
      icon: <SelectOutlined />,
      label: "Удирдамж",
      children: [
        {
          key: "20",
          icon: <SelectOutlined />,
          label: "Удирдамж үүсгэх",
          onClick: () => router.push("/plan"),
        },
      ],
    },
    {
      key: "3",
      icon: <MailOutlined />,
      label: "Тайлан",
      children: [
        {
          key: "30",
          icon: <MailOutlined />,
          label: "Тайлан үүсгэх",
          onClick: () => router.push("/testcase"),
        },
        {
          key: "31",
          icon: <MailOutlined />,
          label: "Хуваалцсан тайлан",
          onClick: () => router.push("/sharereport"),
        },
      ],
    },
    manager === "uuganbayar.ts" && {
      key: "4",
      icon: <FullscreenExitOutlined />,
      label: "Хэлтсийн дарга",
      children: [
        {
          key: "5",
          icon: <MailOutlined />,
          label: "Ирсэн төлөвлөгөө",
          onClick: () => router.push("/teamplan"),
        },
        {
          key: "6",
          icon: <CopyOutlined />,
          label: "Ирсэн тайлан",
          onClick: () => router.push("/teamreport"),
        },
      ],
    },
    {
      key: "9",
      icon: <SettingOutlined />,
      label: "Тохиргоо",
      onClick: () => router.push("/admin"),
    },
    {
      key: "10",
      icon: <LoginOutlined />,
      label: "Системээс гарах",
      onClick: () => signOut({ callbackUrl: "/login" }),
    },
  ];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={300}
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="md:block hidden"
      >
        <div className="demo-logo-vertical" />
        <Menu
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={menu}
        />
      </Sider>
      <Layout>
        <Header
          className="px-1"
          style={{
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div className="sm:block hidden">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} made by Gmobile
        </Footer>
      </Layout>
    </Layout>
  );
}
