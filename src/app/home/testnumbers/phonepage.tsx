"use client";
import { mongollabel } from "@/components/usable";
import { Form, Input, Table, Flex, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

interface DataType {
  key: number;
  type: string;
  phone: string;
  description: string;
}

export function PhonePage({ documents, total, pageSize, page, search }: any) {
  const [searchTerm, setSearchTerm] = useState<string>(search);
  const router = useRouter();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      const params = new URLSearchParams({
        page: "1",
        pageSize: pageSize.toString(),
        search: value || "",
      });
      router.push(`/home/testnumbers?${params.toString()}`);
    },
    [router, pageSize]
  );

  const columns: ColumnsType<DataType> = [
    {
      title: "Дугаарын төрөл",
      dataIndex: "type",
      key: "type",
      render: (type) => mongollabel(type),
    },
    {
      title: "Дугаар",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone,
    },
    {
      title: "Тайлбар",
      dataIndex: "description",
      key: "description",
      render: (description) => description,
    },
  ];
  return (
    <div>
      <p className="mt-8 mb-4 font-bold text-lg">Ашигласан дугаарууд</p>
      <Flex gap={20}>
        <Input.Search
          placeholder="Дугаараар хайх"
          value={searchTerm}
          onChange={handleSearchChange}
          allowClear
          style={{ width: 400 }}
        />
      </Flex>
      <div className="mt-8">
        <Table
          rowKey="id"
          dataSource={documents[0]?.report[0]?.usedphone}
          columns={columns}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
          }}
          bordered
        />
      </div>
    </div>
  );
}
