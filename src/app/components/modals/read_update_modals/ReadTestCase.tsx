"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

interface DataType {
  key: number;
  category: string;
  types: string;
  steps: string;
  result: string;
  division: string;
}

export function ReadTestCase({ documentId }: { documentId?: any }) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);
  const [data, setData] = useState<DataType[]>([]);

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
      width: 200,
      render: (_, record) => (
        <Form.Item
          name={["category", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.category}
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

              newData[index] = { ...newData[index], category: value };
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
      title: "Тестийн төрөл",
      dataIndex: "types",
      key: "types",
      width: 200,
      render: (_, record) => (
        <Form.Item
          name={["types", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.types}
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

              newData[index] = { ...newData[index], types: value };
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
      title: "Тест хийх алхамууд",
      dataIndex: "steps",
      key: "steps",
      render: (_, record) => (
        <Form.Item
          name={["steps", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.steps}
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
                steps: e.target.value,
              };
              setDataSource(newData);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      render: (_, record) => (
        <Form.Item
          name={["result", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.result}
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
                result: e.target.value,
              };
              setDataSource(newData);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Хариуцах нэгж",
      dataIndex: "division",
      key: "division",
      render: (_, record) => (
        <Form.Item
          name={["division", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.division}
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
                division: e.target.value,
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

  const detail = async function ({ id }: { id: string }) {
    try {
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        setData(request.data.data.testcase);
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    documentId && detail({ id: documentId });
  }, [documentId]);

  return (
    <div>
      <Table dataSource={data} columns={columns} pagination={false} bordered />
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
