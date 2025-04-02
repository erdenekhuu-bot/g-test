"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useContext } from "react";
import { humanreadexception } from "@/components/usable";
import { ReportEmployeeContext } from "@/components/window/full/FullReport";

interface DataType {
  key: number;
  list: string;
  level: string;
  solve: string;
}

export function ReadReportTestError() {
  const context = useContext(ReportEmployeeContext);

  const columns: ColumnsType<DataType> = [
    {
      title: "Алдааны жагсаалт",
      dataIndex: "list",
      key: "list",
      render: (list) => list,
    },
    {
      title: "Алдааны түвшин",
      dataIndex: "level",
      key: "level",
      width: 200,
      render: (level) => level,
    },
    {
      title: "Алдаа гарсан эсэх",
      dataIndex: "exception",
      key: "exception",
      width: 200,
      render: (exception) => humanreadexception(exception),
    },
    {
      title: "Шийдвэрлэсэн эсэх",
      dataIndex: "value",
      key: "value",
      render: (value) => value,
    },
  ];
  return (
    <div className="mb-8">
      <Table
        dataSource={context?.issue}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}
