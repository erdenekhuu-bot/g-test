"use client";

import { Table, Flex, message, Badge } from "antd";
import Image from "next/image";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { globalState } from "@/app/store";
import axios from "axios";
import { convertName, formatHumanReadable } from "@/components/usable";
import { ListDataType } from "@/types/type";

export function MangerDocument({
  documents,
  total,
  pageSize,
  page,
  order,
}: any) {
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
      router.push(`/home/manager?${params.toString()}`);
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
    <div>
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
          render={(generate) => (
            <Flex gap={5} justify="space-between" align="center">
              <div>{generate}</div>
            </Flex>
          )}
        />
        <Table.Column
          title="Тестийн нэр"
          dataIndex="title"
          render={(title) => title}
        />
        <Table.Column
          title="Төлөв"
          dataIndex="state"
          render={(state: string) => {
            return (
              <div>
                {state === "ACCESS" ? (
                  <Badge status="success" text="Зөвшөөрөгдсөн" />
                ) : (
                  <Badge status="processing" text="Хүлээгдэж байгаа" />
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
          dataIndex="user"
          render={(user: any) => convertName(user.employee)}
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
        {/* <Table.Column
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
                      redirect(`/home/list/${document.id}`);
                    }}
                  />
                )}
              /> */}
        {/* <Table.Column
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
        /> */}
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
  );
}
