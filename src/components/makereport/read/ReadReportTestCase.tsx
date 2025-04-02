"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useContext } from "react";
import { ReportEmployeeContext } from "@/components/window/full/FullReport";

type DataType = {
  id: number;
  category: string;
  types: string;
  steps: string;
  result: string;
  division: string;
  testType: string;
  description: string;
  timeCreated: string;
  timeUpdate: string;
  documentId: number;
};

export function ReadReportTestCase() {
  const detailContext = useContext(ReportEmployeeContext);

  const columns: ColumnsType<DataType> = [
    {
      title: "Ангилал",
      dataIndex: "category",
      key: "category",
      render: (category) => category,
    },
    {
      title: "Тестийн төрөл",
      dataIndex: "types",
      key: "types",
      render: (types) => types,
    },
    {
      title: "Тест хийх алхамууд",
      dataIndex: "steps",
      key: "steps",
      render: (steps) => <div style={{ whiteSpace: "pre-wrap" }}>{steps}</div>,
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      render: (result) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
      ),
    },
    {
      title: "Хариуцах нэгж",
      dataIndex: "division",
      key: "division",
      render: (division) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{division}</div>
      ),
    },
  ];

  return (
    <div className="mb-8">
      <p className="font-bold my-4">ТЕСТ КЭЙС</p>
      <Table
        dataSource={detailContext?.testcase}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
      />
    </div>
  );
}
