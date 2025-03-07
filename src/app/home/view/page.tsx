import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";

const ViewDocument = dynamic(
  () => import("@/app/components/pages/viewDocument"),
  {
    loading: () => (
      <Flex gap="middle" justify="center" align="center" className="h-screen">
        <Spin size="large">Уншиж байна</Spin>
      </Flex>
    ),
  }
);

export default function ViewLayout() {
  return <ViewDocument />;
}
