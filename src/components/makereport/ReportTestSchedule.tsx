"use client";
import { Form, Input, Table, Button, Select, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Image from "next/image";

interface DataType {
  key: number;
  name: string;
  role: string;
  started: string;
  ended: string;
}

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";

export function ReportTestSchedule() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);

  const handleAdd = () => {
    const newData: DataType = {
      key: nextKey,
      name: "",
      role: "",
      started: "",
      ended: "",
    };
    setDataSource([...dataSource, newData]);
    setNextKey(nextKey + 1);
  };

  const handleDelete = (key: number) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Нэр",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (_, record, index) => (
        <Form.Item name={["reportschedule", index, "name"]}>
          <Input placeholder="" />
        </Form.Item>
      ),
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (_, record, index) => (
        <Form.Item name={["reportschedule", index, "role"]}>
          <Input placeholder="" />
        </Form.Item>
      ),
    },
    {
      title: "Эхлэх хугацаа",
      dataIndex: "started",
      key: "started",
      render: (_, record, index) => (
        <Form.Item name={["reportschedule", index, "started"]}>
          <DatePicker
            defaultValue={dayjs("2015/01/01", dateFormat)}
            format={dateFormat}
          />
        </Form.Item>
      ),
    },
    {
      title: "Дуусах хугацаа",
      dataIndex: "ended",
      key: "ended",
      render: (_, record, index) => (
        <Form.Item name={["reportschedule", index, "ended"]}>
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
    <>
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
    </>
  );
}
