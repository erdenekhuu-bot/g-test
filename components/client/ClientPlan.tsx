"use client";
import { Table, Flex, Input, Button, message, Badge, Space } from "antd";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ZUSTAND } from "@/app/zustand";
import { formatHumanReadable } from "@/lib/usable";
import { ShareWindow } from "../window/ShareWindow";

export default function ClientPlan({
  data,
  total,
  page,
  pageSize,
}: TablePagination) {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const checkout = session?.user.employee.permission[0].kind.includes("READ");
  const hasEdit = session?.user.employee.permission[0].kind.includes("EDIT");
  const solopermission = session?.user.employee.super;
  const router = useRouter();
  const { getDocumentId, getCheckout } = ZUSTAND();

  const generateSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
      params.set("page", "1");
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const dataWithKeys = data.map((item: any) => ({
    ...item.data,
    key: item.data.id,
  }));
  const handleTableChange = (pagination: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pagination.current.toString());
    params.set("pageSize", pagination.pageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const columns = [
    { title: "Тоот", dataIndex: "generate" },
    { title: "Тестийн нэр", dataIndex: "title" },
    {
      title: "Үүсгэсэн ажилтан",
      dataIndex: "employee",
    },
    {
      title: "Төлөв",
      dataIndex: "departmentRoles",
      render: (record: any) => {
        const accessed = record.every((item: any) => item.state === "ACCESS");
        const checkout = record.some((item: any) => item.state === "ACCESS");
        return accessed ? (
          <Badge status="success" text="Батлагдсан" />
        ) : checkout ? (
          <Badge status="processing" text="Хянагдаж байна" />
        ) : (
          <Badge status="warning" text="Шинэ" />
        );
      },
    },
    {
      title: "Шалгах",
      dataIndex: "id",
      render: (id: number) => (
        <Button
          type="primary"
          onClick={() => {
            router.push("plan/listplan/" + id);
          }}
        >
          Шалгах
        </Button>
      ),
    },
    {
      title: "Хуваалцах",
      dataIndex: "id",
      render: (id: number, record: any) => {
        return record?.share?.length > 0 ? (
          <Badge
            status="error"
            text="Хуваалцсан"
            className="hover:cursor-pointer"
            onClick={() => {
              getDocumentId(id);
              getCheckout(1);
            }}
          />
        ) : (
          <Button
            onClick={() => {
              getDocumentId(id);
              getCheckout(1);
            }}
          >
            Хуваалцах
          </Button>
        );
      },
    },
    {
      title: "Кэйс нэмэх",
      dataIndex: "id",
      render: (id: number) => (
        <Button
          type="link"
          onClick={() => {
            getDocumentId(id);
            router.push("/plan/case/" + id);
          }}
        >
          Кэйс нэмэх
        </Button>
      ),
    },
    {
      title: "Засах",
      dataIndex: "id",
      render: (id: number, record: any) => {
        const accessed = record.departmentRoles.every(
          (item: any) => item.state === "ACCESS"
        );
        return (
          <Button
            type="primary"
            onClick={() => {
              router.push("plan/" + id);
              getDocumentId(id);
            }}
            disabled={accessed}
          >
            Засах
          </Button>
        );
      },
    },
    {
      title: "Огноо",
      dataIndex: "timeCreated",
      sorter: (a: any, b: any) =>
        new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime(),
      render: (timeCreated: string) =>
        formatHumanReadable(new Date(timeCreated).toISOString()),
    },
  ];
  return (
    <section>
      {contextHolder}
      <div className="mb-8">
        <Flex gap={20} justify="space-between">
          <Space.Compact>
            <Input.Search
              enterButton
              placeholder="Тестийн нэрээр хайх"
              onChange={(e) => {
                generateSearch(e.target.value);
              }}
              allowClear
            />
          </Space.Compact>

          <Button
            type="primary"
            onClick={() => {
              router.push("/plan/create");
            }}
          >
            Төлөвлөгөө үүсгэх
          </Button>
        </Flex>
      </div>

      <Flex gap="middle" vertical>
        <Table
          columns={columns.filter(Boolean)}
          dataSource={dataWithKeys}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
          }}
          onChange={handleTableChange}
        />
      </Flex>
      <ShareWindow />
    </section>
  );
}
