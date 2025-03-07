"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import Image from "next/image";

interface DataType {
  key: number;
  riskDescription: string;
  riskLevel: string;
  affectionLevel: string;
  mitigationStrategy: string;
}

export function ReadTestRisk() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);
  const handleAdd = () => {
    const newData: DataType = {
      key: nextKey,
      riskDescription: "",
      riskLevel: "",
      affectionLevel: "",
      mitigationStrategy: "",
    };
    setDataSource([...dataSource, newData]);
    setNextKey(nextKey + 1);
  };

  const handleDelete = (key: number) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Эрсдэл",
      dataIndex: "riskDescription",
      key: "riskDescription",
      render: (_, record) => (
        <Form.Item
          name={["riskDescription", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.riskDescription}
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
                riskDescription: e.target.value,
              };
              setDataSource(newData);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Эрсдлийн магадлал",
      dataIndex: "riskLevel",
      key: "riskLevel",
      render: (_, record) => (
        <Form.Item
          name={["riskLevel", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.riskLevel}
        >
          <Select
            placeholder="Select name"
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

              newData[index] = { ...newData[index], riskLevel: value };
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
      title: "Эрсдлийн нөлөөлөл",
      dataIndex: "affectionLevel",
      key: "affectionLevel",
      render: (_, record) => (
        <Form.Item
          name={["affectionLevel", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.affectionLevel}
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

              newData[index] = { ...newData[index], affectionLevel: value };
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
      title: "Бууруулах арга зам",
      dataIndex: "mitigationStrategy",
      key: "mitigationStrategy",
      render: (_, record) => (
        <Form.Item
          name={["mitigationStrategy", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.mitigationStrategy}
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
                mitigationStrategy: e.target.value,
              };
              setDataSource(newData);
            }}
          />
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
      <li className="mb-2 mt-4">
        4.1 Хараат байдал
        <ul className="ml-8">
          • Эхний оруулсан таамаглал энэ форматын дагуу харагдах хэдэн ч мөр
          байх боломжтой
        </ul>
      </li>

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
