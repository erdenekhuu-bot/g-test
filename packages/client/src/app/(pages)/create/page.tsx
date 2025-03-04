import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";
import { GetStaticProps } from "next";

const CreateDocument = dynamic(
  () => import("@/components/pages/layouts/createDocument"),
  {
    loading: () => (
      <Flex gap="middle" justify="center">
        <Spin size="large">Уншиж байна</Spin>
      </Flex>
    ),
  }
);

export default async function CreateLayout() {
  return <CreateDocument />;
}
