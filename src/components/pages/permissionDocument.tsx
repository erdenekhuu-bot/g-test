"use client";
import React, { useState, useCallback } from "react";
import { Table, Input, Dropdown, Steps, Modal, Form, Button, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  formatHumanReadable,
  convertName,
  mongollabel,
} from "@/components/usable";
import type { MenuProps } from "antd";
import { ListDataType } from "@/types/type";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { FullModal } from "../modals/FullModal";
import { CreateReportModal } from "../modals/CreateReportModal";
import { useRouter } from "next/navigation";

export default function PermissionDocument({
  documents,
  total,
  pageSize,
  page,
  order,
}: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [findId, setFindId] = useState<number | null>(null);
  const [ordering, setOrder] = useState("");
  const [trigger, setTrigger] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const showOrder = () => {
    setOpen(true);
  };

  const items = (id: number): MenuProps["items"] => [
    {
      label: (
        // <span
        //   onClick={async () => {
        //     await axios.patch(`/api/document/detail/${id}`, {
        //       reject: 2,
        //     });
        //     router.refresh();
        //   }}
        // >
        //   Цохох
        // </span>
        <span onClick={showOrder}>Цохох</span>
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
            await axios.patch(`/api/document/detail/${id}`, {
              reject: 0,
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setOpen(false);
  };

  const menu = (
    <Menu
      items={[
        { key: "1", label: "Option 1" },
        { key: "2", label: "Option 2" },
        { key: "3", label: "Option 3" },
      ]}
    />
  );
  return (
    <section>
      <Input.Search
        placeholder="Тушаалаар хайх"
        value={searchTerm}
        onChange={handleSearchChange}
        allowClear
        style={{ width: 400 }}
      />
      <div className="text-end mb-8 ">
        {trigger && <CreateReportModal generate={order} detailId={findId} />}
      </div>
      <div className="bg-white">
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
            render={(generate: string, record: any) => (
              <span
                className="hover:cursor-pointer"
                onClick={() => {
                  setOrder(generate);
                  setFindId(Number(record.id));
                  setTrigger(true);
                }}
              >
                {generate}
              </span>
            )}
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
                onClick={() => {
                  showModal();
                  setFindId(id);
                }}
              />
            )}
          />

          <Table.Column
            title="Төлөв"
            dataIndex="id"
            align="center"
            width={80}
            render={(id: number, record: any) => (
              <Dropdown menu={{ items: items(id) }}>
                <Badge
                  variant="info"
                  className="py-1"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  {mongollabel(record.state)}
                </Badge>
              </Dropdown>
            )}
          />
        </Table>
      </div>

      <FullModal
        open={isModalOpen}
        handleOk={handleOk}
        onCancel={handleCancel}
        detailId={findId}
      />

      <Modal open={open} onOk={handleOk} onCancel={handleCancel} width={900}>
        <Form className="p-4 flex gap-x-8">
          <div className="flex-1 w-2/4">
            <div className="flex justify-between items-center">
              НХМаягт БМ - 6
              <p className="w-60 text-[12px]">
                Сангийн сайдын 2017 оны 12 дугаар сарын 5-ны өдрийн 347 тоот
                тушаалын хавсралт
              </p>
            </div>

            <div className="text-center my-4">
              ШААРДАХ ХУУДАС № <span className="underline">2024/0000/1</span>
            </div>
            <div className="flex my-4 justify-between">
              <span>Жимобайл ХХК</span>
              <span>2023 он 9 сар 27 өдөр</span>
            </div>
            <div className="my-2">
              <Input placeholder="Хэнээс" />
              <p className="text-center opacity-40">(Овог нэр, албан тушаал)</p>
            </div>
            <div className="my-2">
              <Input placeholder="Хаана" />
              <p className="text-center opacity-40">(Цех, тасаг, алба)</p>
            </div>
            <div className="my-2">
              <Input placeholder="Зориулалт" />
            </div>
          </div>
          <div className="w-1/4">
            <Steps
              direction="vertical"
              size="default"
              current={0}
              className="min-h-96"
              items={[
                { title: "Хянасан" },
                { title: "Зөвшөөрсөн" },
                {
                  description: (
                    <Dropdown overlay={menu} trigger={["click"]}>
                      <Button type="link">
                        Select an option <DownOutlined />
                      </Button>
                    </Dropdown>
                  ),
                },
                { title: "Хүлээгдэж байгаа" },
              ]}
            />
          </div>
        </Form>
      </Modal>
    </section>
  );
}
