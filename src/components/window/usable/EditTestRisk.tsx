"use client";
import { Form, Input, Table, Button, Select } from "antd";
import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { SecondContext } from "../edit/SecondDocument";
import { v4 as uuidv4 } from "uuid";

interface DataType {
  key: string;
  id: number;
  riskDescription: string;
  riskLevel: string;
  affectionLevel: string;
  mitigationStrategy: string;
}

export function ReadTestRisk({ form }: any) {
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
            key: uuidv4(),
            id: data.id,
            riskDescription: data.riskDescription || "",
            riskLevel: data.riskLevel || "",
            affectionLevel: data.affectionLevel || "",
            mitigationStrategy: data.mitigationStrategy || "",
          })
        );
        setDataSource(updatedData);
        form.setFieldsValue({
          testrisk: updatedData,
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    context && detail({ id: context });
  }, [context]);

  return (
    <section>
      <li className="mb-2 mt-4">4.2 Эрсдэл</li>
      <Form.List name="testrisk">
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
                    title: "Эрсдэл",
                    dataIndex: "riskDescription",
                    key: "riskDescription",
                    render: (_, __, index) => (
                      <Form.Item
                        name={[index, "riskDescription"]}
                        rules={[{ required: false }]}
                      >
                        <Input.TextArea
                          rows={1}
                          placeholder=""
                          maxLength={500}
                        />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "Эрсдлийн магадлал",
                    dataIndex: "riskLevel",
                    key: "riskLevel",
                    render: (_, __, index) => (
                      <Form.Item
                        name={[index, "riskLevel"]}
                        rules={[{ required: false }]}
                      >
                        <Select
                          placeholder=""
                          style={{ width: "100%" }}
                          options={[
                            {
                              label: "HIGH",
                              value: 1,
                            },
                            {
                              label: "MEDIUM",
                              value: 2,
                            },
                            {
                              label: "LOW",
                              value: 3,
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
                    title: "Эрсдлийн нөлөөлөл",
                    dataIndex: "affectionLevel",
                    key: "affectionLevel",
                    render: (_, __, index) => (
                      <Form.Item name={[index, "affectionLevel"]}>
                        <Select
                          placeholder=""
                          style={{ width: "100%" }}
                          options={[
                            {
                              label: "HIGH",
                              value: 1,
                            },
                            {
                              label: "MEDIUM",
                              value: 2,
                            },
                            {
                              label: "LOW",
                              value: 3,
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
                    title: "Бууруулах арга зам",
                    dataIndex: "mitigationStrategy",
                    key: "mitigationStrategy",
                    render: (_, __, index) => (
                      <Form.Item
                        name={[index, "mitigationStrategy"]}
                        rules={[{ required: false }]}
                      >
                        <Input.TextArea
                          rows={1}
                          placeholder=""
                          maxLength={500}
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
                      riskDescription: "",
                      riskLevel: "",
                      affectionLevel: "",
                      mitigationStrategy: "",
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
