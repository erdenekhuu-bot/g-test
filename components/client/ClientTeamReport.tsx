"use client";
import {
  useSearchParams,
  usePathname,
  useRouter,
  redirect,
} from "next/navigation";
import Image from "next/image";
import { Button, Flex, Table } from "antd";

export default function ClientTeamReport({
  data,
  total,
  page,
  pageSize,
}: TablePagination) {
  const searchParams = useSearchParams();
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
      dataIndex: "user",
      render: (record: any) => record.employee.firstname,
    },
    {
      title: "Тайлан үзэх",
      dataIndex: "report",
      render: (record: any) => {
        return record !== null ? (
          <Button
            type="primary"
            onClick={() => {
              //    getMember(record.id);
              redirect("teamreport/" + record.id);
            }}
          >
            Үзэх
          </Button>
        ) : null;
      },
    },
    {
      title: "PDF view",
      dataIndex: "id",
      render: (id: number) => {
        return (
          <Image
            alt=""
            src="/view.svg"
            width={40}
            height={40}
            onClick={() => window.open(`/api/download/view/${id}`, "_blank")}
            className="hover:cursor-pointer"
          />
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
