"use client";
import { Form, Input, Table, Button, Select, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import Image from "next/image";
import { capitalizeFirstLetter, convertUtil } from "@/components/usable";

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
    if (search) {
      fetchEmployees(search);
    } else {
      setEmployee([]);
    }
  }, [search, fetchEmployees]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Албан тушаал/Ажилтны нэр",
      dataIndex: "employeeId",
      key: "employeeId",
      render: (_, record, index) => (
        <Form.Item name={["testschedule", index, "employeeId"]}>
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={convertUtil(getEmployee)}
            onSearch={handleSearch}
            filterOption={false}
            showSearch
          />
        </Form.Item>
      ),
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (_, record, index) => (
        <Form.Item name={["testschedule", index, "role"]}>
          <Input.TextArea rows={1} style={{ resize: "none" }} />
        </Form.Item>
      ),
    },
    {
      title: "Эхлэх хугацаа",
      dataIndex: "startedDate",
      key: "startedDate",
      render: (_, record, index) => (
        <Form.Item name={["testschedule", index, "startedDate"]}>
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
      render: (_, record, index) => (
        <Form.Item name={["testschedule", index, "endDate"]}>
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
