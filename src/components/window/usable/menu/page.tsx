"use client";
import { Layout, Flex, Badge, Avatar, Popover } from "antd";
import { DatabaseTwoTone } from "@ant-design/icons";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { subLetter } from "@/components/usable";
import { redirect } from "next/navigation";

const { Content } = Layout;

export default function NavContent() {
  const [sharecount, setSharecount] = useState(0);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const fetch = async function () {
    setLoading(true);
    const response = await axios.post("/api/sharenotification", {
      authId: session?.user.id,
    });
    if (response.data.success) {
      setSharecount(response.data.data.length);
    }
  };

  useEffect(() => {
    session?.user.id && fetch();
  }, [session?.user.id]);

  const content = (
    <div>
      <p>Хуваалцсан төлөвлөгөө: {loading && sharecount}</p>
    </div>
  );

  return (
    <Layout>
      <Content style={{ backgroundColor: "white" }}>
        <Flex justify="end" style={{ padding: "13px 0" }} gap={10}>
          <Popover content={content}>
            <Badge
              count={loading && sharecount}
              className="hover:cursor-pointer"
              onClick={() => {
                redirect("/home/shared");
              }}
            >
              <Avatar
                shape="square"
                size="large"
                icon={<DatabaseTwoTone className="text-3xl" />}
              />
            </Badge>
          </Popover>

          <Avatar
            shape="square"
            size="large"
            style={{ backgroundColor: "#00569E" }}
          >
            <span className="text-2xl">
              {subLetter(String(session?.user.username))}
            </span>
          </Avatar>
        </Flex>
      </Content>
    </Layout>
  );
}
