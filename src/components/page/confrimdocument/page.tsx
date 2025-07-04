"use client";
import { useCallback, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Table, Flex, Input, Button } from "antd";
import { ListDataType } from "@/types/type";
import { convertName, formatHumanReadable } from "@/components/usable";
import Image from "next/image";
import { globalState } from "@/app/store";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

export function ConfirmDocument({
  documents,
  total,
  pageSize,
  page,
  order,
}: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const router = useRouter();
  const { setDocumentId } = globalState();
  const { data: session } = useSession();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      const params = new URLSearchParams({
        page: "1",
        pageSize: pageSize.toString(),
        order: value || "",
      });
      router.push(`/home/confirm?${params.toString()}`);
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
                  redirect(`/home/confirm/${document.id}`);
                }}
              />
            )}
          />
          <Table.Column
            title="Баталгаажуулах"
            dataIndex="documentId"
            render={(documentId: number, record: any) => {
              return record.rode ? (
                <Badge variant="viewing" className="py-1">
                  Баталгаажсан
                </Badge>
              ) : (
                <Button
                  type="primary"
                  onClick={async () => {
                    await axios.patch("/api/document/confirm", {
                      authUser: session?.user.id,
                      access: 1,
                    });
                    router.refresh();
                  }}
                >
                  Баталгаажуулах
                </Button>
              );
            }}
          />
        </Table>
      </div>
    </section>
  );
}
