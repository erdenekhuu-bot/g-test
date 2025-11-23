"use client";

import { useParams, redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { ZUSTAND } from "@/app/zustand";
import { Breadcrumb, Layout, Table, Button, Badge } from "antd";

export default function Page() {
  const params = useParams();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const router = useRouter();
  const { getDocumentId } = ZUSTAND();
  const fetchDetail = async (id: number, page: number, pageSize: number) => {
    const request = await axios.get(`/api/document/testcase`, {
      params: {
        page,
        pageSize,
        id,
      },
    });
    if (request.data.success) {
      const dataWithKeys = request.data.data.map((item: any) => ({
        ...item,
        key: item.id,
      }));
      setData(dataWithKeys);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: request.data.total,
      });
    }
  };
  const handleTableChange = (pagination: any) => {
    setPagination({
      ...pagination,

      pageSize: pagination.pageSize || 10,
    });
  };
  useEffect(() => {
    if (Number(params.id)) {
      fetchDetail(Number(params.id), pagination.current, pagination.pageSize);
    }
  }, [Number(params.id), pagination.current, pagination.pageSize]);
  return (
    <Layout.Content>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: (
              <span
                style={{
                  cursor: "pointer",
                }}
              >
                Үндсэн хуудас руу буцах
              </span>
            ),
            onClick: () => redirect("/testcase"),
          },
          {
            title: "Кэйс шалгах",
          },
        ]}
      />

      <Table
        columns={[
          {
            title: "Кейсүүд",
            dataIndex: "types",
          },
          {
            title: "Төлөв",
            dataIndex: "testType",
            render: (state: string) => {
              return (
                <Badge
                  status={state === "CREATED" ? "error" : "success"}
                  text={state === "CREATED" ? "Эхэлсэн" : "Дууссан"}
                />
              );
            },
          },
          {
            title: "Үйлдэл",
            dataIndex: "id",
            render: (id: number) => (
              <Button
                type="primary"
                onClick={() => {
                  getDocumentId(id);
                  router.push(`/testcase/edit/${id}`);
                }}
              >
                Оруулах
              </Button>
            ),
          },
        ]}
        dataSource={data}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
        bordered
      />
    </Layout.Content>
  );
}
