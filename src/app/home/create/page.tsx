import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";

const CreateDocument = dynamic(
  () => import("@/app/components/pages/createDocument"),
  {
    loading: () => (
      <Flex gap="middle" justify="center" align="center" className="h-screen">
        <Spin size="large">Уншиж байна</Spin>
      </Flex>
    ),
  }
);

export default async function CreateLayout() {
  return <CreateDocument />;
}
