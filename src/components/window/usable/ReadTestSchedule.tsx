"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useContext } from "react";
import { convertName, formatHumanReadable } from "@/components/usable";
import { ActionDetail } from "../full/Action";

type DataType = {
  key: number;
  employee: any;
  role: string;
  startedDate: Date;
  endDate: Date;
};

export function ReadTestSchedule() {
  const detailContext = useContext(ActionDetail);

  const columns: ColumnsType<DataType> = [
    {
      title: "Албан тушаал/Ажилтны нэр",
      dataIndex: "employee",
      key: "employee",
      render: (employee: any) => convertName(employee),
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (role) => role,
    },
    {
      title: "Эхлэх хугацаа",
      dataIndex: "startedDate",
      key: "startedDate",
      render: (startedDate) => formatHumanReadable(startedDate),
    },
    {
      title: "Дуусах хугацаа",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => formatHumanReadable(endDate),
    },
  ];

  return (
    <div>
      <div className="font-bold my-2 text-lg mx-4">
        3. Төслийн багийн бүрэлдэхүүн, тест хийх хуваарь
      </div>
      <Table
        rowKey="id"
        dataSource={detailContext?.documentemployee}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}
