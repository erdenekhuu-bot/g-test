"use client";
import { useState, useEffect } from "react";
import { Table, Input, Pagination, Space, Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { ListDataType } from "@/types/type";
import axios from "axios";
import { convertName, formatHumanReadable } from "@/components/usable";

const { Search } = Input;

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "Зөвшөөрөх",
    onClick: () => {
      alert(1);
    },
  },
  {
    key: "2",
    label: "Буцаах",
    onClick: () => {
      alert(2);
    },
  },
];

export default function ViewDocument() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [getData, setData] = useState<any[]>([]);
  const [searching, setSearching] = useState("");
  const [total, setTotal] = useState(0);

  const fetching = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/filter`,
        {
          authUserId: 1,
          generate: searching,
          pagination: { page, pageSize },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_TOKEN}`,
          },
        }
      );

      if (data.success) {
        const checkout = data.data.filter((item: any) => item.state === "DENY");
        setData(checkout);
        setTotal(data.count);
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetching();
  }, [page, pageSize, searching]);

  return (
    <section>
      <div className="flex justify-between my-8">
        <p>
          <Search
            placeholder="Тоотоор хайх"
            onKeyDown={(e: any) => {
              setSearching(e.target.value);
              setPage(1);
            }}
            className="w-80"
          />

          <Search placeholder="Тушаалаар хайх" className="w-80 mx-8" />
        </p>
      </div>
      <div className="bg-white">
        <Table<ListDataType>
          dataSource={getData}
          pagination={false}
          rowKey="id"
        >
          <Table.Column title="Тоот" dataIndex="generate" />
          <Table.Column
            title="Тестийн нэр"
            dataIndex="title"
            defaultSortOrder="descend"
          />
          <Table.Column
            title="Тушаал"
            dataIndex="order"
            render={() => <span>-</span>}
          />
          <Table.Column
            key="employee"
            title="Үүсгэсэн ажилтан"
            dataIndex="user"
            render={(user: any) => <span>{convertName(user.employee)}</span>}
          />
          <Table.Column
            title="Огноо"
            dataIndex="timeCreated"
            render={(timeCreated: string) => (
              <span>{formatHumanReadable(timeCreated)}</span>
            )}
          />
          <Table.Column
            title="Төлөв"
            dataIndex="state"
            render={(state: string) => (
              <Space direction="vertical">
                <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                  <Button type="primary">Хариу</Button>
                </Dropdown>
              </Space>
            )}
          />
        </Table>
      </div>
    </section>
  );
}
