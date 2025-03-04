"use client";
import { useState, useEffect } from "react";
import { Table, Input, Pagination } from "antd";
import type { TableProps } from "antd";
import { ListDataType } from "@/types/type";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import {
  mongollabel,
  formatHumanReadable,
  convertName,
} from "@/components/usable";

const { Search } = Input;

const onChange: TableProps<ListDataType>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra);
};

export default function ReportDocument() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [getData, setData] = useState<any[]>([]);
  const [searching, setSearching] = useState("");
  const [total, setTotal] = useState(0);

  const fetching = async () => {
    try {
      const record = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/filter`,
        {
          generate: searching,
          pagination: { page, pageSize },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_TOKEN}`,
          },
        }
      );

      if (record.data.success) {
        setData(record.data.data);
        setTotal(record.data.count);
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
        </p>
      </div>
      <div className="bg-white">
        <Table<any> dataSource={getData} pagination={false} rowKey="id">
          <Table.Column title="Тоот" dataIndex="generate" />
          <Table.Column
            title="Тестийн нэр"
            dataIndex="title"
            defaultSortOrder="descend"
          />
          <Table.Column title="Тушаал" dataIndex="order" />
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
              <Badge
                onClick={() => {
                  alert(1);
                }}
                variant={state != "DENY" ? "info" : "warning"}
                className="py-2 hover:cursor-pointer"
              >
                {mongollabel(state)}
              </Badge>
            )}
          />
        </Table>
      </div>
      <div className="flex justify-end my-6">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          }}
        />
      </div>
    </section>
  );
}
