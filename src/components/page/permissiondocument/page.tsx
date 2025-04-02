"use client";
import React, { useState, useCallback, createContext } from "react";
import { Table, Input, Dropdown, Steps, Modal, Form, Button, Menu } from "antd";
import axios from "axios";
import {
  formatHumanReadable,
  convertName,
  mongollabel,
} from "@/components/usable";
import type { MenuProps } from "antd";
import { ListDataType } from "@/types/type";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ActionModal } from "@/components/window/full/Action";
import { useSession } from "next-auth/react";

export const CheckContext = createContext<any | null>(null);

export function Permission({ documents, total, pageSize, page, order }: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [findId, setFindId] = useState<number | null>(null);
  const [ordering, setOrder] = useState("");
  const [trigger, setTrigger] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleOk = async () => {
    try {
      await axios.patch("/api/final/" + findId, {
        authuserId: session?.user.id,
        access: 4,
        documentId: findId,
      });
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {}
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setOpen(false);
  };

  const items = (id: number): MenuProps["items"] => [
    {
      label: (
        <span
          onClick={() => {
            showModal(id);
          }}
        >
          Баталгаажуулах
        </span>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <span
          onClick={async () => {
            await axios.patch(`/api/document/`, {
              authuserId: session?.user.id,
              reject: 0,
              documentId: id,
            });
            router.refresh();
          }}
        >
          Буцаах
        </span>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
  ];

  const showModal = (id: number) => {
    setFindId(id);
    setIsModalOpen(true);
  };

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      const params = new URLSearchParams({
        page: "1",
        pageSize: pageSize.toString(),
        order: value || "",
      });
      router.push(`/home/permission?${params.toString()}`);
    },
    [router, pageSize]
  );

  return (
    <section>
      <Input.Search
        placeholder="Тоотоор хайх"
        value={searchTerm}
        onChange={handleSearchChange}
        allowClear
        style={{ width: 400 }}
      />

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
            render={(document: any, record: any) => (
              <span
                className="hover:cursor-pointer"
                onClick={() => {
                  setOrder(document.generate);
                  setFindId(Number(record.id));
                  setTrigger(true);
                }}
              >
                {document.generate}
              </span>
            )}
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
            render={(document: any) => (
              <span>{convertName(document.user.employee)}</span>
            )}
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
            title="Төлөв"
            dataIndex="id"
            align="center"
            width={80}
            render={(id: number, record: any) => {
              return record.document.state != "ACCESS" ? (
                <Dropdown menu={{ items: items(record.document.id) }}>
                  <Badge
                    variant={record.state === "DENY" ? "info" : "destructive"}
                    className="py-1"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {mongollabel(record.document.state)}
                  </Badge>
                </Dropdown>
              ) : (
                <Badge
                  variant="info"
                  className="py-1"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Үзсэн
                </Badge>
              );
            }}
          />
        </Table>
      </div>

      {findId && (
        <ActionModal
          open={isModalOpen}
          handleOk={handleOk}
          onCancel={handleCancel}
          detailId={findId}
        />
      )}
    </section>
  );
}
