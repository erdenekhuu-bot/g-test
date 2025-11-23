"use client";
import { Modal, Form, Button, message, Table, Select } from "antd";
import { ZUSTAND } from "@/app/zustand";
import type { FormProps } from "antd";
import Image from "next/image";
import { convertUtil, capitalizeFirstLetter, convertName } from "@/lib/usable";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ShareGR } from "@/action/share";

export function ShareWindow() {
  const [mainForm] = Form.useForm();
  const { checkout, getCheckout, documentId } = ZUSTAND();
  const [messageApi, contextHolder] = message.useMessage();
  const [getEmployee, setEmployee] = useState<any>([]);
  const [search, setSearch] = useState("");
  const { data: session } = useSession();
  const handleSearch = (value: any) => {
    setSearch(capitalizeFirstLetter(value));
  };
  const handleCancel = () => {
    getCheckout(-1);
    mainForm.resetFields();
  };
  const onFinish: FormProps["onFinish"] = async (values) => {
    const sharegroup = values.sharegroup.map((item: any) => {
      return {
        employeeId: item.employeeId,
        documentId,
      };
    });

    const merge = {
      authuser: Number(session?.user.id),
      documentId,
      sharegroup,
    };
    const result = await ShareGR(merge);
    if (result > 0) {
      messageApi.success("Амжилттай хуваалцлаа!");
      getCheckout(-1);
      detail(documentId);
    } else {
      messageApi.error("Алдаа гарлаа");
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
    } catch (error) {}
  }, []);

  const findEmployee = async (id: number) => {
    try {
      const response = await axios.get("/api/employee/" + id);
      return response.data.data;
    } catch (error) {}
  };

  const detail = async (id: number) => {
    const response = await axios.put("/api/document/share", {
      id,
    });
    if (response.data.success) {
      const updatedData = response.data.data.map((item: any) => {
        return {
          employeeId: {
            value: item.employee.id,
            label: convertName(item.employee),
          },
        };
      });

      mainForm.setFieldsValue({
        sharegroup: updatedData,
      });
    }
  };

  useEffect(() => {
    search ? fetchEmployees(search) : setEmployee([]);
  }, [search, fetchEmployees]);
  useEffect(() => {
    detail(documentId);
  }, [documentId]);
  return (
    <Modal
      open={checkout == 1}
      onOk={onFinish}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Болих
        </Button>,
        <Button key="next" type="primary" onClick={() => mainForm.submit()}>
          Цааш
        </Button>,
      ]}
    >
      {contextHolder}
      <Form form={mainForm} onFinish={onFinish}>
        <Form.List name="sharegroup">
          {(fields, { add, remove }) => (
            <section>
              <Table
                rowKey="id"
                dataSource={fields}
                pagination={false}
                columns={[
                  {
                    title: "Нэр",
                    dataIndex: "name",
                    key: "name",
                    width: 400,
                    render: (_, __, index) => (
                      <Form.Item name={[index, "employeeId"]}>
                        <Select
                          style={{ width: "100%" }}
                          options={convertUtil(getEmployee)}
                          onSearch={handleSearch}
                          filterOption={false}
                          showSearch
                          onChange={async (value, option) => {
                            const selectedEmployee = await findEmployee(value);
                            if (selectedEmployee) {
                              mainForm.setFieldsValue({
                                departmentemployee: {
                                  [index]: {
                                    employeeId: value,
                                    department:
                                      selectedEmployee.jobPosition?.name || "",
                                  },
                                },
                              });
                            }
                          }}
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
                      employeeId: "",
                    })
                  }
                >
                  Мөр нэмэх
                </Button>
              </div>
            </section>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
