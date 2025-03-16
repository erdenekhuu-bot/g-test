"use client";
import React, { useState, useCallback } from "react";
import { Table, Button, Flex, Input } from "antd";
import axios from "axios";
import { formatHumanReadable } from "@/components/usable";
import { ListDataType } from "@/types/type";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Cards } from "../ui/Card";
import Image from "next/image";
import { FullModal } from "../modals/FullModal";
import { useRouter } from "next/navigation";
import { CreateReportModal } from "../modals/CreateReportModal";

const { Dragger } = Upload;

export default function MakeDocument({
  documents,
  total,
  pageSize,
  page,
  order,
}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [click, setClick] = useState(false);
  const [find, findId] = useState(0);
  const [ordering, setOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: `/api/fileupload/${find}`,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

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

  const handleCardsStateChange = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await axios.get(`/api/download/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${id}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <Flex gap={20} justify="space-between">
        <Input.Search
          placeholder="Тушаалаар хайх"
          value={searchTerm}
          onChange={handleSearchChange}
          allowClear
          style={{ width: 400 }}
        />
        <CreateReportModal generate={ordering} detailId={find} />
      </Flex>

      <div className="bg-white mt-8">
        <Table<ListDataType>
          dataSource={documents}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
          }}
          rowKey="id"
        >
          <Table.Column
            title="Тоот"
            dataIndex="generate"
            sortDirections={["descend"]}
            render={(generate: any, id: any) => (
              <div
                className="hover:cursor-pointer"
                onClick={() => {
                  findId(id.id);
                  setClick(true);
                  setOrder(generate);
                }}
              >
                {generate}
              </div>
            )}
          />
          <Table.Column
            title="Тестийн нэр"
            dataIndex="title"
            defaultSortOrder="descend"
          />

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
            title="Харах"
            dataIndex="id"
            render={(id: number) => (
              <Image
                src="/eye.svg"
                alt=""
                width={20}
                height={20}
                className="hover:cursor-pointer"
                onClick={showModal}
              />
            )}
          />

          <Table.Column
            title="Үйлдэл"
            dataIndex="id"
            render={(id: number) => (
              <Image
                src="/download.svg"
                alt=""
                width={20}
                height={20}
                className="hover:cursor-pointer"
                onClick={() => {
                  handleDownload(id);
                }}
              />
            )}
          />
        </Table>
      </div>

      {click && (
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
      <FullModal
        open={isModalOpen}
        handleOk={handleOk}
        onCancel={handleCancel}
        detailId={find}
      />
      {click && (
        <Cards documentId={find} onStateChange={handleCardsStateChange} />
      )}
    </section>
  );
}
