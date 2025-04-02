"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import Image from "next/image";

interface DataType {
  key: number;
  category: string;
  types: string;
}

export function TestCriteria({ documentId }: { documentId?: any }) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);

  const handleAdd = () => {
    const newData: DataType = {
      key: nextKey,
      category: "",
      types: "",
    };
    setDataSource([...dataSource, newData]);
    setNextKey(nextKey + 1);
  };

  const handleDelete = (key: number) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Ангилал",
      dataIndex: "category",
      key: "category",
      width: 300,
      render: (_, record, index) => (
        <Form.Item name={["attribute", index, "category"]}>
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={[
              {
                label: "Түтгэлзүүлэх",
                value: "Түтгэлзүүлэр",
              },
              {
                label: "Дахин эхлүүлэх",
                value: "Дахин эхлүүлэх",
              },
            ]}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Шалгуур",
      dataIndex: "category",
      key: "value",
      render: (_, record, index) => (
        <Form.Item name={["attribute", index, "value"]}>
          <Input.TextArea rows={3} style={{ resize: "none" }} />
        </Form.Item>
      ),
    },

    {
      title: "",
      key: "",
      render: (_, record) => (
        <Image
          src="/trash.svg"
          alt=""
          className="hover:cursor-pointer"
          width={20}
          height={20}
          onClick={() => handleDelete(record.key)}
        />
      ),
    },
  ];

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
      />
      <div className="text-end mt-4">
        <Button
          type="primary"
          onClick={() => {
            handleAdd();
          }}
        >
          Мөр нэмэх
        </Button>
      </div>
    </div>
  );
}
