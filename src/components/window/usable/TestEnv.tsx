"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import Image from "next/image";

interface DataType {
  key: number;
  productCategory: string;
  product: string;
  amount: number;
  priceUnit: number;
  priceTotal: number;
}

export function TestEnv() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);

  const handleAdd = () => {
    const newData: DataType = {
      key: nextKey,
      productCategory: "",
      product: "",
      amount: 0,
      priceUnit: 0,
      priceTotal: 0,
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
      dataIndex: "productCategory",
      key: "productCategory",
      render: (_, record, index) => (
        <Form.Item name={["testenv", index, "productCategory"]}>
          <Input.TextArea rows={1} style={{ resize: "none" }} />
        </Form.Item>
      ),
    },
    {
      title: "Төрөл",
      dataIndex: "product",
      key: "product",
      render: (_, record, index) => (
        <Form.Item name={["testenv", index, "product"]}>
          <Input.TextArea rows={1} style={{ resize: "none" }} />
        </Form.Item>
      ),
    },
    {
      title: "Тоо ширхэг",
      dataIndex: "amount",
      key: "amount",
      render: (_, record, index) => (
        <Form.Item name={["testenv", index, "amount"]}>
          <Input placeholder="" type="number" />
        </Form.Item>
      ),
    },
    {
      title: "Нэгж үнэ (₮)",
      dataIndex: "priceUnit",
      key: "priceUnit",
      render: (_, record, index) => (
        <Form.Item name={["testenv", index, "priceUnit"]}>
          <Input placeholder="" type="number" />
        </Form.Item>
      ),
    },
    {
      title: "Нийт үнэ (₮)",
      dataIndex: "priceTotal",
      key: "priceTotal",
      render: (_, record, index) => (
        <Form.Item name={["testenv", index, "priceTotal"]}>
          <Input placeholder="" type="number" />
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
      <div className="font-bold my-2 text-lg mx-4">
        7. Тестийн төсөв /Тестийн орчин/
      </div>
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
