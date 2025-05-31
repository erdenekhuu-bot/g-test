"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useContext } from "react";
import { ReportEmployeeContext } from "@/components/window/full/FullReport";

interface DataType {
  key: number;
  total: number;
  spent: number;
  excess: number;
}

export function ReadReportBudget() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const context = useContext(ReportEmployeeContext);

  const columns: ColumnsType<DataType> = [
    {
      title: "Нийт авсан мөнгөн дүн",
      dataIndex: "total",
      key: "total",
      render: (total) => total,
    },

    {
      title: "Нийт зарцуулсан дүн",
      dataIndex: "spent",
      key: "spent",

      render: (spent) => spent,
    },
    {
      title: "Төсөвөөс хэтэрсэн дүн",
      dataIndex: "excess",
      key: "excess",

      render: (excess) => excess,
    },
  ];
  return (
    <div>
      <Table
        dataSource={context?.budget}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}
