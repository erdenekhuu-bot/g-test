"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import { ReportContext } from "./createreport";
import Image from "next/image";

interface DataType {
  key: number;
  id: number;
  category: string;
  types: string;
  steps: string;
  result: string;
  division: string;
}

export function ReportTestCase() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const { reportId, detailId } = useContext(ReportContext);

  const detail = async function ({ id }: { id: any }) {
    try {
      setLoading(false);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const updatedData = request.data.data.testcase.map((testCase: any) => ({
          ...testCase,
          key: testCase.id,
        }));

        setDataSource(updatedData);
        setLoading(true);
      }
    } catch (error) {}
  };

  useEffect(() => {
    detailId && detail({ id: detailId });
  }, [detailId]);

  const handleAdd = () => {
    const newData: DataType = {
      key: Date.now(),
      id: Date.now(),
      category: "",
      types: "",
      steps: "",
      result: "",
      division: "",
    };
    setDataSource([...dataSource, newData]);
  };

  const handleDelete = (key: number) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

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
    <div>
      <div className="font-bold my-2 text-lg mx-4">5.3. Тестийн кэйс</div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}
