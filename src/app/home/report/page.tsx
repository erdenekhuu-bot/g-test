import dynamic from "next/dynamic";
import { Flex, Spin } from "antd";

const ReportDocument = dynamic(
  () => import("@/app/components/pages/reportDocument"),
  {
    loading: () => (
      <Flex gap="middle" justify="center" align="center" className="h-screen">
        <Spin size="large">Уншиж байна</Spin>
      </Flex>
    ),
  }
);

export default function ReportLayout() {
  return <ReportDocument />;
}
