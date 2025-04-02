"use client";
import React, { useState, useCallback } from "react";
import { Table, Input, Flex, Button } from "antd";
import { formatHumanReadable, convertName } from "@/components/usable";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ListDataType } from "@/types/type";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ActionModal } from "@/components/window/full/Action";

export function List({ documents, total, pageSize, page, order }: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [find, findId] = useState<any | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

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

  const showModal = (id: number) => {
    findId(id);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      await axios.patch("/api/final/" + find, {
        authuserId: session?.user.id,
        access: 4,
        documentId: find,
      });
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {}
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
            sortDirections={["descend"]}
            render={(document: any) => document.generate}
          />
          <Table.Column
            title="Тестийн нэр"
            dataIndex="document"
            defaultSortOrder="descend"
            render={(document: any) => document.title}
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
            title="Харах"
            dataIndex="document"
            render={(document: any) => (
              <Image
                src="/eye.svg"
                alt=""
                width={20}
                height={20}
                className="hover:cursor-pointer"
                onClick={() => {
                  showModal(document.id);
                }}
              />
            )}
          />
          <Table.Column
            title="Төлөв"
            dataIndex="state"
            align="center"
            width={80}
            render={(state: any, record: any) => {
              return state === "DENY" ? (
                <Button
                  type="primary"
                  className="py-1"
                  onClick={async () => {
                    await axios.patch(`/api/document/`, {
                      authuserId: session?.user.id,
                      reject: 2,
                      documentId: record.document.id,
                    });
                    router.refresh();
                  }}
                >
                  Илгээх
                </Button>
              ) : (
                <Badge variant="info">Хянасан</Badge>
              );
            }}
          />
        </Table>
      </div>
      {/* {find && (
        <FullModal
          open={isModalOpen}
          handleOk={handleOk}
          onCancel={handleCancel}
          detailId={find}
        />
      )} */}
      {find && (
        <ActionModal
          open={isModalOpen}
          handleOk={handleOk}
          onCancel={handleCancel}
          detailId={find}
        />
      )}
    </section>
  );
}
