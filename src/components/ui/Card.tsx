"use client";
import { Card, Avatar, Badge, Flex } from "antd";
import { PlusOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { convertStatus, mongollabel, mergeLetter } from "../usable";

const sampleCard: any[] = [
  {
    id: 1,
    index: "LIME апп руу нэвтэрч орох",
  },
  {
    id: 2,
    index: "Халаасны дата цэс харагдаж байгаа эсэх",
  },
];

export const Cards = ({ documentId }: any) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const detail = async function ({ id }: { id: string }) {
    try {
      setLoading(false);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        setData(request.data.data);
        setLoading(true);
      }
    } catch (error) {
      return;
    }
  };
  useEffect(() => {
    documentId && detail({ id: documentId });
  }, [documentId]);

  return (
    <div className="mt-8 flex justify-center min-h-[500px]">
      <Card
        title=""
        style={{ backgroundColor: "#F8F9FA" }}
        className=" w-[350px] mx-10 z-0"
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Кэйс</span>
          <p>
            <PlusOutlined className="mr-4 hover:cursor-pointer text-lg" />
            <EllipsisOutlined className="hover:cursor-pointer text-lg" />
          </p>
        </div>
        {loading &&
          data?.testcase.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white p-6 my-8 rounded-lg border z-20"
            >
              <Flex gap={8}>
                <Badge status={convertStatus(item.category)} />
                <span className="opacity-70">{mongollabel(item.category)}</span>
              </Flex>
              <p className="my-2 font-bold ">{item.result}</p>

              <div
                dangerouslySetInnerHTML={{
                  __html: item.steps.replace(/\n/g, "<br />"),
                }}
              />
              <Avatar.Group className="mt-8">
                {data?.documentemployee.map((item: any, index: number) => (
                  <Avatar key={index} style={{ backgroundColor: "#87d068" }}>
                    {mergeLetter(item.employee)}
                  </Avatar>
                ))}
              </Avatar.Group>
            </div>
          ))}
      </Card>
    </div>
  );
};
