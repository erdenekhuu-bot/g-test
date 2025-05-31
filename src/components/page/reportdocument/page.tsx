"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Flex, Input, Table, Button, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { convertName, formatHumanReadable } from "@/components/usable";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { globalState } from "@/app/store";

export function Report({ documents, total, pageSize, page, order }: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const { setPlanNotification, getNotification } = globalState();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      const params = new URLSearchParams({
        page: "1",
        pageSize: pageSize.toString(),
        order: value || "",
      });
      router.push(`/home/report?${params.toString()}`);
    },
    [router, pageSize]
  );

  const handlePaginationChange = useCallback(
    (pagination: TablePaginationConfig) => {
      const newPage = pagination.current ?? page;
      const newPageSize = pagination.pageSize ?? pageSize;
      const params = new URLSearchParams({
        page: newPage.toString(),
        pageSize: newPageSize.toString(),
        order: searchTerm || "",
      });
      router.push(`/home/report?${params.toString()}`);
    },
    [router, page, pageSize, searchTerm]
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

  const flattenedData = documents.reduce((acc: any[], curr: any) => {
    if (
      curr.authUser &&
      curr.authUser.Document &&
      curr.authUser.Document.length > 0
    ) {
      return [
        ...acc,
        ...curr.authUser.Document.map((doc: any) => ({
          authUser: curr.authUser.username,
          generate: doc.generate,
          title: doc.title,
          statement: doc.statement,
          employee: doc.user,
          timeCreated: doc.timeCreated,
          documentId: doc.id,
          state: doc.state,
        })),
      ];
    }
    return acc;
  }, []);

  return (
    <section>
      {contextHolder}
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
        <Table<any>
          dataSource={flattenedData}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
          }}
          rowKey="id"
          onChange={handlePaginationChange}
        >
          <Table.Column
            title="Тоот"
            dataIndex="generate"
            defaultSortOrder="descend"
          />
          <Table.Column
            title="Тестийн нэр"
            dataIndex="title"
            defaultSortOrder="descend"
          />

          <Table.Column
            title="Тушаал"
            dataIndex="statement"
            render={(statement: string) =>
              statement ? <span>{statement}</span> : <span>-</span>
            }
          />
          <Table.Column
            title="Үүсгэсэн ажилтан"
            dataIndex="employee"
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
              <span>
                {formatHumanReadable(new Date(timeCreated).toISOString())}
              </span>
            )}
          />

          <Table.Column
            title="Зөвшөөрөл"
            dataIndex="documentId"
            align="center"
            width={80}
            render={(documentId: number, record: any) =>
              record.state === "FORWARD" ? (
                <Badge
                  variant="outline"
                  className="py-1"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Зөвшөөрөгдсөн
                </Badge>
              ) : record.state === "ACCESS" ? (
                <Badge variant="outline" className="py-1">
                  Батдагдсан
                </Badge>
              ) : (
                <Button
                  type="primary"
                  onClick={async () => {
                    await axios.put(`/api/final/`, {
                      authuserId: session?.user.id,
                      reject: 2,
                      documentId,
                    });
                    await axios.patch(`/api/final`, {
                      authuserId: session?.user.id,
                      reject: 3,
                      documentId,
                    });
                    if (session?.user?.id) {
                      setPlanNotification(session.user.id);
                      getNotification(session.user.id);
                    }
                    router.refresh();
                  }}
                >
                  Зөвшөөрөх
                </Button>
              )
            }
          />

          <Table.Column
            title="Үйлдэл"
            dataIndex="documentId"
            render={(documentId) => {
              return (
                <Image
                  src="/download.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="hover:cursor-pointer"
                  onClick={() => handleDownload(documentId)}
                />
              );
            }}
          />

          <Table.Column
            title="Төлөв"
            dataIndex="state"
            align="center"
            width={80}
            render={(id: number, record: any) =>
              record.state === "PENDING" ? (
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
              ) : record.state === "ACCESS" ? (
                <Badge variant="info" className="py-1">
                  Зөвшөөрөгдсөн
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
                    if (session?.user?.id) {
                      setPlanNotification(session.user.id);
                      getNotification(session.user.id);
                    }
                    router.refresh();
                  }}
                >
                  Илгээх
                </Button>
              )
            }
          />

          <Table.Column
            title="Устгах"
            dataIndex="documentId"
            align="center"
            width={80}
            render={(documentId: number) => (
              <Button
                type="dashed"
                onClick={async () => {
                  await axios.put("/api/final", {
                    authuserId: session?.user.id,
                    documentId,
                    reject: 0,
                  });
                  session?.user?.id && setPlanNotification(session.user.id);
                  router.refresh();
                }}
              >
                Буцаах
              </Button>
            )}
          />
        </Table>
      </div>
    </section>
  );
}
