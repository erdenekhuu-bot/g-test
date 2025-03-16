"use client";
import React, { useState, createContext, useEffect } from "react";
import { Button, Form, Table, Select, Input, Modal } from "antd";
import { SecondStep } from "./SecondStep";
import { ThirdStep } from "./ThirdStep";
import axios from "axios";
import { capitalizeFirstLetter } from "../usable";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { convertUtil } from "../usable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DataType {
  key: number;
  name: string;
  employee: string;
  role: string;
}

const { TextArea } = Input;

export const DocumentContext = createContext<string | null>(null);

export function CreateDocumentModal() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentModal, setCurrentModal] = useState(0);
  const [getEmployee, setEmployee] = useState<any>([]);
  const [job, setJobPosition] = useState<{
    value: string | number;
    label: string;
  } | null>(null);
  const [getJob, setJob] = useState<string | null>(null);
  const [mainForm] = Form.useForm();
  const [tableForm] = Form.useForm();
  const [search, setSearch] = useState("");
  const [documentId, setDocumentId] = useState<string | null>(null);

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

  const showModal = () => {
    setCurrentModal(1);
  };

  const handleNext = () => {
    setCurrentModal((prev) => prev + 1);
  };

  const handleCancel = () => {
    setCurrentModal(0);
  };

  const handleSubmit = async () => {
    try {
      const values = await mainForm.validateFields();
      const data = {
        // authuserId: session?.user.id,
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
        setDocumentId(request.data.data.id);
        handleNext();
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
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

  return (
    <div>
      <Button
        type="primary"
        className="bg-[#01443F] text-white p-6"
        onClick={showModal}
      >
        Тестийн төлөвлөгөө үүсгэх
      </Button>

      <Modal
        open={currentModal === 1}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={1000}
        className="scrollbar select-none"
        style={{ overflowY: "auto", maxHeight: "800px" }}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Болих
          </Button>,
          <Button key="next" type="primary" onClick={handleSubmit}>
            Цааш
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

      <DocumentContext.Provider value={documentId}>
        <SecondStep
          open={currentModal === 2}
          next={handleNext}
          onCancel={handleCancel}
        />

        <ThirdStep open={currentModal === 3} onCancel={handleCancel} />
      </DocumentContext.Provider>
    </div>
  );
}
