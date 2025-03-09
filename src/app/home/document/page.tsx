import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";

const MakeDocument = dynamic(() => import("@/components/pages/makeDocument"), {
  loading: () => (
    <Flex gap="middle" justify="center" align="center" className="h-screen">
      <Spin size="large">Уншиж байна</Spin>
    </Flex>
  ),
});

export default async function CreateLayout() {
  return <MakeDocument />;
}
