import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";

const ListDocument = dynamic(
  () => import("@/app/components/pages/listDocument"),
  {
    loading: () => (
      <Flex gap="middle" justify="center">
        <Spin size="large">Уншиж байна</Spin>
      </Flex>
    ),
  }
);

export default async function ListLayout() {
  return <ListDocument />;
}
