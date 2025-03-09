"use client";
import {
  Card,
  Avatar,
  Badge,
  Flex,
  Modal,
  Select,
  Input,
  Upload,
  Divider,
} from "antd";
import type { UploadProps, GetProp, UploadFile } from "antd";
import { PlusOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { convertStatus, mongollabel, mergeLetter } from "../usable";
import { TestCaseAction } from "../modals/TestCaseAction";

import Image from "next/image";

const { TextArea } = Input;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const Cards = ({ documentId }: any) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [testid, setTestId] = useState(0);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

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
    <div className="mt-8 flex justify-evenly min-h-[500px]">
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
          data?.testcase.map(
            (item: any, index: number) =>
              item.testType === "CREATED" && (
                <div
                  key={index}
                  className="bg-white p-6 my-8 rounded-lg border z-20"
                >
                  <Flex justify="space-between">
                    <Flex gap={8}>
                      <Badge status={convertStatus(item.category)} />
                      <span className="opacity-70">
                        {mongollabel(item.category)}
                      </span>
                    </Flex>
                    <EllipsisOutlined
                      className="hover:cursor-pointer text-lg"
                      onClick={() => {
                        showModal();
                        setTestId(item.id);
                      }}
                    />
                  </Flex>
                  <p className="my-2 font-bold ">{item.result}</p>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.steps.replace(/\n/g, "<br />"),
                    }}
                  />
                  <Avatar.Group className="mt-8">
                    {data?.documentemployee.map((item: any, index: number) => (
                      <Avatar
                        key={index}
                        style={{ backgroundColor: "#00569E" }}
                      >
                        {mergeLetter(item.employee)}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                </div>
              )
          )}
      </Card>
      <Card
        title=""
        style={{ backgroundColor: "#F8F9FA" }}
        className=" w-[350px] mx-10 z-0"
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Тест хийгдэж эхэлсэн</span>
          <p>
            <PlusOutlined className="mr-4 hover:cursor-pointer text-lg" />
            <EllipsisOutlined className="hover:cursor-pointer text-lg" />
          </p>
        </div>
        {loading &&
          data?.testcase.map(
            (item: any, index: number) =>
              item.testType === "STARTED" && (
                <div
                  key={index}
                  className="bg-white p-6 my-8 rounded-lg border z-20"
                >
                  <Flex justify="space-between">
                    <Flex gap={8}>
                      <Badge status={convertStatus(item.category)} />
                      <span className="opacity-70">
                        {mongollabel(item.category)}
                      </span>
                    </Flex>
                    <EllipsisOutlined
                      className="hover:cursor-pointer text-lg"
                      onClick={showModal}
                    />
                  </Flex>
                  <p className="my-2 font-bold ">{item.result}</p>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.steps.replace(/\n/g, "<br />"),
                    }}
                  />
                  <Avatar.Group className="mt-8">
                    {data?.documentemployee.map((item: any, index: number) => (
                      <Avatar
                        key={index}
                        style={{ backgroundColor: "#00569E" }}
                      >
                        {mergeLetter(item.employee)}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                </div>
              )
          )}
      </Card>

      <Card
        title=""
        style={{ backgroundColor: "#F8F9FA" }}
        className=" w-[350px] mx-10 z-0"
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Дууссан</span>
          <p>
            <PlusOutlined className="mr-4 hover:cursor-pointer text-lg" />
            <EllipsisOutlined className="hover:cursor-pointer text-lg" />
          </p>
        </div>
        {loading &&
          data?.testcase.map(
            (item: any, index: number) =>
              item.testType === "ENDED" && (
                <div
                  key={index}
                  className="bg-white p-6 my-8 rounded-lg border z-20"
                >
                  <Flex justify="space-between">
                    <Flex gap={8}>
                      <Badge status={convertStatus(item.category)} />
                      <span className="opacity-70">
                        {mongollabel(item.category)}
                      </span>
                    </Flex>
                    <EllipsisOutlined
                      className="hover:cursor-pointer text-lg"
                      onClick={showModal}
                    />
                  </Flex>
                  <p className="my-2 font-bold ">{item.result}</p>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.steps.replace(/\n/g, "<br />"),
                    }}
                  />
                  <Avatar.Group className="mt-8">
                    {data?.documentemployee.map((item: any, index: number) => (
                      <Avatar
                        key={index}
                        style={{ backgroundColor: "#00569E" }}
                      >
                        {mergeLetter(item.employee)}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                </div>
              )
          )}
      </Card>

      <TestCaseAction
        open={open}
        handleOk={handleOk}
        confirmLoading={confirmLoading}
        handleCancel={handleCancel}
        testid={testid}
      />
    </div>
  );
};
