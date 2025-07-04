"use client";
import React, { useState, useCallback } from "react";
import { Table, Input, Flex, message, Button } from "antd";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { globalState } from "@/app/store";
import { convertName, formatHumanReadable } from "@/components/usable";

export function SharedList({ documents, total, pageSize, page, order }: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const router = useRouter();
  const { data: session } = useSession();
  const [messageApi, contextHolder] = message.useMessage();
  const { getNotification, setDocumentId, setPlanNotification } = globalState();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      const params = new URLSearchParams({
        page: "1",
        pageSize: pageSize.toString(),
        order: value || "",
      });
      router.push(`/home/shared?${params.toString()}`);
    },
    [router, pageSize]
  );

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
        <Table<any>
          dataSource={documents}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
          }}
          rowKey="id"
        >
          <Table.Column title="Тоот" dataIndex="id" render={(id) => id} />
          <Table.Column
            title="Тестийн нэр"
            dataIndex="document"
            render={(document: any) => document.title}
          />

          <Table.Column
            title="Үүсгэсэн ажилтан"
            dataIndex="employee"
            render={(employee: any) => convertName(employee)}
          />

          <Table.Column
            title="Огноо"
            dataIndex="document"
            sorter={(a: any, b: any) =>
              new Date(a.document.timeCreated).getTime() -
              new Date(b.document.timeCreated).getTime()
            }
            render={(record: any) => {
              return (
                <span>
                  {formatHumanReadable(
                    new Date(record.timeCreated).toISOString()
                  )}
                </span>
              );
            }}
          />
          <Table.Column
            title="Шалгах"
            dataIndex="documentId"
            render={(documentId) => (
              <Image
                src="/eye.svg"
                alt=""
                width={20}
                height={20}
                className="hover:cursor-pointer"
                onClick={() => {
                  setDocumentId(documentId);
                  redirect(`/home/create/${documentId}`);
                }}
              />
            )}
          />

          <Table.Column
            title="Share хасах"
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
                  Хасах
                </Button>
              );
            }}
          />
        </Table>
      </div>
    </section>
  );
}
