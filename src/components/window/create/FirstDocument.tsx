"use client";

import React, { useState, createContext, useEffect, useCallback } from "react";
import { Button, Form, Table, Select, Input, Modal } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  capitalizeFirstLetter,
  convertUtil,
  removeDepartment,
} from "@/components/usable";
import { ColumnsType } from "antd/es/table";
import { SecondDocument } from "./SecondDocument";
import { ThirdDocument } from "./ThirdDocument";
import Image from "next/image";

interface DataType {
  key: number;
  name: string;
  department: string;
  jobposition: string;
  role: string;
}

export const DocumentContext = createContext<string | null>(null);

export function FirstDocument() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);
  const [search, setSearch] = useState("");
  const [currentModal, setCurrentModal] = useState(0);
  const [getEmployee, setEmployee] = useState<any>([]);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [mainForm] = Form.useForm();

  const handleAdd = () => {
    const newData: DataType = {
      key: nextKey,
      name: "",
      department: "",
      jobposition: "",
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

  useEffect(() => {
    search ? fetchEmployees(search) : setEmployee([]);
  }, [search, fetchEmployees]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Нэр",
      dataIndex: "name",
      key: "name",
      width: 400,
      render: (_, record, index) => (
        <Form.Item name={["departmentemployee", index, "employeeId"]}>
          <Select
            style={{ width: "100%" }}
            options={convertUtil(getEmployee)}
            onSearch={handleSearch}
            filterOption={false}
            showSearch
            onChange={(value, option) => {
              const selectedEmployee = getEmployee.find(
                (emp: any) => emp.id === value
              );

              if (selectedEmployee) {
                mainForm.setFieldsValue({
                  departmentemployee: {
                    [index]: {
                      employeeId: value,
                      department: selectedEmployee.jobPosition?.name || "",
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
      title: "Албан тушаал",
      dataIndex: "department",
      key: "department",
      width: 300,
      render: (_, record, index) => (
        <Form.Item
          name={["departmentemployee", index, "department"]}
          initialValue={record.department}
        >
          <Input readOnly />
        </Form.Item>
      ),
    },

    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      width: 300,
      render: (_, record, index) => (
        <Form.Item name={["departmentemployee", index, "role"]}>
          <Select
            tokenSeparators={[","]}
            options={[
              {
                value: "ACCESSER",
                label: "Баримт бичгийг баталгаажуулах",
              },
              {
                value: "VIEWER",
                label: "Тестийн төсвийг хянан баталгаажуулах",
              },
            ]}
          />
        </Form.Item>
      ),
    },
    {
      title: "",
      key: "id",
      width: 80,
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

  const handleSubmit = async () => {
    try {
      const values = await mainForm.validateFields();
      const converting = {
        ...removeDepartment(values),
        authuserId: session?.user.id,
      };

      let cleanedData = { ...converting };
      delete cleanedData.key;

      const request = await axios.post("/api/document", cleanedData);

      if (request.data.success) {
        setDocumentId(request.data.data.id);
        handleNext();
        router.refresh();
      }
    } catch (error) {
      return;
    }
  };

  return (
    <section>
      <Button
        type="primary"
        className="bg-[#01443f] text-white p-6"
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
          <div className="flex justify-betweent text-xl mb-6">
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
            <Form.Item name="aim">
              <Input.TextArea
                rows={5}
                placeholder="Тестийн зорилго бичнэ үү..."
                style={{ resize: "none" }}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>
          <div className="my-4">
            <div className="font-bold my-2 text-lg mx-4">
              2. Төслийн танилцуулга
            </div>
            <Form.Item name="intro">
              <Input.TextArea
                maxLength={500}
                rows={5}
                placeholder="Тестийн танилцуулга бичнэ үү..."
                style={{ resize: "none" }}
                showCount
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <DocumentContext.Provider value={documentId}>
        <SecondDocument
          open={currentModal === 2}
          next={handleNext}
          onCancel={handleCancel}
        />

        <ThirdDocument open={currentModal === 3} onCancel={handleCancel} />
      </DocumentContext.Provider>
    </section>
  );
}
