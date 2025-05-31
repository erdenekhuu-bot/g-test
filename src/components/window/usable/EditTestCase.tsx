"use client";
import { Form, Input, Table, Button, Select } from "antd";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import axios from "axios";
import { ThirdContext } from "../edit/ThirdDocument";
import { v4 as uuidv4 } from "uuid";

interface DataType {
  key: string;
  id: number;
  category: string;
  types: string;
  steps: string;
  result: string;
  division: string;
}

export function ReadTestCase({ form }: any) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(ThirdContext);

  const detail = async ({ id }: { id: any }) => {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const updatedData = request.data.data.testcase.map((testCase: any) => ({
          key: uuidv4(),
          id: testCase.id,
          category: testCase.category || "",
          types: testCase.types || "",
          steps: testCase.steps || "",
          result: testCase.result || "",
          division: testCase.division || "",
        }));

        setDataSource(updatedData);
        form.setFieldsValue({ testcase: updatedData });
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (context) {
      detail({ id: context });
    }
  }, [context]);

  return (
    <Form.List name="testcase">
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
                  width: 200,
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "category"]}
                      rules={[{ required: false }]}
                    >
                      <Select
                        placeholder=""
                        options={[
                          { label: "System testing", value: "System testing" },
                          { label: "UI testing", value: "UI testing" },
                          {
                            label: "Integration testing",
                            value: "Integration testing",
                          },
                          {
                            label: "Unit testing + Integration testing",
                            value: "Unit testing + Integration testing",
                          },
                          {
                            label: "Acceptance Testing + System Testing",
                            value: "Acceptance Testing + System Testing",
                          },
                          { label: "Smoke Testing", value: "Smoke Testing" },
                          {
                            label: "Performance Testing",
                            value: "Performance Testing",
                          },
                          {
                            label: "Security Testing",
                            value: "Security Testing",
                          },
                          {
                            label: "Regression Testing",
                            value: "Regression Testing",
                          },
                          { label: "Load Testing", value: "Load Testing" },
                          { label: "Stress Testing", value: "Stress Testing" },
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
                  title: "Тестийн төрөл",
                  dataIndex: "types",
                  key: "types",
                  width: 200,
                  render: (_, __, index) => (
                    <Form.Item name={[index, "types"]}>
                      <Input.TextArea rows={1} maxLength={500} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Тест хийх алхамууд",
                  dataIndex: "steps",
                  key: "steps",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "steps"]}>
                      <Input.TextArea rows={1} maxLength={500} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Үр дүн",
                  dataIndex: "result",
                  key: "result",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "result"]}>
                      <Input.TextArea rows={1} maxLength={500} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Хариуцах нэгж",
                  dataIndex: "division",
                  key: "division",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "division"]}>
                      <Input.TextArea rows={1} maxLength={500} />
                    </Form.Item>
                  ),
                },
                {
                  title: "",
                  key: "action",
                  render: (_, __, index) => (
                    <Image
                      src="/trash.svg"
                      alt="Delete"
                      width={20}
                      height={20}
                      className="hover:cursor-pointer"
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
                    types: "",
                    steps: "",
                    result: "",
                    division: "",
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
