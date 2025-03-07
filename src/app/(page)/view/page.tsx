import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";

const ViewDocument = dynamic(
  () => import("@/app/components/pages/viewDocument"),
  {
    loading: () => (
      <Flex gap="middle" justify="center">
        <Spin size="large">Уншиж байна</Spin>
      </Flex>
    ),
  }
);

export default function ViewLayout() {
  return <ViewDocument />;
}
