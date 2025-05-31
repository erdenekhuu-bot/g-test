"use client";
import { Form, Input, Table, Button, Select } from "antd";
import { useState, useContext, useEffect } from "react";
import { SecondContext } from "../edit/SecondDocument";
import Image from "next/image";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export function ReadTestCriteria({ form }: any) {
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
        form.setFieldsValue({
          attribute: filteredAttributes,
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    context && detail({ id: context });
  }, [context]);

  return (
    <Form.List name="attribute">
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
                  dataIndex: "category",
                  key: "category",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "category"]}>
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
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: "Шалгуур",
                  dataIndex: "value",
                  key: "value",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "value"]}>
                      <Input.TextArea rows={1} placeholder="" maxLength={500} />
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
                    category: "",
                    value: "",
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
  );
}
