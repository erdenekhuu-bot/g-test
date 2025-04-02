"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useContext, useEffect } from "react";
import { SecondContext } from "../edit/SecondDocument";
import Image from "next/image";
import axios from "axios";

interface DataType {
  key: number;
  id: number;
  category: string;
  value: string;
}

export function ReadTestCriteria({ documentId }: { documentId?: any }) {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const context = useContext(SecondContext);
  const [loading, setLoading] = useState(false);

  const detail = async function ({ id }: { id: any }) {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const filteredAttributes = request.data.data.attribute.filter(
          (attr: any) =>
            attr.categoryMain === "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур"
        );
        setDataSource(filteredAttributes);
      }
    } catch (error) {}
  };

  useEffect(() => {
    context && detail({ id: context });
  }, [context]);

  const handleAdd = () => {
    const newData: DataType = {
      key: Date.now(),
      id: Date.now(),
      category: "",
      value: "",
    };
    setDataSource([...dataSource, newData]);
  };

  const handleDelete = (key: number) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Ангилал",
      dataIndex: "category",
      key: "category",
      render: (_, record, index) => (
        <Form.Item
          name={["attribute", index, "category"]}
          initialValue={record.category}
        >
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
        <Form.Item
          name={["attribute", index, "value"]}
          initialValue={record.value}
        >
          <Input placeholder="" />
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
        rowKey="id"
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
