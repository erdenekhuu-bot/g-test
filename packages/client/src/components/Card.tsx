"use client";
import {
  Upload,
  Card,
  Modal,
  Input,
  Badge,
  Flex,
  Image,
  Avatar,
  Select,
} from "antd";
import { useState, useEffect } from "react";
import { PlusOutlined, EllipsisOutlined } from "@ant-design/icons";
import type { UploadProps, GetProp, UploadFile } from "antd";
import axios from "axios";
import NextImage from "next/image";
import { Detail } from "@/types/type";
import { mergeLetter } from "./usable";

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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [getData, setData] = useState<Detail>();
  const [getTeam, setTeam] = useState<any>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Зураг</div>
    </button>
  );

  const showModal = () => {
    setOpen(true);
  };

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

  useEffect(() => {
    if (documentId) {
      const fetchData = async () => {
        try {
          const [detail, team] = await Promise.all([
            axios.get(
              `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/list/${documentId}`
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/team/${documentId}`
            ),
          ]);

          if (detail.data.success) {
            setData(detail.data.data);
          }
          if (team.data.success) {
            setTeam(team.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [documentId]);

  return (
    <div className="mt-16 flex justify-center min-h-[700px]">
      <Card title="" className="bg-[#F8F9FA] w-[400px]  mx-10">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Кэйс</span>
          <p>
            <PlusOutlined className="mr-4 hover:cursor-pointer text-lg" />
            <EllipsisOutlined className="hover:cursor-pointer text-lg" />
          </p>
        </div>
        <div className="bg-white p-6 mt-8 rounded-lg">
          <Flex justify="space-between">
            <div className="flex items-center">
              <Badge status="success" />
              <p className="mx-2">Ангилал</p>
            </div>
            <EllipsisOutlined
              className="hover:cursor-pointer text-lg"
              onClick={showModal}
            />
          </Flex>
          {<p className="my-2 font-bold ">{getData?.testcase[0]?.result}</p>}
          <div
            dangerouslySetInnerHTML={{
              __html: getData?.testcase[0]?.steps.replace(/\n/g, "<br />"),
            }}
          />
          <Avatar.Group className="mt-8">
            {getData?.documentemployee.map((item: any, index: any) => (
              <Avatar style={{ backgroundColor: "#87d068" }}>
                {mergeLetter(item.employee)}
              </Avatar>
            ))}
          </Avatar.Group>
        </div>
      </Card>

      <Card title="" className="bg-[#F8F9FA] w-[350px] mx-10">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Тест хийгдэж эхэлсэн</span>
          <p>
            <PlusOutlined className="mr-4 hover:cursor-pointer text-lg" />
            <EllipsisOutlined className="hover:cursor-pointer text-lg" />
          </p>
        </div>
        {/* <div className="bg-white p-6 mt-8 rounded-lg">
          <p>Ангилал</p>
          <p className="my-2 font-bold ">
            LIME app дээр "Халаасны дата" цэс шалгах
          </p>
          {sampleCard.map((item: any, index: number) => (
            <p key={index}>{index + ". " + item.index}</p>
          ))}
          <Avatar.Group className="mt-8">
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
            <Link href="https://ant.design">
              <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
            </Link>
            <Tooltip title="Ant User" placement="top">
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
            </Tooltip>
            <Avatar
              style={{ backgroundColor: "#1677ff" }}
              icon={<AntDesignOutlined />}
            />
          </Avatar.Group>
        </div> */}
      </Card>
      <Card title="" className="bg-[#F8F9FA] w-[350px] mx-10">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Дууссан</span>
          <p>
            <PlusOutlined className="mr-4 hover:cursor-pointer text-lg" />
            <EllipsisOutlined className="hover:cursor-pointer text-lg" />
          </p>
        </div>
        {/* <div className="bg-white p-6 mt-8 rounded-lg">
          <p>Ангилал</p>
          <p className="my-2 font-bold ">
            LIME app дээр "Халаасны дата" цэс шалгах
          </p>
          {sampleCard.map((item: any, index: number) => (
            <p key={index}>{index + ". " + item.index}</p>
          ))}
          <Avatar.Group className="mt-8">
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
            <Link href="https://ant.design">
              <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
            </Link>
            <Tooltip title="Ant User" placement="top">
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
            </Tooltip>
            <Avatar
              style={{ backgroundColor: "#1677ff" }}
              icon={<AntDesignOutlined />}
            />
          </Avatar.Group>
        </div> */}
      </Card>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={800}
      >
        <Flex align="center" className="mb-4">
          <Badge status="success" />
          <p className="mx-2">Ангилал</p>
        </Flex>

        <Flex justify="space-between">
          <p className="font-bold text-lg">{getData?.testcase[0]?.result}</p>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Кэйсийн төлөв"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              {
                value: "1",
                label: "Эхэлсэн",
              },
              {
                value: "2",
                label: "Хүлээгдэж байгаа",
              },
              {
                value: "3",
                label: "Дууссан",
              },
            ]}
          />
        </Flex>
        <Avatar.Group className="mt-4">
          <Flex gap={4} align="center">
            <NextImage src="/users.svg" alt="" width={30} height={40} />
            {getTeam.length > 0 &&
              getTeam[0].employees.map((item: any, index: number) => (
                <Flex key={index} gap={4} className="opacity-60">
                  <p>{item.firstname}</p>
                  <p>{item.lastname + ","}</p>
                </Flex>
              ))}
          </Flex>
        </Avatar.Group>
        <div>
          <p>{getData?.testcase[0]?.steps}</p>
        </div>
        <div className="mt-4">
          <TextArea rows={4} style={{ resize: "none" }} />
        </div>
        <div className="my-4">
          <Upload
            action={`${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/imageupload/${getData?.testcase[0]?.id}`}
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            name="images"
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
