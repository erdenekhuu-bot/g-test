"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import Image from "next/image";

interface DataType {
  key: number;
  category: string;
  types: string;
  steps: string;
  result: string;
  division: string;
}

export function TestCase() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);

  const handleAdd = () => {
    const newData: DataType = {
      key: nextKey,
      category: "",
      types: "",
      steps: "",
      result: "",
      division: "",
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
      width: 250,
      render: (_, record, index) => (
        <Form.Item name={["testcase", index, "category"]}>
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={[
              {
                label: "System testing",
                value: "System testing",
              },
              {
                label: "UI testing",
                value: "UI testing",
              },
              {
                label: "Unit testing + Integration testing",
                value: "Unit testing + Integration testing",
              },
              {
                label: "Unit testing",
                value: "Unit testing",
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
      title: "Тестийн төрөл",
      dataIndex: "types",
      key: "types",
      width: 200,
      render: (_, record, index) => (
        <Form.Item name={["testcase", index, "types"]}>
          <Input.TextArea rows={1} />
        </Form.Item>
      ),
    },
    {
      title: "Тест хийх алхамууд",
      dataIndex: "steps",
      key: "steps",
      render: (_, record, index) => (
        <Form.Item name={["testcase", index, "steps"]}>
          <Input.TextArea rows={1} />
        </Form.Item>
      ),
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      render: (_, record, index) => (
        <Form.Item name={["testcase", index, "result"]}>
          <Input.TextArea rows={1} />
        </Form.Item>
      ),
    },
    {
      title: "Хариуцах нэгж",
      dataIndex: "division",
      key: "division",
      render: (_, record, index) => (
        <Form.Item name={["testcase", index, "division"]}>
          <Input.TextArea rows={1} />
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
