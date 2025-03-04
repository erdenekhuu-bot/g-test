"use client";
import { Layout } from "antd";
import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { menuItems } from "@/components/menu";

const { Sider, Content } = Layout;

export default function HomeLayout({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <Layout className="min-h-screen select-none">
      <Sider
        width="18%"
        className="bg-white border rounded-lg customscreen:hidden"
      >
        <p className="mt-20"></p>
        {menuItems?.map((item: any, index: number) => (
          <p
            onClick={() => setActiveIndex(index)}
            key={index}
            className={`mt-8 ml-10 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5] customr:ml-0`}
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
            <Link
              href={item.url}
              className={`${
                activeIndex === index
                  ? "text-[#01443F] font-bold"
                  : "font-medium"
              }`}
            >
              {item.label}
            </Link>
          </p>
        ))}
      </Sider>
      <Layout>
        <Content className="p-12 bg-white">{children}</Content>
      </Layout>
    </Layout>
  );
}
