"use client";
import React, { useState, useEffect } from "react";
import { Table, Pagination, Steps, Button, Layout } from "antd";
import axios from "axios";
import {
  formatHumanReadable,
  convertName,
  mongollabel,
} from "@/components/usable";
import { ListDataType } from "@/types/type";
import { SecondCheckout } from "../modals/checkmissing/SecondCheckout";
import { CreateDocumentModal } from "../modals/CreateDocumentModal";
import { CreateReportModal } from "../modals/CreateReportModal";
import { ThirdCheckout } from "../modals/checkmissing/ThirdCheckout";
import { FirstCheckout } from "../modals/checkmissing/FirstCheckout";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Cards } from "../ui/Card";

const { Dragger } = Upload;
const { Content } = Layout;

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
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

export default function MakeDocument() {
  const [getData, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
    total: number;
  }>();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );
  const [click, setClick] = useState(false);
  const [find, findId] = useState(0);
  const [order, setOrder] = useState("");

  const handleCloseModal = () => {
    setActiveStep(null);
  };

  const fetching = async function () {
    try {
      const record = await axios.post(`/api/document/filter`, {
        page: page,
        pageSize: pageSize,
      });
      if (record.data.success) {
        setPagination(record.data.pagination);
        setData(record.data.data);
        setPage(record.data.page + 1);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetching();
  }, [page, pageSize]);

  return (
    <section>
      <div className="text-end mb-8 ">
        <CreateReportModal />
      </div>
      <div className="bg-white">
        <Table<ListDataType>
          dataSource={getData}
          pagination={false}
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
            title="Тушаал"
            dataIndex="order"
            render={() => <span>-</span>}
          />

          <Table.Column
            title="Үүсгэсэн ажилтан"
            dataIndex="user"
            render={(user: any) => <span>{convertName(user.employee)}</span>}
          />

          <Table.Column
            title="Огноо"
            dataIndex="timeCreated"
            sorter={(a, b) =>
              new Date(a.timeCreated).getTime() -
              new Date(b.timeCreated).getTime()
            }
            render={(timeCreated: string) => (
              <span>{formatHumanReadable(timeCreated)}</span>
            )}
          />

          <Table.Column
            title="Төлөв"
            dataIndex="id"
            align="center"
            width={80}
            render={(id: number) => (
              <Steps
                current={0}
                percent={25}
                items={[
                  {
                    onClick: () => {
                      setActiveStep(0), setSelectedDocumentId(id);
                    },
                  },
                  {
                    onClick: () => {
                      setActiveStep(1), setSelectedDocumentId(id);
                    },
                  },
                  {
                    onClick: () => {
                      setActiveStep(2), setSelectedDocumentId(id);
                    },
                  },
                ]}
              />
            )}
          />
        </Table>
      </div>
      <div className="flex justify-end my-6">
        <Pagination
          current={pagination?.page}
          pageSize={pagination?.pageSize}
          total={pagination?.total}
          onChange={(newPage: number, newPageSize: number) => {
            setPage(newPage);
            setPageSize(newPageSize);
          }}
        />
      </div>

      {click && (
        <Dragger {...props}>
          <p className="my-6">
            <Button icon={<UploadOutlined />} type="primary" className="p-6">
              Файл оруулах
            </Button>
          </p>
          <p className="opacity-50">
            Уг тесттэй хамаарал бүхий тушаал оруулна уу. <b>{order}</b>
          </p>
        </Dragger>
      )}

      {click && <Cards documentId={find} />}

      {/* {activeStep === 0 && (
        <FirstCheckout
          open={true}
          onCancel={handleCloseModal}
          documentId={selectedDocumentId}
        />
      )}

      {activeStep === 1 && (
        <SecondCheckout
          open={true}
          onCancel={handleCloseModal}
          documentId={selectedDocumentId}
        />
      )}
      {activeStep === 2 && (
        <ThirdCheckout
          open={true}
          onCancel={handleCloseModal}
          documentId={selectedDocumentId}
        />
      )} */}
    </section>
  );
}
