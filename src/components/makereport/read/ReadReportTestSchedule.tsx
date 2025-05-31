"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useContext } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ReportEmployeeContext } from "../../window/full/FullReport";
import { formatHumanReadable, convertName, roleConvert } from "../../usable";

type DataType = {
  key: number;
  employee: any;
  role: string;
  startedDate: Date;
  endDate: Date;
};

dayjs.extend(customParseFormat);

export function ReadReportTestSchedule() {
  const context = useContext(ReportEmployeeContext);

  const columns: ColumnsType<DataType> = [
    {
      title: "Нэр",
      dataIndex: "employee",
      key: "employee",
      render: (employee: any) => convertName(employee),
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",

      render: (role) => roleConvert(role),
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
    <div className="mb-8">
      <Table
        dataSource={context && context?.document?.documentemployee}
        columns={columns}
        pagination={false}
        bordered
        rowKey="id"
      />
    </div>
  );
}
