"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import axios from "axios";
import { ThirdContext } from "../edit/ThirdDocument";

interface DataType {
  key: number;
  id: number;
  category: string;
  types: string;
  steps: string;
  result: string;
  division: string;
}

export function ReadTestCase() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(ThirdContext);

  const detail = async ({ id }: { id: any }) => {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        console.log(request.data.data);
        const updatedData = request.data.data.testcase.map((testCase: any) => ({
          key: testCase.id,
          id: testCase.id,
          category: testCase.category || "",
          types: testCase.types || "",
          steps: testCase.steps || "",
          result: testCase.result || "",
          division: testCase.division || "",
        }));

        setDataSource(updatedData);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (context) {
      detail({ id: context });
    }
  }, [context]);

  const handleAdd = () => {
    const newKey = Math.max(0, ...dataSource.map((item) => item.key)) + 1;
    const newData: DataType = {
      key: newKey,
      id: newKey,
      category: "",
      types: "",
      steps: "",
      result: "",
      division: "",
    };
    const updatedData = [...dataSource, newData];
    setDataSource(updatedData);
  };

  const handleDelete = (key: number) => {
    const updatedData = dataSource.filter((item) => item.key !== key);
    setDataSource(updatedData);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Ангилал",
      dataIndex: "category",
      key: "category",
      width: 200,
      render: (_, record, index) => (
        <Form.Item
          name={["testcase", index, "category"]}
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
        <Form.Item
          name={["testcase", index, "types"]}
          initialValue={record.types}
        >
          <Input.TextArea rows={1} />
        </Form.Item>
      ),
    },
    {
      title: "Тест хийх алхамууд",
      dataIndex: "steps",
      key: "steps",
      render: (_, record, index) => (
        <Form.Item
          name={["testcase", index, "steps"]}
          initialValue={record.steps}
        >
          <Input placeholder="" />
        </Form.Item>
      ),
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      render: (_, record, index) => (
        <Form.Item
          name={["testcase", index, "result"]}
          initialValue={record.result}
        >
          <Input placeholder="" />
        </Form.Item>
      ),
    },
    {
      title: "Хариуцах нэгж",
      dataIndex: "division",
      key: "division",
      render: (_, record, index) => (
        <Form.Item
          name={["testcase", index, "division"]}
          initialValue={record.division}
        >
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
        <Button type="primary" onClick={handleAdd}>
          Мөр нэмэх
        </Button>
      </div>
    </div>
  );
}
