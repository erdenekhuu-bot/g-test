"use client";
import React, { useState, useEffect, createContext } from "react";
import {
  Table,
  Button,
  Form,
  Pagination,
  Steps,
  Popover,
  Input,
  Modal,
} from "antd";
import axios from "axios";
import {
  mongollabel,
  formatHumanReadable,
  convertName,
} from "@/components/usable";
import { ListDataType } from "@/types/type";
import { FirstStep } from "@/components/modal/FirstStep";
import { SecondStep } from "@/components/modal/SecondStep";
import { ThirdStep } from "@/components/modal/ThirdStep";
import { MainDocumentModal } from "@/components/modal/MainDocumentModal";

export default function CreateDocument() {
  const [getData, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
      const record = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/filter`,
        {
          authUserId: 1,
          pagination: {
            page: page,
            pageSize: pageSize,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_TOKEN}`,
          },
        }
      );
      if (record.data.success) {
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

  // const handleOk = async () => {
  //   try {
  //     const userId = 1;
  //     const values = await form.validateFields();
  //     setConfirmLoading(true);

  //     const record = await axios.post(
  //       `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/create`,
  //       {
  //         title: values.title,
  //         authuserId: userId,
  //         intro: values.intro,
  //         aim: values.aim,
  //         state: "DENY",
  //       }
  //     );

  //     if (record.data.success) {
  //       localStorage.setItem("documentId", record.data.data.id);
  //       setTimeout(() => {
  //         setOpen(false);
  //         setConfirmLoading(false);
  //       }, 200);
  //     }
  //     fetching();
  //     form.resetFields();
  //   } catch (error) {}
  // };

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
          current={page}
          pageSize={pageSize}
          total={getData.length}
          onChange={(newPage: number, newPageSize: number) => {
            setPage(newPage);
            setPageSize(newPageSize);
          }}
        />
      </div>
      <MainDocumentModal
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      />
      {/* {activeStep === 0 && (
        <FirstStep
          open={true}
          onCancel={handleCloseModal}
          documentId={selectedDocumentId}
        />
      )} */}
      {/* {activeStep === 1 && (
        <SecondStep
          open={true}
          onCancel={handleCloseModal}
          documentId={selectedDocumentId}
        />
      )} */}
      {/* {activeStep === 2 && (
        <ThirdStep
          open={true}
          onCancel={handleCloseModal}
          documentId={selectedDocumentId}
        />
      )} */}
    </section>
  );
}
