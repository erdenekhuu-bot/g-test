import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";

const MakeDocument = dynamic(
  () => import("@/components/pages/layouts/makeDocument"),
  {
    loading: () => (
      <Flex gap="middle" justify="center">
        <Spin size="large">Уншиж байна</Spin>
      </Flex>
    ),
  }
);

export default function DocumentLayout() {
  return <MakeDocument />;
}
