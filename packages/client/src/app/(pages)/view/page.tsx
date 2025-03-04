import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";

const ViewDocument = dynamic(
  () => import("@/components/pages/layouts/viewDocument"),
  {
    loading: () => (
      <Flex gap="middle" justify="center">
        <Spin size="large">Уншиж байна</Spin>
      </Flex>
    ),
  }
);

export default async function ViewLayout() {
  return <ViewDocument />;
}
