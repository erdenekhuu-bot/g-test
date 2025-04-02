"use client";
import { Form, Input, Table, Button, Select, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import Image from "next/image";

interface DataType {
  key: number;
  list: string;
  level: string;
  solve: string;
}

export function ReportTestError() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);

  const handleAdd = () => {
    const newData: DataType = {
      key: nextKey,
      list: "",
      level: "",
      solve: "",
    };
    setDataSource([...dataSource, newData]);
    setNextKey(nextKey + 1);
  };

  const handleDelete = (key: number) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Алдааны жагсаалт",
      dataIndex: "list",
      key: "list",
      render: (_, record, index) => (
        <Form.Item name={["reporttesterror", index, "list"]}>
          <Input placeholder="" />
        </Form.Item>
      ),
    },

    {
      title: "Алдааны түвшин",
      dataIndex: "level",
      key: "level",
      width: 200,
      render: (_, record, index) => (
        <Form.Item name={["reporttesterror", index, "level"]}>
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={[
              {
                label: "high",
                value: "HIGH",
              },
              {
                label: "medium",
                value: "MEDIUM",
              },
              {
                label: "low",
                value: "LOW",
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
      title: "Алдаа гарсан эсэх",
      dataIndex: "exception",
      key: "exception",
      width: 200,
      render: (_, record, index) => (
        <Form.Item name={["reporttesterror", index, "exception"]}>
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={[
              {
                label: "Гараагүй",
                value: false,
              },
              {
                label: "Гарсан",
                value: true,
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
      title: "Шийдвэрлэсэн эсэх",
      dataIndex: "value",
      key: "value",

      render: (_, record, index) => (
        <Form.Item name={["reporttesterror", index, "value"]}>
          <Input placeholder="" />
        </Form.Item>
      ),
    },

    {
      title: "",
      key: "id",
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
