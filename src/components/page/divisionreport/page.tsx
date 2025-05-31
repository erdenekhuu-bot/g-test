"use client";

import { Table, Button, Badge, Flex } from "antd";
import Image from "next/image";
import { useState } from "react";
import type { TableColumnsType } from "antd";
import { FullReport } from "@/components/window/full/FullReport";
import axios from "axios";
import { useRouter } from "next/navigation";

export type DivisionReportType = {
  id?: number;
  firstname: string;
  jobPosition: any;
  hasReports: boolean;
  reportItem?: any;
};

export function DivisionReport({
  documents,
  total,
  pageSize,
  page,
  order,
}: any) {
  const [find, findId] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const showModal = (id: number) => {
    findId(id);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
  };

  let mhn = documents.flatMap((item: any) => {
    if (!item.report || item.report.length === 0) {
      return [
        {
          id: item.id,
          firstname: item.firstname,
          jobPosition: item.jobPosition,
          hasReports: false,
        },
      ];
    }
    return item.report.map((reportItem: any) => ({
      id: item.id,
      firstname: item.firstname,
      jobPosition: item.jobPosition,
      rode: item.rode,
      hasReports: true,
      reportItem,
    }));
  });

  const columns: TableColumnsType<DivisionReportType> = [
    {
      title: "Нэрс",
      dataIndex: "firstname",
      key: "firstname",
      render: (_, record: DivisionReportType) => (
        <span>{record.firstname}</span>
      ),
    },
    {
      title: "Албан тушаал",
      dataIndex: "jobPosition",
      key: "jobPosition",
      render: (_, record: DivisionReportType) => (
        <span>{record.jobPosition?.name || "-"}</span>
      ),
    },
    {
      title: "Тайлан",
      key: "report",
      width: 300,
      render: (_, record: DivisionReportType) => (
        <Flex>{record.hasReports ? record.reportItem?.reportname : "-"}</Flex>
      ),
    },
    {
      title: "Төлөв",
      key: "report",
      render: (_, record: DivisionReportType) => {
        return (
          <div>
            {record.hasReports ? (
              record.reportItem.rode ? (
                <Badge status="success" text="Уншсан" />
              ) : (
                <Badge status="processing" text="Шинэ" />
              )
            ) : (
              <Badge status="error" text="Байхгүй" />
            )}
          </div>
        );
      },
    },

    {
      title: "Харах",
      key: "id",
      render: (_, record: DivisionReportType) =>
        record.hasReports ? (
          <Image
            src="/eye.svg"
            alt=""
            width={20}
            height={20}
            className="hover:cursor-pointer"
            onClick={() => showModal(record.reportItem.id)}
          />
        ) : (
          <span>-</span>
        ),
    },
    {
      title: "Устгах",
      key: "id",
      render: (_, record: DivisionReportType) =>
        record.hasReports ? (
          <Button
            type="dashed"
            onClick={async () => {
              await axios.delete(
                `/api/document/delete/${record.reportItem.id}`
              );
              router.refresh();
            }}
          >
            Устгах
          </Button>
        ) : (
          <span>-</span>
        ),
    },
  ];

  return (
    <section>
      <Table<DivisionReportType>
        dataSource={mhn}
        columns={columns}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
        }}
        rowKey="id"
      />
      {find && (
        <FullReport
          open={isModalOpen}
          handleOk={handleOk}
          onCancel={handleCancel}
          detailId={find}
        />
      )}
    </section>
  );
}
