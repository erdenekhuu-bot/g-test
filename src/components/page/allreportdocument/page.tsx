"use client";

import { Table, Flex, message, Badge } from "antd";
import Image from "next/image";
import { useState } from "react";
import type { TableColumnsType } from "antd";
import { FullReport } from "@/components/window/full/FullReport";
import axios from "axios";
import { useRouter } from "next/navigation";
import { convertName, formatHumanReadable } from "@/components/usable";
import { useSession } from "next-auth/react";
import { globalState } from "@/app/store";

export type ReportType = {
  id: number;
  reportname: string;
  reportpurpose: string;
  reportprocessing: string;
  reportconclusion: string;
  reportadvice: string;
  employee: any;
  started: any;
};

export function ListReport({ documents, total, pageSize, page, order }: any) {
  const [find, findId] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [messageApi, contextHolder] = message.useMessage();
  const { takeReportNotification } = globalState();

  const handleDownload = async (id: number) => {
    try {
      const response = await axios.get(`/api/download/report/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Тайлан_${id}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      messageApi.error("Амжилтгүй боллоо.");
      return;
    }
  };

  const showModal = (id: number) => {
    findId(id);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    const response = await axios.patch("/api/reportnotification", {
      authUser: session?.user.id,
      reportId: find,
    });
    if (response.data.success && session?.user?.id) {
      setIsModalOpen(false);
      takeReportNotification(session.user.id);
      router.refresh();
    }
  };

  const columns: TableColumnsType<ReportType> = [
    {
      title: "Нэр",
      dataIndex: "employee",
      key: "employee",
      render: (employee: any) => convertName(employee[0]),
    },
    {
      title: "Албан тушаал",
      dataIndex: "employee",
      key: "employee",
      render: (employee: any) => employee[0]?.jobPosition.name,
    },
    {
      title: "Тайлан",
      dataIndex: "reportname",
      key: "reportname",
      width: 300,
      render: (reportname) => <Flex>{reportname}</Flex>,
    },
    {
      title: "Төлөв",
      dataIndex: "rode",
      key: "rode",
      render: (rode: boolean) => {
        return (
          <div>
            {rode ? (
              <Badge status="success" text="Уншсан" />
            ) : (
              <Badge status="processing" text="Шинэ" />
            )}
          </div>
        );
      },
    },
    {
      title: "Үйлдэл",
      dataIndex: "documentId",
      key: "documentId",
      render: (documentId) => (
        <Image
          src="/download.svg"
          alt=""
          width={20}
          height={20}
          className="hover:cursor-pointer"
          onClick={() => handleDownload(documentId)}
        />
      ),
    },

    {
      title: "Огноо",
      dataIndex: "started",
      key: "started",
      sorter: (a, b) =>
        new Date(a.started).getTime() - new Date(b.started).getTime(),
      render: (started: string) => (
        <span>{formatHumanReadable(new Date(started).toISOString())}</span>
      ),
    },
    {
      title: "Харах",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Image
          src="/eye.svg"
          alt=""
          width={20}
          height={20}
          className="hover:cursor-pointer"
          onClick={() => showModal(id)}
        />
      ),
    },
  ];

  return (
    <section>
      <Table<ReportType>
        dataSource={documents}
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
