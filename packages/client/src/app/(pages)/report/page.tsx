import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";

const ReportDocument = dynamic(
  () => import("@/components/pages/layouts/reportDocument"),
  {
    loading: () => (
      <Flex gap="middle" justify="center">
        <Spin size="large">Уншиж байна</Spin>
      </Flex>
    ),
  }
);

export default function ReportLayout() {
  return <ReportDocument />;
}
