"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useContext } from "react";
import Image from "next/image";
import { ReadDetail } from "../FullModal";

type DataType = {
  id: number;
  riskDescription: string;
  riskLevel: string;
  affectionLevel: string;
  mitigationStrategy: string;
  priceTotal: number;
};

export function ReadTestRisk() {
  const detailContext = useContext(ReadDetail);

  const columns: ColumnsType<DataType> = [
    {
      title: "Эрсдэл",
      dataIndex: "riskDescription",
      key: "riskDescription",
      render: (riskDescription) => riskDescription,
    },
    {
      title: "Эрсдлийн магадлал",
      dataIndex: "riskLevel",
      key: "riskLevel",
      render: (riskLevel) => riskLevel,
    },
    {
      title: "Эрсдлийн нөлөөлөл",
      dataIndex: "affectionLevel",
      key: "affectionLevel",
      render: (affectionLevel) => affectionLevel,
    },
    {
      title: "Бууруулах арга зам",
      dataIndex: "mitigationStrategy",
      key: "mitigationStrategy",
      render: (mitigationStrategy) => mitigationStrategy,
    },
  ];

  return (
    <div>
      <li className="mb-2 mt-4">4.1 Хараат байдал</li>

      <Table
        rowKey="id"
        dataSource={detailContext.riskassessment}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}
