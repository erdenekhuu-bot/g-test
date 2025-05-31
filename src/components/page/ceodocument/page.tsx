"use client";
import React, { useState, useCallback } from "react";
import { Table, Input, Flex, Badge, message } from "antd";
import { formatHumanReadable, convertName } from "@/components/usable";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import { ListDataType } from "@/types/type";
import axios from "axios";
import { globalState } from "@/app/store";

export function CeoDocument({ documents, total, pageSize, page, order }: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { setDocumentId } = globalState();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      const params = new URLSearchParams({
        page: "1",
        pageSize: pageSize.toString(),
        order: value || "",
      });
      router.push(`/home/list?${params.toString()}`);
    },
    [router, pageSize]
  );

  const handleDownload = async (id: number) => {
    try {
      const response = await axios.get(`/api/download/${id}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Удирдамж_${id}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      messageApi.error("Амжилтгүй боллоо.");
    }
  };
  return (
    <section>
      <Flex gap={20}>
        <Input.Search
          placeholder="Тоотоор хайх"
          value={searchTerm}
          onChange={handleSearchChange}
          allowClear
          style={{ width: 400 }}
        />
      </Flex>
      <div className="bg-white mt-8">
        {contextHolder}
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
            dataIndex="document"
            render={(document: any) => (
              <Flex gap={5} justify="space-between" align="center">
                <div>{document.generate}</div>
              </Flex>
            )}
          />
          <Table.Column
            title="Тестийн нэр"
            dataIndex="document"
            render={(document: any) => document.title}
          />
          <Table.Column
            title="Төлөв"
            dataIndex="rode"
            render={(rode: boolean) => {
              return (
                <div>
                  {rode ? (
                    <Badge status="success" text="Уншсан" />
                  ) : (
                    <Badge status="processing" text="Шинэ" />
                  )}
                </div>
              );
            }}
          />

          <Table.Column
            title="Тушаал"
            dataIndex="order"
            render={() => <span>-</span>}
          />

          <Table.Column
            title="Үүсгэсэн ажилтан"
            dataIndex="document"
            render={(document: any) => convertName(document.user.employee)}
          />

          <Table.Column
            title="Огноо"
            dataIndex="startedDate"
            sorter={(a, b) =>
              new Date(a.startedDate).getTime() -
              new Date(b.startedDate).getTime()
            }
            render={(startedDate: string) => (
              <span>
                {formatHumanReadable(new Date(startedDate).toISOString())}
              </span>
            )}
          />
          <Table.Column
            title="Шалгах"
            dataIndex="document"
            render={(document: any) => (
              <Image
                src="/eye.svg"
                alt=""
                width={20}
                height={20}
                className="hover:cursor-pointer"
                onClick={() => {
                  setDocumentId(document.id);
                  redirect(`/home/ceo/${document.id}`);
                }}
              />
            )}
          />
          <Table.Column
            title="PDF"
            dataIndex="documentId"
            render={(documentId) => {
              return (
                <Flex justify="center">
                  <Image
                    src="/download.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="hover:cursor-pointer"
                    onClick={() => handleDownload(documentId)}
                  />
                </Flex>
              );
            }}
          />
          {/* <Table.Column
              title="Буцаах"
              dataIndex="documentId"
              render={(documentId) => {
                return (
                  <Button
                    type="dashed"
                    onClick={async () => {
                      await axios.put("/api/final", {
                        authuserId: session?.user.id,
                        documentId,
                        reject: 1,
                      });
                      if (session?.user.id) {
                        getNotification(session.user.id);
                        setPlanNotification(session.user.id);
                      }
                      router.refresh();
                    }}
                  >
                    Буцаах
                  </Button>
                );
              }}
            /> */}
        </Table>
      </div>
    </section>
  );
}
