"use client";
import React, { useState, useCallback } from "react";
import { Table, Pagination, Input, Flex } from "antd";
import { formatHumanReadable, convertName } from "@/components/usable";
import { ListDataType } from "@/types/type";
import { Badge } from "@/components/ui/badge";
import { mongollabel } from "@/components/usable";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FullModal } from "../modals/FullModal";

export default function ListDocument({
  documents,
  total,
  pageSize,
  page,
  order,
}: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [find, findId] = useState(0);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      router.push(`/home/list?${params.toString()}`);
    },
    [router, pageSize]
  );

  return (
    <section>
      <Flex gap={20}>
        <Input.Search
          placeholder="Тушаалаар хайх"
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
              <span>
                {formatHumanReadable(new Date(timeCreated).toISOString())}
              </span>
            )}
          />
          <Table.Column
            title="Харах"
            dataIndex="id"
            render={(id: number) => (
              <Image
                src="/eye.svg"
                alt=""
                width={20}
                height={20}
                className="hover:cursor-pointer"
                onClick={showModal}
              />
            )}
          />
          <Table.Column
            title="Төлөв"
            dataIndex="state"
            align="center"
            width={80}
            render={(state) => (
              <Badge
                variant={state === "FORWARD" ? "info" : "destructive"}
                className="py-1"
              >
                {mongollabel(state)}
              </Badge>
            )}
          />
        </Table>
      </div>
      <FullModal
        open={isModalOpen}
        handleOk={handleOk}
        onCancel={handleCancel}
        detailId={find}
      />
    </section>
  );
}
