"use client";
import React, { useState, useCallback } from "react";
import { Table, Button, Flex, Input, Upload, message } from "antd";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreateReportModal } from "@/components/makereport/createreport";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { formatHumanReadable } from "@/components/usable";
import { Cards } from "@/components/window/Card/Card";

const { Dragger } = Upload;

export function Make({ documents, total, pageSize, page, order }: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const router = useRouter();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [caseId, setTestCase] = useState<number>();
  const [ordering, setOrder] = useState<any | null>();
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );
  const [messageApi, contextHolder] = message.useMessage();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      const params = new URLSearchParams({
        page: "1",
        pageSize: pageSize.toString(),
        order: value || "",
      });
      router.push(`/home/document?${params.toString()}`);
    },
    [router, pageSize]
  );

  const handleTestCaseClick = async (documentId: number) => {
    setLoading(true);
    setSelectedDocumentId(documentId);
    setTestCase(documentId);

    try {
      setLoading(true);
      const response = await axios.get(`/api/document/detail/${documentId}`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {}
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: `/api/image/${selectedDocumentId}`,
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        messageApi.success(`${info.file.name} файл амжилттай хадгалагдлаа`);
      } else if (status === "error") {
        messageApi.error(`${info.file.name} файл оруулахад ажилтгүй боллоо.`);
      }
    },
    onDrop(e) {},
  };

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

  return (
    <section>
      {contextHolder}
      <Flex gap={20} justify="space-between">
        <Input.Search
          placeholder="Тоотоор хайх"
          value={searchTerm}
          onChange={handleSearchChange}
          allowClear
          style={{ width: 400 }}
        />
        {selectedDocumentId && ordering && (
          <CreateReportModal
            generate={ordering}
            detailId={selectedDocumentId}
          />
        )}
      </Flex>
      <div className="bg-white mt-8">
        <Table
          dataSource={documents}
          pagination={{ current: page, pageSize: pageSize, total: total }}
          rowKey="id"
        >
          <Table.Column
            title="Тоот"
            dataIndex="generate"
            render={(generate, record) => (
              <div
                className="hover:cursor-pointer"
                onClick={() => {
                  handleTestCaseClick(record.id);
                  setOrder(generate);
                }}
              >
                {generate}
              </div>
            )}
          />
          <Table.Column title="Тестийн нэр" dataIndex="title" />
          <Table.Column
            title="Огноо"
            dataIndex="timeCreated"
            sorter={(a, b) =>
              new Date(a.timeCreated).getTime() -
              new Date(b.timeCreated).getTime()
            }
            render={(timeCreated: string) => (
              <span>
                {formatHumanReadable(new Date(timeCreated).toISOString())}
              </span>
            )}
          />

          <Table.Column
            title="Үйлдэл"
            dataIndex="id"
            render={(id, record: any) => {
              return record.report ? (
                <Image
                  src="/download.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="hover:cursor-pointer"
                  onClick={() => handleDownload(id)}
                />
              ) : null;
            }}
          />
        </Table>
      </div>
      {selectedDocumentId && (
        <Dragger {...props}>
          <p className="my-6">
            <Button icon={<UploadOutlined />} type="primary" className="p-6">
              Файл оруулах
            </Button>
          </p>
          <p className="opacity-50">
            Уг тесттэй хамаарал бүхий тушаал оруулна уу. <b>{ordering}</b>
          </p>
        </Dragger>
      )}

      {selectedDocumentId && <Cards documentId={selectedDocumentId} />}
    </section>
  );
}
