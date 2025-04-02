"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { SecondContext } from "../edit/SecondDocument";
import axios from "axios";

interface DataType {
  key: number;
  id: number;
  productCategory: string;
  product: string;
  amount: number;
  priceUnit: number;
  priceTotal: number;
}

export function ReadTestEnv() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(SecondContext);
  const [form] = Form.useForm();

  const detail = async function ({ id }: { id: any }) {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const updatedData = request.data.data.budget.map((data: any) => ({
          key: data.id,
          id: data.id,
          productCategory: data.productCategory || "",
          product: data.product || "",
          amount: data.amount || 0,
          priceUnit: data.priceUnit || 0,
          priceTotal: data.priceTotal || 0,
        }));
        setDataSource(updatedData);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    context && detail({ id: context });
  }, [context]);

  const handleAdd = () => {
    const newKey = Math.max(0, ...dataSource.map((item) => item.key)) + 1;
    const newData: DataType = {
      key: newKey,
      id: newKey,
      productCategory: "",
      product: "",
      amount: 0,
      priceUnit: 0,
      priceTotal: 0,
    };
    const updatedData = [...dataSource, newData];
    setDataSource(updatedData);
  };

  const handleDelete = (key: number) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Ангилал",
      dataIndex: "productCategory",
      key: "productCategory",
      render: (_, record, index) => (
        <Form.Item
          name={["testenv", index, "productCategory"]}
          initialValue={record.productCategory}
        >
          <Input placeholder="" />
        </Form.Item>
      ),
    },
    {
      title: "Төрөл",
      dataIndex: "product",
      key: "product",
      render: (_, record, index) => (
        <Form.Item
          name={["testenv", index, "product"]}
          initialValue={record.product}
        >
          <Input placeholder="" />
        </Form.Item>
      ),
    },

    {
      title: "Тоо ширхэг",
      dataIndex: "amount",
      key: "amount",
      render: (_, record, index) => (
        <Form.Item
          name={["testenv", index, "amount"]}
          initialValue={record.amount}
        >
          <Input placeholder="" type="number" />
        </Form.Item>
      ),
    },
    {
      title: "Нэгж үнэ (₮)",
      dataIndex: "priceUnit",
      key: "priceUnit",
      render: (_, record, index) => (
        <Form.Item
          name={["testenv", index, "priceUnit"]}
          initialValue={record.priceUnit}
        >
          <Input placeholder="" type="number" />
        </Form.Item>
      ),
    },
    {
      title: "Нийт үнэ (₮)",
      dataIndex: "priceTotal",
      key: "priceTotal",
      render: (_, record, index) => (
        <Form.Item
          name={["testenv", index, "priceTotal"]}
          initialValue={record.priceTotal}
        >
          <Input style={{ width: 200 }} placeholder="" type="number" />
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
