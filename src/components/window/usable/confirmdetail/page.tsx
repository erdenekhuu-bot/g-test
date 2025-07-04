"use client";
import { Table, Flex } from "antd";
import { useState, createContext, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { convertName, formatHumanReadable } from "@/components/usable";

dayjs.extend(customParseFormat);

export const ActionDetail = createContext<any | null>(null);

export function ConfirmDetail({ document }: any) {
  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    setDataSource(document.confirm);
  }, [document]);

  return (
    <section className="p-2 flex gap-x-8 h-screen">
      <section className="flex-1 w-3/4">
        <div className="flex justify-between text-xl mb-6">
          <b>"ЖИМОБАЙЛ" ХХК</b>
        </div>
        <div className="mt-8">
          <Flex gap={10}>
            <p>Газар, хэлтэс: </p>
            <p>{document.confirm[0].title}</p>
          </Flex>
        </div>
        <div className="mt-8">
          <Flex gap={10}>
            <p>Огноо: </p>
            <p>
              {formatHumanReadable(
                new Date(document.confirm[0].startedDate).toISOString()
              )}
            </p>
          </Flex>
        </div>
        <div className="mt-8">
          <Table
            dataSource={dataSource}
            pagination={false}
            bordered
            rowKey="key"
            columns={[
              {
                title: "Систем нэр",
                dataIndex: "system",
                key: "system",
                render: (system) => system,
              },
              {
                title: "Хийгдсэн ажлууд",
                dataIndex: "jobs",
                key: "jobs",
                render: (jobs) => jobs,
              },
              {
                title: "Шинэчлэлт хийгдсэн модул",
                dataIndex: "module",
                key: "module",
                render: (module) => module,
              },
              {
                title: "Хувилбар",
                dataIndex: "version",
                key: "version",
                render: (version) => version,
              },
              {
                title: "Тайлбар",
                dataIndex: "description",
                key: "description",
                render: (description) => description,
              },
              {
                title: "Хариуцагч",
                dataIndex: "employee",
                key: "employee",
                render: (employee: any) => convertName(employee),
              },
              {
                title: "Баталгаажсан эсэх",
                dataIndex: "rode",
                key: "rode",
                render: (rode) => (rode ? "Хянасан" : "Хянаагүй"),
              },
            ]}
          ></Table>
        </div>
      </section>
    </section>
  );
}
