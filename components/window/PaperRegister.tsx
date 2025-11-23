"use client";
import { Modal, Form, Table } from "antd";
import { ZUSTAND } from "@/app/zustand";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { convertName } from "@/lib/usable";
import { useEffect, useState } from "react";

export function PaperRegister() {
  const [data, setData] = useState([]);
  const { getCheckout, checkout, documentId } = ZUSTAND();
  const detail = async (id: number) => {
    const response = await axios.get("/api/paper/" + id);
    if (response.data.success) {
      const updatedData =
        response.data.data?.confirm?.flatMap((confirmItem: any) =>
          confirmItem.sub.map((subItem: any) => ({
            key: uuidv4(),
            id: subItem.id,
            jobs: subItem.jobs,
            module: subItem.module,
            system: subItem.system,
            version: subItem.version,
            description: subItem.description,
            employeeId: convertName(confirmItem.employee),
            check: confirmItem.check,
          }))
        ) || [];

      setData(updatedData);
    }
  };
  const handleCancel = () => {
    getCheckout(-1);
  };
  useEffect(() => {
    detail(documentId);
  }, [documentId]);
  return (
    <Modal
      open={checkout === 2}
      onCancel={handleCancel}
      width={1000}
      title="Баримтын дэлгэрэнгүй"
      onOk={handleCancel}
    >
      <div className="mt-8">
        <Table
          dataSource={data}
          pagination={false}
          bordered
          rowKey="key"
          columns={[
            {
              title: "Систем нэр",
              dataIndex: "system",
              key: "system",
            },
            {
              title: "Хийгдсэн ажлууд",
              dataIndex: "jobs",
              key: "jobs",
            },
            {
              title: "Шинэчлэлт хийгдсэн модул",
              dataIndex: "module",
              key: "module",
            },
            {
              title: "Хувилбар",
              dataIndex: "version",
              key: "version",
            },
            {
              title: "Тайлбар",
              dataIndex: "description",
              key: "description",
            },
            {
              title: "Хариуцагч",
              dataIndex: "employeeId",
              key: "employeeId",
            },
            {
              title: "Төлөв",
              dataIndex: "check",
              key: "check",
              render: (status: boolean) => {
                return (
                  <span>{status === true ? "Шалгагдсан" : "Шалгагдаагүй"}</span>
                );
              },
            },
          ]}
        />
      </div>
    </Modal>
  );
}
