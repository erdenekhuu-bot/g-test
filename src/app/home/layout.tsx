"use client";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { menuItems } from "../../components/menu";
import Image from "next/image";

const { Sider, Content } = Layout;

export default function HomeLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const handleMenuClick = (url: any) => {
    router.push(url);
  };
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <Layout className="h-screen bg-white">
      <Sider width="18%" theme="light">
        <p className="mt-20"></p>
        {menuItems?.map((item: any, index: number) => (
          <p
            onClick={() => {
              handleMenuClick(item.url);
            }}
            key={index}
            className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
          >
            <Image
              src={item.icon}
              alt=""
              width={25}
              height={25}
              className={`mr-2 transition-opacity ${
                activeIndex === index ? "opacity-100" : "opacity-40"
              }`}
            />
            <span
              className={`${
                activeIndex === index
                  ? "text-[#01443F] font-bold"
                  : "font-medium"
              }`}
            >
              {item.label}
            </span>
          </p>
        ))}
      </Sider>
      <Layout>
        <Content className="p-10">{children}</Content>
      </Layout>
    </Layout>
  );
}
