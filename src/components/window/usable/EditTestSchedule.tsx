"use client";
import { Form, Input, Table, Button, Select, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect, useContext, useCallback } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import Image from "next/image";
import { SecondContext } from "../edit/SecondDocument";

import { capitalizeFirstLetter, convertUtil } from "@/components/usable";

interface DataType {
  key: number;
  id: number;
  employeeId: string;
  role: string;
  startedDate: string;
  endDate: string;
}

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";

export function ReadTestSchedule() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [getEmployee, setEmployee] = useState<any>([]);
  const [search, setSearch] = useState("");
  const context = useContext(SecondContext);
  const [loading, setLoading] = useState(false);

  const detail = async function ({ id }: { id: any }) {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const updatedData = request.data.data.documentemployee.map(
          (data: any) => ({
            key: data.employee.id,
            id: data.employee.id,
            employeeId:
              data.employee.firstname + " " + data.employee.lastname || "",
            role: data.role || "",
            startedDate: data.startedDate || "",
            endDate: data.endDate || "",
          })
        );

        setDataSource(updatedData);
      }
    } catch (error) {}
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

  useEffect(() => {
    context && detail({ id: context });
  }, [context]);

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

  const handleAdd = () => {
    const newKey = Math.max(0, ...dataSource.map((item) => item.key)) + 1;
    const newData: DataType = {
      key: newKey,
      id: newKey,
      employeeId: "",
      role: "",
      startedDate: "",
      endDate: "",
    };
    setDataSource([...dataSource, newData]);
  };

  const handleDelete = (key: number) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleSearch = (value: any) => {
    setSearch(capitalizeFirstLetter(value));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Албан тушаал/Ажилтны нэр",
      dataIndex: "employeeId",
      key: "employeeId",
      render: (_, record, index) => (
        <Form.Item
          name={["testschedule", index, "employeeId"]}
          initialValue={record.employeeId}
        >
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={convertUtil(getEmployee)}
            filterOption={false}
            onSearch={handleSearch}
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
        <Form.Item
          name={["testschedule", index, "role"]}
          initialValue={record.role}
        >
          <Input placeholder="" />
        </Form.Item>
      ),
    },
    {
      title: "Эхлэх хугацаа",
      dataIndex: "startedDate",
      key: "startedDate",
      render: (_, record, index) => (
        <Form.Item
          name={["testschedule", index, "startedDate"]}
          initialValue={record.startedDate ? dayjs(record.startedDate) : null}
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
      render: (_, record, index) => (
        <Form.Item
          name={["testschedule", index, "endDate"]}
          initialValue={record.endDate ? dayjs(record.endDate) : null}
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
