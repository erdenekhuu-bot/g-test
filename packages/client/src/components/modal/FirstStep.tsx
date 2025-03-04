"use client";
import { Modal, Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { convertUtil } from "../usable";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { capitalizeFirstLetter } from "../usable";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  confirmLoading?: boolean;
  documentId: number | null;
  onOk?: () => void;
};

interface DataType {
  key: number;
  name: string;
  employee: string;
  role: string;
}

const { TextArea } = Input;

export function FirstStep({
  open,
  confirmLoading,
  onCancel,
  documentId,
  onOk,
}: ModalProps) {
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

  const getDocument = async function ({ id }: { id: any }) {
    try {
      const record = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/list/${id}`
      );
      if (record.data.success) {
        setData(record.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const employeeList = async function (params: any) {
    try {
      const record = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/employee`,
        {
          generate: params,
        }
      );
      if (record.data.success) {
        setEmployee(record.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (documentId) {
      getDocument({ id: documentId });
      employeeList(search);
    }
  }, [documentId, search]);

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

  return (
    <Modal
      open={open}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
    >
      <Form form={mainForm} className="p-6">
        <div className="flex justify-between text-xl mb-6">
          <b>"ЖИМОБАЙЛ" ХХК</b>
          <b>{data.generate}</b>
        </div>

        <div className="mt-8">
          {data.title && (
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Тестийн нэр!" }]}
              initialValue={data.title}
            >
              <Input size="large" placeholder="Тестийн нэр бичнэ үү..." />
            </Form.Item>
          )}
        </div>

        <Form form={tableForm} component={false}>
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
        </Form>

        <div className="my-4">
          <div className="font-bold my-2 text-lg mx-4">
            1. Үйл ажиллагааны зорилго
          </div>
          <Form.Item
            name="aim"
            rules={[{ required: true, message: "Тестийн зорилго!" }]}
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
            rules={[{ required: true, message: "Тестийн зорилго!" }]}
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
  );
}
