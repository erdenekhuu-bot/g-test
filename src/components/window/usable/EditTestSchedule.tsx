"use client";
import { Form, Table, Button, Select, DatePicker, message } from "antd";
import { useState, useEffect, useContext, useCallback } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import Image from "next/image";
import { SecondContext } from "../edit/SecondDocument";
import { capitalizeFirstLetter, convertUtil } from "@/components/usable";
import { v4 as uuidv4 } from "uuid";

interface DataType {
  key: string;
  id: number;
  employeeId: string;
  role: string;
  startedDate: string;
  endDate: string;
}

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";

export function ReadTestSchedule({ form }: any) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [getEmployee, setEmployee] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const context = useContext(SecondContext);
  const [loading, setLoading] = useState(false);

  const detail = async ({ id }: { id: number }) => {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const updatedData = request.data.data.documentemployee.map(
          (data: any) => {
            const startedDate =
              data.startedDate && dayjs(data.startedDate, dateFormat).isValid()
                ? data.startedDate
                : "";
            const endDate =
              data.endDate && dayjs(data.endDate, dateFormat).isValid()
                ? data.endDate
                : "";
            return {
              key: uuidv4(),
              id: data.employee.id,
              employeeId:
                `${data.employee.firstname} ${data.employee.lastname}` || "",
              role: data.role || "",
              startedDate,
              endDate,
            };
          }
        );
        setDataSource(updatedData);

        form.setFieldsValue({
          testschedule: updatedData.map((item: DataType) => ({
            ...item,
            startedDate: item.startedDate ? dayjs(item.startedDate) : null,
            endDate: item.endDate ? dayjs(item.endDate) : null,
          })),
        });
      }
    } catch (error) {
      return;
    }
  };

  const fetchEmployees = useCallback(async (searchValue: string) => {
    try {
      const response = await axios.post("/api/employee", {
        firstname: searchValue,
      });
      if (response.data.success) {
        setEmployee(response.data.data);
      }
    } catch (error) {
      return;
    }
  }, []);

  useEffect(() => {
    if (search) {
      fetchEmployees(search);
    } else {
      setEmployee([]);
    }
  }, [search, fetchEmployees]);

  useEffect(() => {
    if (context && typeof context === "number") {
      detail({ id: context });
    }
  }, [context]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        fetchEmployees(search);
      } else {
        setEmployee([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, fetchEmployees]);

  const handleSearch = (value: string) => {
    setSearch(capitalizeFirstLetter(value));
  };

  return (
    <Form.List name="testschedule">
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
                  title: "Албан тушаал/Ажилтны нэр",
                  dataIndex: "employeeId",
                  key: "employeeId",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "employeeId"]}
                      rules={[{ required: false }]}
                    >
                      <Select
                        placeholder=""
                        style={{ width: "100%" }}
                        options={convertUtil(getEmployee)}
                        filterOption={false}
                        onSearch={handleSearch}
                        showSearch
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: "Үүрэг",
                  dataIndex: "role",
                  key: "role",
                  width: 300,
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "role"]}
                      rules={[{ required: false }]}
                    >
                      <Select
                        tokenSeparators={[","]}
                        options={[
                          {
                            value: "Хяналт тавих, Асуудал шийдвэрлэх",
                            label: "Хяналт тавих, Асуудал шийдвэрлэх",
                          },
                          {
                            value: "Техникийн нөхцөлөөр хангах",
                            label: "Техникийн нөхцөлөөр хангах",
                          },
                          {
                            value: "Төлөвлөгөө боловсруулах, Тест хийх",
                            label: "Төлөвлөгөө боловсруулах, Тест хийх",
                          },
                        ]}
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: "Эхлэх хугацаа",
                  dataIndex: "startedDate",
                  key: "startedDate",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "startedDate"]}>
                      <DatePicker format={dateFormat} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Дуусах хугацаа",
                  dataIndex: "endDate",
                  key: "endDate",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "endDate"]}>
                      <DatePicker format={dateFormat} />
                    </Form.Item>
                  ),
                },
                {
                  title: "",
                  key: "id",
                  render: (_, __, index) => (
                    <Image
                      src="/trash.svg"
                      alt="Delete"
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
                    employeeId: "",
                    role: "",
                    startedDate: "",
                    endDate: "",
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
