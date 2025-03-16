"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReadDetail } from "../FullModal";
import { useContext } from "react";
import { convertName } from "@/components/usable";

type DataType = {
  key: number;
  name: string;
  employee: {
    firstname: string;
    lastname: string;
    jobPosition: string;
  };
  role: string;
};

export function ReadTestDocument() {
  const detailContext = useContext(ReadDetail);
  const columns: ColumnsType<DataType> = [
    {
      title: "Нэр",
      dataIndex: "employee",
      key: "employee",
      render: (employee) =>
        convertName({
          firstname: employee.firstname,
          lastname: employee.lastname,
        }),
    },
    {
      title: "Албан тушаал",
      dataIndex: "employee",
      key: "employee",
      render: (employee) => employee.jobPosition.name,
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (role) => role,
    },
  ];
  return (
    <Table
      rowKey="id"
      dataSource={detailContext.departmentEmployeeRole}
      columns={columns}
      pagination={false}
      bordered
    />
  );
}
