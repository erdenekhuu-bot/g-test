"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Form, Pagination, Steps, Popover, Input } from "antd";
import axios from "axios";
import {
  formatHumanReadable,
  convertName,
  mongollabel,
} from "@/app/components/usable";
import { ListDataType } from "@/types/type";
import { MainDocumentModal } from "@/app/components/modals/MainDocumentModal";
import { SecondStep } from "@/app/components/modals/SecondStep";

export default function CreateDocument() {
  const [getData, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
    total: number;
  }>();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  const handleCloseModal = () => {
    setActiveStep(null);
  };

  const customDot =
    (documentId: number) =>
    (
      dot: React.ReactNode,
      { status, index }: { status: string; index: number }
    ) =>
      (
        <Popover
          content={
            <span>
              Хуудаслалт {index} {mongollabel(status)}
            </span>
          }
        >
          <span
            className="hover:cursor-pointer"
            onClick={() => {
              setSelectedDocumentId(documentId);
              handleStepClick(index);
            }}
          >
            {dot}
          </span>
        </Popover>
      );

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
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetching();
  }, [page, pageSize]);

  return (
    <section>
      <p className="text-end mb-8 customscreen:hidden">
        <Button className="bg-[#01443F] text-white p-6" onClick={showModal}>
          Тестийн төлөвлөгөө үүсгэх
        </Button>
      </p>
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
            title=""
            dataIndex="isFull"
            align="center"
            width={80}
            render={(isFull, record) => (
              <Steps
                current={isFull}
                progressDot={customDot(record.id)}
                items={[{ title: "1" }, { title: "2" }, { title: "3" }]}
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
      {/* <MainDocumentModal
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      /> */}
      <SecondStep
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      />
    </section>
  );
}
