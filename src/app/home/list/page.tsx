import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";

const ListDocument = dynamic(() => import("@/components/pages/listDocument"), {
  loading: () => (
    <Flex gap="middle" justify="center" align="center" className="h-screen">
      <Spin size="large">Уншиж байна</Spin>
    </Flex>
  ),
});

export default async function ListLayout() {
  return <ListDocument />;
}
