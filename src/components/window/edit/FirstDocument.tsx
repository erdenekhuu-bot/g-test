"use client";
import { Modal, Form, Input, Layout, Select, Table, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EditDepartmentEmployee } from "../usable/EditDepartmentEmployee";
import { convertUtil } from "@/components/usable";
import Image from "next/image";
import type { ColumnsType } from "antd/es/table";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  documentId: any;
};

interface DataType {
  key: number;
  id: number;
  employee: any;
  jobPosition: any;
  role: string;
}

const { TextArea } = Input;

export function FirstRead({ open, onCancel, documentId }: ModalProps) {
  const [mainForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [getEmployee, setEmployee] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  const detail = async function ({ id }: { id: number }) {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const formValues = {
          title: request.data.data.title,
          aim: request.data.data.detail[0].aim,
          intro: request.data.data.detail[0].intro,
          departmentemployee: request.data.data.departmentEmployeeRole.map(
            (data: any, index: number) => ({
              employeeId: data.employee.id,
              jobposition: data.employee.jobPosition?.name || "",
              role: data.role,
            })
          ),
        };
        const updatedData = request.data.data.departmentEmployeeRole.map(
          (data: any) => ({
            key: data.employee.id,
            id: data.employee.id,
            department: data.employee.department?.name,
            employee: data.employee.firstname + " " + data.employee.lastname,
            jobPosition: data.employee.jobPosition?.name || "",
            role: data.role,
          })
        );
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
    } catch (error) {}
  };

  useEffect(() => {
    documentId && detail({ id: documentId });
  }, [documentId]);

  useEffect(() => {
    if (search.length > 0) {
      fetchEmployees(search);
    } else {
      setEmployee([]);
    }
  }, [search]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        if (!search.trim()) {
          setEmployee([]);
          return;
        }

        const response = await axios.post("/api/employee", {
          firstname: search,
        });

        if (response.data.success) {
          setEmployee(response.data.data);
        }
      } catch (error) {}
    };

    const delayDebounce = setTimeout(() => {
      fetchEmployees();
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
      const cleanedData = { ...converting };
      delete cleanedData.key;
      const request = await axios.put("/api/document", cleanedData);

      if (request.data.success) {
        onCancel();
        router.refresh();
      }
    } catch (error) {}
  };

  const handleAdd = () => {
    const newKey = Math.max(0, ...dataSource.map((item) => item.key)) + 1;
    const newData: DataType = {
      key: newKey,
      id: newKey,
      employee: "",
      jobPosition: "",
      role: "",
    };
    setDataSource([...dataSource, newData]);
  };

  const handleDelete = (key: number) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Нэр",
      dataIndex: "employee",
      key: "employee",
      render: (_, record, index) => (
        <Form.Item
          name={["departmentemployee", index, "employeeId"]}
          style={{ margin: 0 }}
        >
          <Select
            showSearch
            allowClear
            style={{ width: "100%" }}
            placeholder=""
            options={convertUtil(getEmployee)}
            onSearch={(value) => setSearch(value)}
            filterOption={false}
            onChange={(value) => {
              const selectedEmployee = getEmployee.find(
                (emp: any) => emp.id === value
              );
              if (selectedEmployee) {
                const newData = [...dataSource];
                newData[index] = {
                  ...newData[index],
                  jobPosition: selectedEmployee.jobPosition?.name || "",
                };
                setDataSource(newData);

                const currentValues =
                  mainForm.getFieldValue("departmentemployee") || [];
                currentValues[index] = {
                  ...currentValues[index],
                  employeeId: value,
                  jobposition: selectedEmployee.jobPosition?.name || "",
                };
                mainForm.setFieldsValue({ departmentemployee: currentValues });
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
      render: (_, record, index) => (
        <Form.Item
          name={["departmentemployee", index, "jobposition"]}
          style={{ margin: 0 }}
        >
          <Input value={record.jobPosition} />
        </Form.Item>
      ),
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (_, record, index) => (
        <Form.Item
          name={["departmentemployee", index, "role"]}
          initialValue={record.role}
        >
          <Select
            tokenSeparators={[","]}
            style={{ marginTop: 18 }}
            options={[
              {
                value: "ACCESSER",
                label: "Баталгаажуулагч",
              },
              {
                value: "VIEWER",
                label: "Хянагч",
              },
            ]}
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
    <Layout>
      <Modal
        open={open}
        onOk={handlesubmit}
        onCancel={onCancel}
        width={1000}
        className="scrollbar select-none"
        style={{ overflowY: "auto", maxHeight: "800px" }}
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

            {/* <EditDepartmentEmployee documentId={documentId} /> */}
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              bordered
            />
            <div className="text-end mt-4">
              <Button type="primary" onClick={handleAdd}>
                Мөр нэмэх
              </Button>
            </div>
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
