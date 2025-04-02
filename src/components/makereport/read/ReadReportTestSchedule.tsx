"use client";
import { Table, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useContext } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ReportEmployeeContext } from "../../window/full/FullReport";
import { formatHumanReadable } from "../../usable";

interface DataType {
  key: number;
  name: string;
  role: string;
  started: string;
  ended: string;
}

dayjs.extend(customParseFormat);

export function ReadReportTestSchedule() {
  const context = useContext(ReportEmployeeContext);
  const columns: ColumnsType<DataType> = [
    {
      title: "Нэр",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name) => name,
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (role) => role,
    },
    {
      title: "Эхлэх хугацаа",
      dataIndex: "started",
      key: "started",
      render: (started) => formatHumanReadable(started),
    },
    {
      title: "Дуусах хугацаа",
      dataIndex: "ended",
      key: "ended",

      render: (ended) => formatHumanReadable(ended),
    },
  ];

  return (
    <div className="mb-8">
      <Table
        dataSource={context?.team}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}
