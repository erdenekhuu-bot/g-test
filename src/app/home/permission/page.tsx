import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";

const PermissionDocument = dynamic(
  () => import("@/components/pages/permissionDocument"),
  {
    loading: () => (
      <Flex gap="middle" justify="center" align="center" className="h-screen">
        <Spin size="large">Уншиж байна</Spin>
      </Flex>
    ),
  }
);

export default async function PermissionLayout() {
  return <PermissionDocument />;
}
