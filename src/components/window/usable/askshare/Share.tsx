"use client";
import { Button, Select, Table, Modal, Form, message } from "antd";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { convertUtil, capitalizeFirstLetter } from "@/components/usable";
import Image from "next/image";
import { globalState } from "@/app/store";
import { useSession } from "next-auth/react";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
};

export function Share({ open, onCancel }: ModalProps) {
  const router = useRouter();
  const [getEmployee, setEmployee] = useState<any>([]);
  const [search, setSearch] = useState("");
  const { documentId } = globalState();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

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

  const handleSearch = (value: any) => {
    setSearch(capitalizeFirstLetter(value));
  };

  const findEmployee = async (id: number) => {
    try {
      const response = await axios.get("/api/employee/" + id);
      return response.data.data;
    } catch (error) {}
  };

  useEffect(() => {
    search ? fetchEmployees(search) : setEmployee([]);
  }, [search, fetchEmployees]);

  const handleSubmit = async () => {
    try {
      const values = await mainForm.validateFields();
      const sharegroup = values.sharegroup.map((item: any) => {
        return {
          employeeId: item.employeeId,
          documentId: documentId,
        };
      });
      const request = await axios.put("/api/document/share", {
        sharegroup,
        documentId: documentId,
      });
      if (request.data.success) {
        router.push("/home/create/" + documentId);
      }
    } catch (error) {
      messageApi.error("Амжилтгүй боллоо.");
    }
  };

  const [mainForm] = Form.useForm();
  return (
    <Modal
      title="Хуваалцах хүмүүс"
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      {contextHolder}
      <Form form={mainForm} layout="vertical">
        <Form.List name="sharegroup">
          {(fields, { add, remove }) => (
            <section>
              <Table
                rowKey="key"
                dataSource={fields}
                pagination={false}
                bordered
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
