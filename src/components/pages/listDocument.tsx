"use client";
import React, { useState, useEffect } from "react";
import { Table, Pagination, Input } from "antd";
import axios from "axios";
import {
  formatHumanReadable,
  convertName,
  mongollabel,
} from "@/components/usable";
import { ListDataType } from "@/types/type";
import type { GetProps } from "antd";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

export default function ListDocument() {
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
        setData(record.data.data);
        setPage(record.data.page + 1);
      }
    } catch (error) {}
  };

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

          {/* <Table.Column
            title=""
            dataIndex="isFull"
            align="center"
            width={80}
            render={(isFull, record) => (
              <Steps
                current={isFull}
                progressDot={customDot(record.id)}
                items={[{ title: "1" }, { title: "2" }, { title: "3" }]}
              />
            )}
          /> */}
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
