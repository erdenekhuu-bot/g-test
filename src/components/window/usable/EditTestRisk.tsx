"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { SecondContext } from "../edit/SecondDocument";

interface DataType {
  key: number;
  id: number;
  riskDescription: string;
  riskLevel: string;
  affectionLevel: string;
  mitigationStrategy: string;
}

export function ReadTestRisk() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(SecondContext);

  const detail = async function ({ id }: { id: any }) {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const updatedData = request.data.data.riskassessment.map(
          (data: any) => ({
            key: data.id,
            id: data.id,
            riskDescription: data.riskDescription || "",
            riskLevel: data.riskLevel || "",
            affectionLevel: data.affectionLevel || "",
            mitigationStrategy: data.mitigationStrategy || "",
          })
        );
        setDataSource(updatedData);
      }
    } catch (error) {}
  };

  useEffect(() => {
    context && detail({ id: context });
  }, [context]);

  const handleAdd = () => {
    const newKey = Math.max(0, ...dataSource.map((item) => item.key)) + 1;
    const newData: DataType = {
      key: newKey,
      id: newKey,
      riskDescription: "",
      riskLevel: "",
      affectionLevel: "",
      mitigationStrategy: "",
    };
    setDataSource([...dataSource, newData]);
  };

  const handleDelete = (key: number) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Эрсдэл",
      dataIndex: "riskDescription",
      key: "riskDescription",
      render: (_, record, index) => (
        <Form.Item
          name={["testrisk", index, "riskDescription"]}
          initialValue={record.riskDescription}
        >
          <Input placeholder="" />
        </Form.Item>
      ),
    },
    {
      title: "Эрсдлийн магадлал",
      dataIndex: "riskLevel",
      key: "riskLevel",
      render: (_, record, index) => (
        <Form.Item
          name={["testrisk", index, "riskLevel"]}
          initialValue={record.riskLevel}
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
      render: (_, record, index) => (
        <Form.Item
          name={["testrisk", index, "affectionLevel"]}
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
      render: (_, record, index) => (
        <Form.Item
          name={["testrisk", index, "mitigationStrategy"]}
          initialValue={record.mitigationStrategy}
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
      <li className="mb-2 mt-4">4.2 Эрсдэл</li>

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
