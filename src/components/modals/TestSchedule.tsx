"use client";
import { Form, Input, Table, Button, Select, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import Image from "next/image";
import { capitalizeFirstLetter, convertUtil } from "../usable";

interface DataType {
  key: number;
  employeeId: string;
  role: string;
  startedDate: string;
  endDate: string;
}

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";

export function TestSchedule() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);
  const [getEmployee, setEmployee] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any>([]);

  const handleAdd = () => {
    const newData: DataType = {
      key: nextKey,
      employeeId: "",
      role: "",
      startedDate: "",
      endDate: "",
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
      title: "Албан тушаал/Ажилтны нэр",
      dataIndex: "employeeId",
      key: "employeeId",
      render: (_, record) => (
        <Form.Item
          name={["employeeId", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.employeeId}
        >
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={convertUtil(getEmployee)}
            filterOption={false}
            onSearch={handleSearch}
            onChange={(value) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => record.key === item.key
              );
              const selectedEmployee = getEmployee.find(
                (item: any) => item.id === value
              );

              newData[index] = { ...newData[index], employeeId: value };
              setDataSource(newData);
            }}
            showSearch
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
          name={["role", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.role}
        >
          <Input
            placeholder=""
            onChange={(e) => {
              const newData = [...dataSource];
              const index = newData.findIndex(
                (item) => record.key === item.key
              );
              newData[index] = {
                ...newData[index],
                employeeId: e.target.value,
              };
              setDataSource(newData);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Эхлэх хугацаа",
      dataIndex: "startedDate",
      key: "startedDate",
      render: (_, record) => (
        <Form.Item
          name={["startedDate", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.startedDate}
        >
          <DatePicker
            defaultValue={dayjs("2015/01/01", dateFormat)}
            format={dateFormat}
          />
        </Form.Item>
      ),
    },
    {
      title: "Дуусах хугацаа",
      dataIndex: "endDate",
      key: "endDate",
      render: (_, record) => (
        <Form.Item
          name={["endDate", record.key]}
          rules={[{ required: true, message: "Нэр сонгох шаардлагатай" }]}
          initialValue={record.endDate}
        >
          <DatePicker
            defaultValue={dayjs("2015/01/01", dateFormat)}
            format={dateFormat}
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

  const employeeList = async function (params: any) {
    try {
      const record = await axios.post("/api/employee", {
        name: params,
      });
      if (record.data.success) {
        setEmployee(record.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    employeeList(search);
  }, [search]);

  return (
    <div>
      <div className="font-bold my-2 text-lg mx-4">
        3. Төслийн багийн бүрэлдэхүүн, тест хийх хуваарь
      </div>
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
  );
}
