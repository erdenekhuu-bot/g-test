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
      render: (_, record) => (
        <Form.Item
          name={["list", record.key]}
          rules={[{ required: true, message: "Алдааны жагсаалт" }]}
        >
          <Input
            placeholder=""
            onChange={(e) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => record.key === item.key
              );
              newData[index] = {
                ...newData[index],
                list: e.target.value,
              };
              setDataSource(newData);
            }}
          />
        </Form.Item>
      ),
    },

    {
      title: "Алдааны түвшин",
      dataIndex: "level",
      key: "level",
      width: 200,
      render: (_, record) => (
        <Form.Item
          name={["level", record.key]}
          rules={[{ required: true, message: "Алдааны түвшин" }]}
        >
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={[
              {
                label: "high",
                value: 1,
              },
              {
                label: "medium",
                value: 2,
              },
              {
                label: "low",
                value: 3,
              },
            ]}
            onChange={(value) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => record.key === item.key
              );

              newData[index] = { ...newData[index], level: value };
              setDataSource(newData);
            }}
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
      render: (_, record) => (
        <Form.Item
          name={["exception", record.key]}
          rules={[{ required: true, message: "Алдааны гарсан" }]}
        >
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
            onChange={(value) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => record.key === item.key
              );

              newData[index] = { ...newData[index], level: value };
              setDataSource(newData);
            }}
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
      dataIndex: "solve",
      key: "solve",

      render: (_, record) => (
        <Form.Item
          name={["solve", record.key]}
          rules={[{ required: true, message: "Шийдвэрлэсэн туай" }]}
        >
          <Input
            placeholder=""
            onChange={(e) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => record.key === item.key
              );
              newData[index] = {
                ...newData[index],
                solve: e.target.value,
              };
              setDataSource(newData);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "",
      key: "",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
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
