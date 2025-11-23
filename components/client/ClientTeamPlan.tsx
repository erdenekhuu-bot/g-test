"use client";
import {
  useSearchParams,
  usePathname,
  useRouter,
  redirect,
} from "next/navigation";
import { ZUSTAND } from "@/app/zustand";
import { Button, Flex, Table } from "antd";

export default function ClientTeamPlan({
  data,
  total,
  page,
  pageSize,
}: TablePagination) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { replace } = useRouter();
  const dataWithKeys = data.map((item: any) => ({
    ...item,
    key: item.id,
  }));
  const handleTableChange = (pagination: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pagination.current.toString());
    params.set("pageSize", pagination.pageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  const columns = [
    {
      title: "Гишүүд",
      dataIndex: "firstname",
    },
    {
      title: "Үүсгэсэн төлөвлөгөө",
      dataIndex: "authUser",
      render: (record: any) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              router.push("teamplan/" + record.id);
            }}
          >
            {record.Document.length > 0 ? record.Document.length : 0}
          </Button>
        );
      },
    },
  ];
  return (
    <Flex gap="middle" vertical>
      <Table
        columns={columns}
        dataSource={dataWithKeys}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
        }}
        onChange={handleTableChange}
      />
    </Flex>
  );
}
