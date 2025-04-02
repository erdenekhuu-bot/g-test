"use client";
import { Form, Input, Table, Button, Select, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import Image from "next/image";

interface DataType {
  key: number;
  type: string;
  phone: string;
  description: string;
}

export function UsedPhone() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);

  const handleAdd = () => {
    const newData: DataType = {
      key: nextKey,
      type: "",
      phone: "",
      description: "",
    };
    setDataSource([...dataSource, newData]);
    setNextKey(nextKey + 1);
  };

  const handleDelete = (key: number) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Дугаарын төрөл",
      dataIndex: "type",
      key: "type",
      render: (_, record, index) => (
        <Form.Item
          name={["usedphone", index, "type"]}
          rules={[{ required: true, message: "Алдааны жагсаалт" }]}
        >
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={[
              {
                label: "Урьдчилсан төлбөрт",
                value: "PERPAID",
              },
              {
                label: "Дараа төлбөрт",
                value: "POSTPAID",
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
      title: "Дугаар",
      dataIndex: "phone",
      key: "phone",
      width: 200,
      render: (_, record, index) => (
        <Form.Item
          name={["usedphone", index, "phone"]}
          rules={[{ required: true, message: "Алдааны түвшин" }]}
        >
          <Input placeholder="" />
        </Form.Item>
      ),
    },

    {
      title: "Тайлбар",
      dataIndex: "description",
      key: "description",

      render: (_, record, index) => (
        <Form.Item
          name={["usedphone", index, "description"]}
          rules={[{ required: true, message: "Шийдвэрлэсэн туай" }]}
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
      <p className="mt-8 mb-4 font-bold text-lg">Ашигласан дугаарууд</p>
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
