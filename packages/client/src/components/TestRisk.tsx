"use client";
import { Modal, Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { selectConvert } from "./usable";

interface DataType {
  key: number;
  riskDescription: string;
  riskLevel: string;
  affectionLevel: string;
  mitigationStrategy: string;
}

export function TestRisk({ documentId }: { documentId?: any }) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);
  const [riskForm] = Form.useForm();
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

  const handleSave = async () => {
    try {
      const values = await riskForm.validateFields();
      const affectionLevel = selectConvert(values.affectionLevel[1]);
      const mitigationStrategy = values.mitigationStrategy[1];
      const riskDescription = values.riskDescription[1];
      const riskLevel = selectConvert(values.riskLevel[1]);

      console.log(
        await axios.post(
          `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/risk/${documentId}`,
          {
            affectionLevel,
            mitigationStrategy,
            riskDescription,
            riskLevel,
          }
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form form={riskForm} component={false}>
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
            handleSave();
          }}
        >
          Мөр нэмэх
        </Button>
      </div>
    </Form>
  );
}
