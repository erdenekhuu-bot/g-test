"use client";
import { Form, Input, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useContext } from "react";
import { humanreadphone } from "@/components/usable";
import { ReportEmployeeContext } from "@/components/window/full/FullReport";

interface DataType {
  key: number;
  type: string;
  phone: string;
  description: string;
}

export function ReadUsedPhone() {
  const detailContext = useContext(ReportEmployeeContext);

  const columns: ColumnsType<DataType> = [
    {
      title: "Дугаарын төрөл",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (type) => humanreadphone(type),
    },

    {
      title: "Дугаар",
      dataIndex: "phone",
      key: "phone",
      width: 200,
      render: (phone) => phone,
    },

    {
      title: "Тайлбар",
      dataIndex: "description",
      key: "description",
      render: (description) => description,
    },
  ];
  return (
    <div>
      <p className="mt-8 mb-4 font-bold text-lg">Ашигласан дугаарууд</p>
      <Table
        dataSource={detailContext?.usedphone}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}
