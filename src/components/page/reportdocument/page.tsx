"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Flex, Input, Table } from "antd";
import { ListDataType } from "@/types/type";
import {
  convertName,
  formatHumanReadable,
  mongollabel,
} from "@/components/usable";
import { Badge } from "@/components/ui/badge";

export function Report({ documents, total, pageSize, page, order }: any) {
  const [searchTerm, setSearchTerm] = useState<string>(order);
  const router = useRouter();

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
            dataIndex="statement"
            render={(statement: string) =>
              statement ? <span>{statement}</span> : <span>-</span>
            }
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
            title="Төлөв"
            dataIndex="state"
            align="center"
            width={80}
            render={(state) => (
              <Badge variant="info" className="py-1">
                {mongollabel(state)}
              </Badge>
            )}
          />
        </Table>
      </div>
    </section>
  );
}
