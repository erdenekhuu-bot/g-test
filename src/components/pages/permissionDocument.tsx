"use client";
import React, { useState, useEffect } from "react";
import { Table, Pagination, Input, Dropdown } from "antd";
import axios from "axios";
import {
  formatHumanReadable,
  convertName,
  mongollabel,
} from "@/components/usable";
import type { MenuProps } from "antd";
import { ListDataType } from "@/types/type";
import type { GetProps } from "antd";
import { Badge } from "@/components/ui/badge";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

export default function PermissionDocument() {
  const [getData, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
    total: number;
  }>();
  const [search, setSearch] = useState("");

  const fetching = async function () {
    try {
      const record = await axios.post(`/api/document/filter`, {
        order: search,
        page: page,
        pageSize: pageSize,
      });
      if (record.data.success) {
        setPagination(record.data.pagination);
        setData(
          record.data.data.filter((action: any) => action.state === "FORWARD")
        );
        setPage(record.data.page + 1);
      }
    } catch (error) {}
  };

  const items = (id: number): MenuProps["items"] => [
    {
      label: (
        <span
          onClick={async () => {
            await axios.patch(`/api/document/detail/${id}`, {
              reject: false,
            });
          }}
        >
          Цохох
        </span>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <span
          onClick={async () => {
            await axios.patch(`/api/document/detail/${id}`, {
              reject: true,
            });
          }}
        >
          Буцаах
        </span>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
  ];

  useEffect(() => {
    fetching();
  }, [page, pageSize, search]);
  return (
    <section>
      <Search
        placeholder=""
        onKeyDown={(e: any) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ width: 200 }}
      />
      <div className="bg-white">
        <Table<ListDataType>
          dataSource={getData}
          pagination={false}
          rowKey="id"
        >
          <Table.Column
            title="Тоот"
            dataIndex="generate"
            sortDirections={["descend"]}
          />
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
            title="Үүсгэсэн ажилтан"
            dataIndex="user"
            render={(user: any) => <span>{convertName(user.employee)}</span>}
          />

          <Table.Column
            title="Огноо"
            dataIndex="timeCreated"
            sorter={(a, b) =>
              new Date(a.timeCreated).getTime() -
              new Date(b.timeCreated).getTime()
            }
            render={(timeCreated: string) => (
              <span>{formatHumanReadable(timeCreated)}</span>
            )}
          />

          <Table.Column
            title="Төлөв"
            dataIndex="id"
            align="center"
            width={80}
            render={(id: number, record: any) => (
              <Dropdown menu={{ items: items(id) }}>
                <Badge
                  variant="info"
                  className="py-1"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  {mongollabel(record.state)}
                </Badge>
              </Dropdown>
            )}
          />
        </Table>
      </div>
      <div className="flex justify-end my-6">
        <Pagination
          current={pagination?.page}
          pageSize={pagination?.pageSize}
          total={pagination?.total}
          onChange={(newPage: number, newPageSize: number) => {
            setPage(newPage);
            setPageSize(newPageSize);
          }}
        />
      </div>
    </section>
  );
}
