"use client";
import { useRouter } from "next/navigation";
import { Table, Steps, Dropdown, Button } from "antd";
import { useState, useCallback } from "react";
import type { TablePaginationConfig } from "antd/es/table";
import { convertName, formatHumanReadable } from "../usable";
import { FirstCheckout } from "../modals/checkmissing/FirstCheckout";
import { SecondCheckout } from "../modals/checkmissing/SecondCheckout";
import { ThirdCheckout } from "../modals/checkmissing/ThirdCheckout";
import { CreateDocumentModal } from "../modals/CreateDocumentModal";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

export default function CreateDocument({
  documents,
  total,
  pageSize,
  page,
  order,
}: any) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const handlePaginationChange = useCallback(
    (pagination: TablePaginationConfig) => {
      const newPage = pagination.current ?? page;
      const newPageSize = pagination.pageSize ?? pageSize;

      const params = new URLSearchParams({
        page: newPage.toString(),
        pageSize: newPageSize.toString(),
        order: searchTerm || "",
      });
      router.push(`/home/create?${params.toString()}`);
    },
    [router, page, pageSize, searchTerm]
  );

  const handleCloseModal = () => {
    setActiveStep(null);
  };

  return (
    <section>
      <div className="text-end mb-8 ">
        <CreateDocumentModal />
      </div>
      <Table<any>
        dataSource={documents}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
        }}
        onChange={handlePaginationChange}
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
          render={(timeCreated: string) => {
            return (
              <span>
                {formatHumanReadable(new Date(timeCreated).toISOString())}
              </span>
            );
          }}
        />

        <Table.Column
          title=""
          dataIndex="id"
          align="center"
          width={80}
          render={(id: number, record: any) => (
            <Steps
              current={record.isFull}
              percent={100}
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
        <Table.Column
          title="Төлөв"
          dataIndex="id"
          align="center"
          width={80}
          render={(id: number, record: any) =>
            record.state === "FORWARD" ? (
              <Badge
                variant="info"
                className="py-1"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Илгээсэн
              </Badge>
            ) : (
              <Button
                type="primary"
                disabled={record.isFull === 2 ? false : true}
                onClick={async () => {
                  await axios.patch(`/api/document/detail/${id}`, {
                    reject: 1,
                  });
                  router.refresh();
                }}
              >
                Илгээх
              </Button>
            )
          }
        />
      </Table>
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
