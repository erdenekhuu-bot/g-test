"use client";
import { Modal, Form, Input, Layout, Select, Table, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { convertUtil } from "@/components/usable";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { globalState } from "@/app/store";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
};

interface DataType {
  key: string;
  id: number;
  employee: string;
  jobPosition: string;
  role: string;
  department?: string;
}

const { TextArea } = Input;

export function FirstRead({ open, onCancel }: ModalProps) {
  const [mainForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [getEmployee, setEmployee] = useState<any[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const { documentId } = globalState();

  const detail = async ({ id }: { id: number }) => {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        setPending(request.data.data.state === "FORWARD");
        const updatedData = request.data.data.departmentEmployeeRole.map(
          (data: any) => ({
            key: uuidv4(),
            id: data.employee.id,
            department: data.employee.department?.name || "",
            employee: `${data.employee.firstname} ${data.employee.lastname}`,
            jobPosition: data.employee.jobPosition?.name || "",
            role: data.role,
          })
        );
        const formValues = {
          title: request.data.data.title,
          aim: request.data.data.detail[0].aim,
          intro: request.data.data.detail[0].intro,
          departmentemployee: updatedData.map((item: DataType) => ({
            employeeId: { value: item.id, label: item.employee },
            jobposition: item.jobPosition,
            role: item.role,
          })),
        };
        setDataSource(updatedData);
        mainForm.setFieldsValue(formValues);
      }
    } catch (error) {
      return;
    }
  };

  const fetchEmployees = async (searchValue: string) => {
    try {
      const response = await axios.post("/api/employee", {
        firstname: searchValue || "",
      });
      if (response.data.success) {
        setEmployee(response.data.data);
      }
    } catch (error) {
      return;
    }
  };

  const findEmployee = async (id: number) => {
    try {
      const response = await axios.get(`/api/employee/${id}`);
      return response.data.data;
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    documentId && detail({ id: documentId });
  }, [documentId]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        fetchEmployees(search);
      } else {
        setEmployee([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handlesubmit = async () => {
    try {
      const values = await mainForm.validateFields();
      const converting = {
        ...values,
        documentId: documentId,
        authuserId: session?.user.id,
      };
      const request = await axios.put("/api/document", converting);
      if (request.data.success) {
        onCancel();
        router.refresh();
      }
    } catch (error) {
      return;
    }
  };

  return (
    <Layout>
      <Modal
        open={open}
        onCancel={onCancel}
        width={1200}
        className="scrollbar select-none"
        style={{ overflowY: "auto", maxHeight: "800px" }}
        footer={[
          !pending && (
            <Button key="back" onClick={onCancel}>
              Цуцлах
            </Button>
          ),
          !pending && (
            <Button key="next" type="primary" onClick={handlesubmit}>
              Дараах
            </Button>
          ),
        ]}
      >
        <Form form={mainForm} className="p-6">
          <div className="flex justify-between text-xl mb-6">
            <b>"ЖИМОБАЙЛ" ХХК</b>
          </div>
          <div className="mt-8">
            <Form.Item name="title">
              <Input size="large" placeholder="Тестийн нэр бичнэ үү..." />
            </Form.Item>
          </div>
          <div className="my-4">
            <div className="font-bold my-2 text-lg">Зөвшөөрөл</div>
            <p className="mb-4">
              Дор гарын үсэг зурсан албан тушаалтнууд нь тестийн үйл ажиллагааны
              төлөвлөгөөний баримт бичигтэй танилцаж, түүнтэй санал нийлж
              байгаагаа хүлээн зөвшөөрч, баталгаажуулсан болно. Энэхүү
              төлөвлөгөөний өөрчлөлтийг доор гарын үсэг зурсан эсвэл тэдгээрийн
              томилогдсон төлөөлөгчдийн зөвшөөрлийг үндэслэн зохицуулж,
              нэмэлтээр батална.
            </p>
            <Form.List name="departmentemployee">
              {(fields, { add, remove }) =>
                loading && (
                  <section>
                    <Table
                      rowKey="key"
                      dataSource={fields}
                      pagination={false}
                      bordered
                      columns={[
                        {
                          title: "Нэр",
                          dataIndex: "employee",
                          key: "employee",
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, "employeeId"]}
                              style={{ margin: 0 }}
                            >
                              <Select
                                labelInValue
                                showSearch
                                allowClear
                                style={{ width: "100%" }}
                                placeholder=""
                                options={convertUtil(getEmployee)}
                                onSearch={(value) => setSearch(value)}
                                filterOption={false}
                                onChange={async (data, option) => {
                                  const selectedEmployee = await findEmployee(
                                    data.value
                                  );
                                  if (selectedEmployee) {
                                    const newData = [...dataSource];
                                    newData[index] = {
                                      ...newData[index],
                                      id: selectedEmployee.id,
                                      employee: `${selectedEmployee.firstname} ${selectedEmployee.lastname}`,
                                      department:
                                        selectedEmployee.department?.name || "",
                                      jobPosition:
                                        selectedEmployee.jobPosition?.name ||
                                        "",
                                    };
                                    setDataSource(newData);
                                    const currentValues =
                                      mainForm.getFieldValue(
                                        "departmentemployee"
                                      ) || [];
                                    currentValues[index] = {
                                      ...currentValues[index],
                                      employeeId: {
                                        value: selectedEmployee.id,
                                        label: `${selectedEmployee.firstname} ${selectedEmployee.lastname}`,
                                      },
                                      jobposition:
                                        selectedEmployee.jobPosition?.name ||
                                        "",
                                    };
                                    mainForm.setFieldsValue({
                                      departmentemployee: currentValues,
                                    });
                                  }
                                }}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Албан тушаал",
                          dataIndex: "jobPosition",
                          key: "jobPosition",
                          width: 300,
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, "jobposition"]}
                              style={{ margin: 0 }}
                            >
                              <Input readOnly />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Үүрэг",
                          dataIndex: "role",
                          key: "role",
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, "role"]}
                              style={{ margin: 0 }}
                            >
                              <Select
                                tokenSeparators={[","]}
                                options={[
                                  {
                                    value: "ACCESSER",
                                    label:
                                      "Тестийн төсрийг хянан баталгаажуулах",
                                  },
                                  {
                                    value: "VIEWER",
                                    label:
                                      "Баримт бичгийг хянан баталгаажуулах",
                                  },
                                ]}
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
                            id:
                              Math.max(
                                0,
                                ...dataSource.map((item) => item.id)
                              ) + 1,
                            employee: "",
                            jobPosition: "",
                            role: "",
                            department: "",
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
          </div>
          <div className="my-4">
            <div className="font-bold my-2 text-lg mx-4">
              1. Үйл ажиллагааны зорилго
            </div>
            <Form.Item name="aim">
              <TextArea
                rows={5}
                placeholder="Тестийн зорилго бичнэ үү..."
                style={{ resize: "none" }}
              />
            </Form.Item>
          </div>
          <div className="my-4">
            <div className="font-bold my-2 text-lg mx-4">
              2. Төслийн танилцуулга
            </div>
            <Form.Item name="intro">
              <TextArea
                rows={5}
                placeholder="Тестийн танилцуулга бичнэ үү..."
                style={{ resize: "none" }}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
}
