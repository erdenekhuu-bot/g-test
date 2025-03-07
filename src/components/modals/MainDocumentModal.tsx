"use client";
import {
  Modal,
  Form,
  Input,
  Table,
  Button,
  Select,
  Layout,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { convertUtil } from "../usable";
import { useState, useEffect } from "react";
import Image from "next/image";
import { capitalizeFirstLetter } from "../usable";
import axios from "axios";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  next: () => void;
};

interface DataType {
  key: number;
  name: string;
  employee: string;
  role: string;
}

const { TextArea } = Input;

export function MainDocumentModal({ open, onCancel, next }: ModalProps) {
  const [data, setData] = useState<any>([]);
  const [getEmployee, setEmployee] = useState<any>([]);
  const [job, setJobPosition] = useState<{
    value: string | number;
    label: string;
  } | null>(null);
  const [getJob, setJob] = useState<string | null>(null);
  const [mainForm] = Form.useForm();
  const [tableForm] = Form.useForm();
  const [search, setSearch] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const employeeList = async function (params: any) {
    try {
      const record = await axios.post("/api/employee", {
        name: params,
      });
      if (record.data.success) {
        setEmployee(record.data.data);
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    employeeList(search);
  }, [search]);

  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);

  const handleAdd = () => {
    const newData: DataType = {
      key: nextKey,
      name: "",
      employee: "",
      role: "",
    };
    setDataSource([...dataSource, newData]);
    setNextKey(nextKey + 1);
  };

  const handleDelete = (key: number) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleSearch = (value: any) => {
    setSearch(capitalizeFirstLetter(value));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Нэр",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <Form.Item
          name={["names", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.name}
        >
          <Select
            style={{ width: "100%" }}
            options={convertUtil(getEmployee)}
            onSearch={handleSearch}
            filterOption={false}
            onChange={(value) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => record.key === item.key
              );
              const selectedEmployee = getEmployee.find(
                (item: any) => item.id === value
              );
              if (selectedEmployee && selectedEmployee.jobPosition) {
                setJobPosition({
                  value: selectedEmployee.jobPosition.id,
                  label: selectedEmployee.jobPosition.name,
                });

                tableForm.setFieldsValue({
                  data: {
                    [index]: {
                      employee: {
                        value: selectedEmployee.jobPosition.id,
                        label: `${selectedEmployee.jobPosition.name}`,
                      },
                    },
                  },
                });
              }
              newData[index] = { ...newData[index], name: value };
              setDataSource(newData);
            }}
            showSearch
          />
        </Form.Item>
      ),
    },
    {
      title: "Албан тушаал",
      dataIndex: "employee",
      key: "employee",
      render: (_, record) => (
        <Form.Item
          name={["employee", record.key]}
          rules={[
            { required: true, message: "Албан тушаал сонгох шаардлагатай" },
          ]}
          initialValue={getJob != null ? getJob : ""}
        >
          <Select
            tokenSeparators={[","]}
            placeholder="Албан тушаал"
            value={job || undefined}
            options={job ? [job] : []}
          />
        </Form.Item>
      ),
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (_, record) => (
        <Form.Item
          name={["roles", record.key]}
          rules={[
            {
              required: true,
              message: "Гүйцэтгэх үүрэг оруулах шаардалагатай",
            },
          ]}
          initialValue={record.role}
        >
          <Input
            placeholder=""
            onChange={(e) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => record.key === item.key
              );
              newData[index] = { ...newData[index], employee: e.target.value };
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

  const handleNext = async () => {
    try {
      const values = await mainForm.validateFields();
      const data = {
        authuserId: 1,
        aim: values.aim,
        title: values.title,
        intro: values.intro,
        role: Array.isArray(values.roles) ? values.roles.slice(1) : [],
        employeeId: Array.isArray(values.names) ? values.names.slice(1) : [],
        jobPositionId: Array.isArray(values.employee)
          ? values.employee.slice(1)
          : [],
      };
      const request = await axios.post("/api/document", data);
      if (request.data.success) {
        next();
      }
    } catch (error) {
      return;
    }
  };

  return (
    <Layout>
      <Modal
        open={open}
        onOk={next}
        onCancel={onCancel}
        width={1000}
        className="scrollbar select-none"
        style={{ overflowY: "auto", maxHeight: "800px" }}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="next" type="primary" onClick={handleNext}>
            Next
          </Button>,
        ]}
      >
        <Form form={mainForm} className="p-6">
          <div className="flex justify-between text-xl mb-6">
            <b>"ЖИМОБАЙЛ" ХХК</b>
          </div>
          <div className="mt-8">
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Тестийн нэр!" }]}
              initialValue={data.title}
            >
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
          <div className="my-4">
            <div className="font-bold my-2 text-lg mx-4">
              1. Үйл ажиллагааны зорилго
            </div>
            <Form.Item
              name="aim"
              rules={[
                { required: true, message: "Зорилго бичих шаардлагатай!" },
              ]}
            >
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
            <Form.Item
              name="intro"
              rules={[
                { required: true, message: "Танилцуулга бичих шаардлагатай!" },
              ]}
            >
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
