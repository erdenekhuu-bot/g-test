"use client";
import React, { useState, useEffect } from "react";
import { Table, Form, Pagination, Steps, Popover } from "antd";
import axios from "axios";
import {
  formatHumanReadable,
  convertName,
  mongollabel,
} from "@/components/usable";
import { ListDataType } from "@/types/type";
import { SecondCheckout } from "../modals/checkmissing/SecondCheckout";
import { CreateDocumentModal } from "../modals/CreateDocumentModal";
import { ThirdCheckout } from "../modals/checkmissing/ThirdCheckout";
import { FirstCheckout } from "../modals/checkmissing/FirstCheckout";

export default function CreateDocument() {
  const [getData, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(0);
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
  const showModal = () => {
    setOpen(true);
    setCurrentModal(1);
  };
  const handleNext = () => {
    setCurrentModal((prev) => prev + 1);
  };
  const handleCancel = () => {
    setOpen(false);
    setCurrentModal(0);
  };

  useEffect(() => {
    fetching();
  }, [page, pageSize]);

  return (
    <section>
      <div className="text-end mb-8 ">
        <CreateDocumentModal />
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

      {activeStep === 0 && (
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
      )}
    </section>
  );
}
