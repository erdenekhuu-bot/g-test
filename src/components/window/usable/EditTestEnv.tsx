"use client";
import { Form, Input, Table, Button } from "antd";
import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { SecondContext } from "../edit/SecondDocument";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface DataType {
  key: string;
  id: number;
  productCategory: string;
  product: string;
  amount: number;
  priceUnit: number;
  priceTotal: number;
}

export function ReadTestEnv({ form }: any) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(SecondContext);

  const detail = async ({ id }: { id: number }) => {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const updatedData = request.data.data.budget.map((data: any) => ({
          key: uuidv4(),
          id: data.id,
          productCategory: data.productCategory || "",
          product: data.product || "",
          amount: data.amount || 0,
          priceUnit: data.priceUnit || 0,
          priceTotal: data.priceTotal || 0,
        }));
        setDataSource(updatedData);
        form.setFieldsValue({ testenv: updatedData });
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (context && typeof context === "number") {
      detail({ id: context });
    }
  }, [context]);

  return (
    <section>
      <div className="font-bold my-2 text-lg mx-4">
        7. Тестийн төсөв /Тестийн орчин/
      </div>
      <Form.List name="testenv">
        {(fields, { add, remove }) =>
          loading && (
            <section>
              <Table
                dataSource={fields}
                pagination={false}
                bordered
                rowKey="key"
                columns={[
                  {
                    title: "Ангилал",
                    dataIndex: "productCategory",
                    key: "productCategory",
                    render: (_, __, index) => (
                      <Form.Item name={[index, "productCategory"]}>
                        <Input.TextArea
                          rows={1}
                          placeholder=""
                          maxLength={500}
                        />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "Төрөл",
                    dataIndex: "product",
                    key: "product",
                    render: (_, __, index) => (
                      <Form.Item name={[index, "product"]}>
                        <Input.TextArea
                          rows={1}
                          placeholder=""
                          maxLength={500}
                        />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "Тоо ширхэг",
                    dataIndex: "amount",
                    key: "amount",
                    render: (_, __, index) => (
                      <Form.Item name={[index, "amount"]}>
                        <Input placeholder="" type="number" />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "Нэгж үнэ (₮)",
                    dataIndex: "priceUnit",
                    key: "priceUnit",
                    render: (_, __, index) => (
                      <Form.Item name={[index, "priceUnit"]}>
                        <Input placeholder="" type="number" />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "Нийт үнэ (₮)",
                    dataIndex: "priceTotal",
                    key: "priceTotal",
                    render: (_, __, index) => (
                      <Form.Item name={[index, "priceTotal"]}>
                        <Input
                          style={{ width: 200 }}
                          placeholder=""
                          type="number"
                        />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "",
                    key: "id",
                    render: (_, __, index) => (
                      <Image
                        src="/trash.svg"
                        alt=""
                        className="hover:cursor-pointer"
                        width={20}
                        height={20}
                        onClick={() => remove(index)}
                      />
                    ),
                  },
                ]}
              />
              <div className="text-end mt-4">
                <Button
                  type="primary"
                  onClick={() =>
                    add({
                      key: uuidv4(),
                      id: Math.max(0, ...dataSource.map((item) => item.id)) + 1,
                      productCategory: "",
                      product: "",
                      amount: 0,
                      priceUnit: 0,
                      priceTotal: 0,
                    })
                  }
                >
                  Мөр нэмэх
                </Button>
              </div>
            </section>
          )
        }
      </Form.List>
    </section>
  );
}
