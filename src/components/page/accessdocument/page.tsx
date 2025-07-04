"use client";
import React, { useState, useCallback } from "react";
import { Table, Input, Flex, Badge, Modal, Button, Form } from "antd";
import { formatHumanReadable, convertName } from "@/components/usable";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import { ListDataType } from "@/types/type";
import axios from "axios";
import { globalState } from "@/app/store";
import { useSession } from "next-auth/react";

export function AccessList({ documents, total, pageSize, page, order }: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const router = useRouter();
  const { data: session } = useSession();
  const { setDocumentId, getNotification, setPlanNotification } = globalState();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [id, setId] = useState(0);

  const handleOk = async () => {
    const values = await form.validateFields();
    const data = {
      documentId: id,
      userId: session?.user.id,
      rejection: values.rejection,
      cause: 0,
    };
    const response = await axios.patch("/api/rejection", data);
    if (response.data.success) {
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
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
                  redirect(`/home/access/${document.id}`);
                }}
              />
            )}
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
      <Modal
        title="Тайлбар оруулна уу"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item name="rejection">
            <Input.TextArea
              style={{ marginTop: 10 }}
              placeholder="Яагаад буцаах болсон тухай тайлбар оруулна уу..."
              rows={10}
            />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
