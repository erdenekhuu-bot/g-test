"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { SecondContext } from "../checkmissing/SecondCheckout";
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

export function EditTestEnv() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);
  const [loading, setLoading] = useState(false);
  const context = useContext(SecondContext);

  const detail = async function ({ id }: { id: any }) {
    try {
      setLoading(false);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const updatedData = request.data.data.budget.map((testCase: any) => ({
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
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
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
