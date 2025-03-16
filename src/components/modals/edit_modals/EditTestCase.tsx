"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { ThirdContext } from "../checkmissing/ThirdCheckout";
import axios from "axios";

interface DataType {
  key: number;
  id: number;
  category: string;
  types: string;
  steps: string;
  result: string;
  division: string;
}

export function EditTestCase() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(ThirdContext);

  const detail = async function ({ id }: { id: any }) {
    try {
      setLoading(false);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const updatedData = request.data.data.testcase.map((testCase: any) => ({
          ...testCase,
          key: testCase.id,
        }));
        setDataSource(updatedData);
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    context && detail({ id: context });
  }, [context]);

  const handleAdd = () => {
    const newData: DataType = {
      key: Date.now(),
      id: Date.now(),
      category: "",
      types: "",
      steps: "",
      result: "",
      division: "",
    };
    setDataSource([...dataSource, newData]);
  };

  const handleDelete = (key: number) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
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
          initialValue={record.category}
        >
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={[
              { label: "high", value: "HIGH" },
              { label: "medium", value: "MEDIUM" },
              { label: "low", value: "LOW" },
            ]}
            onChange={(value) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => item.key === record.key
              );
              newData[index] = { ...newData[index], category: value };
              setDataSource(newData);
            }}
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
        <Form.Item name={["types", record.key]} initialValue={record.types}>
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={[
              { label: "high", value: "HIGH" },
              { label: "medium", value: "MEDIUM" },
              { label: "low", value: "LOW" },
            ]}
            onChange={(value) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => item.key === record.key
              );
              newData[index] = { ...newData[index], types: value };
              setDataSource(newData);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Тест хийх алхамууд",
      dataIndex: "steps",
      key: "steps",
      render: (_, record) => (
        <Form.Item name={["steps", record.key]} initialValue={record.steps}>
          <Input
            placeholder=""
            onChange={(e) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => item.key === record.key
              );
              newData[index] = { ...newData[index], steps: e.target.value };
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
        <Form.Item name={["result", record.key]} initialValue={record.result}>
          <Input
            placeholder=""
            onChange={(e) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => item.key === record.key
              );
              newData[index] = { ...newData[index], result: e.target.value };
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
          initialValue={record.division}
        >
          <Input
            placeholder=""
            onChange={(e) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => item.key === record.key
              );
              newData[index] = { ...newData[index], division: e.target.value };
              setDataSource(newData);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "",
      key: "delete",
      render: (_, record) => (
        <Image
          src="/trash.svg"
          alt="Delete"
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
        <Button type="primary" onClick={handleAdd}>
          Мөр нэмэх
        </Button>
      </div>
    </div>
  );
}
