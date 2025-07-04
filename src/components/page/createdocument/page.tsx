"use client";
import { useRouter } from "next/navigation";
import { Table, Steps, Button, Flex, Input } from "antd";
import { useState, useCallback } from "react";
import type { TablePaginationConfig } from "antd/es/table";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { convertName, formatHumanReadable } from "@/components/usable";
import { FirstDocument } from "@/components/window/create/FirstDocument";
import { FirstRead } from "@/components/window/edit/FirstDocument";
import { SecondRead } from "@/components/window/edit/SecondDocument";
import { ThirdRead } from "@/components/window/edit/ThirdDocument";
import { useSession } from "next-auth/react";
import { globalState } from "@/app/store";
import { Share } from "@/components/window/usable/askshare/Share";
import { ConfirmEditDocument } from "@/components/window/edit/ConfirmDocument";
import { redirect } from "next/navigation";

export function Create({ documents, total, pageSize, page, order }: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const { data: session } = useSession();
  const { setDocumentId, documentId } = globalState();

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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      const params = new URLSearchParams({
        page: "1",
        pageSize: pageSize.toString(),
        order: value || "",
      });
      router.push(`/home/create?${params.toString()}`);
    },
    [router, pageSize]
  );

  const handleCloseModal = () => {
    setActiveStep(null);
  };

  return (
    <section>
      <div className="mb-8">
        <Flex gap={20} justify="space-between">
          <Input.Search
            placeholder="Тоотоор хайх"
            value={searchTerm}
            onChange={handleSearchChange}
            allowClear
            style={{ width: 400 }}
          />
          <FirstDocument />
        </Flex>
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
          title="Алхам"
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
                    setActiveStep(0), setDocumentId(id);
                  },
                },
                {
                  onClick: () => {
                    setActiveStep(1), setDocumentId(id);
                  },
                },
                {
                  onClick: () => {
                    setActiveStep(2), setDocumentId(id);
                  },
                },
                {
                  onClick: () => {
                    setActiveStep(3), setDocumentId(id);
                  },
                },
              ]}
            />
          )}
        />
        <Table.Column
          title="Хуваалцах"
          dataIndex="id"
          align="center"
          width={80}
          render={(id: number, record: any) => {
            return record.state === "SHARED" ? (
              <Badge
                variant="viewing"
                className="py-1 hover:cursor-pointer"
                onClick={() => {
                  redirect("/home/create/" + id);
                }}
              >
                SHARED
              </Badge>
            ) : (
              <Button
                color="cyan"
                variant="solid"
                onClick={() => {
                  setActiveStep(4);
                  setDocumentId(id);
                }}
              >
                SHARE
              </Button>
            );
          }}
        />
        <Table.Column
          title="Төлөв"
          dataIndex="id"
          align="center"
          width={80}
          render={(id: number, record: any) => {
            return record.state === "PENDING" ? (
              <Badge
                variant="secondary"
                className="py-1"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Хүлээгдэж байна
              </Badge>
            ) : record.state === "FORWARD" ? (
              <Badge variant="viewing" className="py-1">
                Хянагдаж байна
              </Badge>
            ) : record.state === "MIDDLE" ? (
              <Badge variant="viewing" className="py-1">
                Хянагдаж байна
              </Badge>
            ) : record.state === "ACCESS" ? (
              <Badge variant="info" className="py-1">
                Зөвшөөрөгдсөн
              </Badge>
            ) : record.state === "SHARED" ? (
              <Badge variant="secondary" className="py-1">
                Хуваалцсан
              </Badge>
            ) : (
              <Button
                type="primary"
                disabled={record.isFull === 2 ? false : true}
                onClick={async () => {
                  await axios.put(`/api/final/`, {
                    authuserId: session?.user.id,
                    reject: 1,
                    documentId: id,
                  });
                  router.refresh();
                }}
              >
                Илгээх
              </Button>
            );
          }}
        />
        <Table.Column
          title="Устгах"
          dataIndex="id"
          align="center"
          width={80}
          render={(id: number, record: any) => {
            return record.state === "ACCESS" ? null : (
              <Button
                type="dashed"
                onClick={async () => {
                  await axios.delete(`/api/document/delete/${id}`);
                  router.refresh();
                }}
              >
                Устгах
              </Button>
            );
          }}
        />
      </Table>
      {activeStep === 0 && (
        <FirstRead open={true} onCancel={handleCloseModal} />
      )}
      {activeStep === 1 && (
        <SecondRead open={true} onCancel={handleCloseModal} />
      )}
      {activeStep === 2 && (
        <ThirdRead open={true} onCancel={handleCloseModal} />
      )}

      {activeStep === 3 && (
        <ConfirmEditDocument open={true} onCancel={handleCloseModal} />
      )}

      {activeStep === 4 && <Share open={true} onCancel={handleCloseModal} />}
    </section>
  );
}
