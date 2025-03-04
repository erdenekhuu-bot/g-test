"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { DeleteOutlined } from "@ant-design/icons";

interface DataType {
  key: number;
  productCategory: string;
  product: string;
  amount: number;
  priceUnit: number;
  priceTotal: number;
}

export function TestEnv({ documentId }: { documentId?: any }) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);
  const [budgetForm] = Form.useForm();

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
      render: (_, record) => (
        <Form.Item
          name={["productCategory", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.productCategory}
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

              newData[index] = { ...newData[index], productCategory: value };
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
      title: "Төрөл",
      dataIndex: "product",
      key: "product",
      render: (_, record) => (
        <Form.Item
          name={["product", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.product}
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

              newData[index] = { ...newData[index], product: value };
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
      title: "Тоо ширхэг",
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => (
        <Form.Item
          name={["amount", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.amount}
        >
          <Input
            placeholder=""
            type="number"
            onChange={(e) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => record.key === item.key
              );
              newData[index] = {
                ...newData[index],
                amount: parseInt(e.target.value),
              };
              setDataSource(newData);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Нэгж үнэ (₮)",
      dataIndex: "priceUnit",
      key: "priceUnit",
      render: (_, record) => (
        <Form.Item
          name={["priceUnit", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.priceUnit}
        >
          <Input
            placeholder=""
            type="number"
            onChange={(e) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => record.key === item.key
              );
              newData[index] = {
                ...newData[index],
                priceUnit: parseInt(e.target.value),
              };
              setDataSource(newData);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Нийт үнэ (₮)",
      dataIndex: "priceTotal",
      key: "priceTotal",
      render: (_, record) => (
        <Form.Item
          name={["priceTotal", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.priceTotal}
        >
          <Input
            style={{ width: 200 }}
            placeholder=""
            type="number"
            onChange={(e) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => record.key === item.key
              );
              newData[index] = {
                ...newData[index],
                priceTotal: parseInt(e.target.value),
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
      const values = await budgetForm.validateFields();
      const data = dataSource.map((row: any) => {
        return {
          productCategory:
            values.productCategory?.[row.key] || row.productCategory,
          product: values.product?.[row.key] || row.product,
          amount: parseInt(values.amount?.[row.key] || row.amount, 10),
          priceUnit: parseInt(values.priceUnit?.[row.key] || row.priceUnit, 10),
          priceTotal: parseInt(
            values.priceTotal?.[row.key] || row.priceTotal,
            10
          ),
        };
      });
      const productCategory = data[0].productCategory.toString();
      const product = data[0].product.toString();
      const amount = data[0].amount;
      const priceUnit = data[0].priceUnit;
      const priceTotal = data[0].priceTotal;
      console.log(
        await axios.post(
          `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/budget/${documentId}`,
          {
            productCategory,
            product,
            amount,
            priceUnit,
            priceTotal,
          }
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form form={budgetForm}>
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
            handleSave();
          }}
        >
          Мөр нэмэх
        </Button>
      </div>
    </Form>
  );
}
