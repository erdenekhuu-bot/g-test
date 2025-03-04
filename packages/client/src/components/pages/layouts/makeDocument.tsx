"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Upload,
  Card,
  Avatar,
  Tooltip,
  Modal,
  Form,
  Input,
  Steps,
  Dropdown,
  Menu,
  Pagination,
} from "antd";
import { ListDataType } from "@/types/type";
import type { UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  formatHumanReadable,
  convertName,
  selectConvert,
} from "@/components/usable";
import { Cards } from "@/components/Card";
import { ReportTestSchedule } from "@/components/ReportTestSchedule";
import { ReportTestError } from "@/components/ReportTestError";
import { ReportTestCase } from "@/components/ReportTestCase";
import Image from "next/image";

const { Dragger } = Upload;
const { TextArea } = Input;

export default function MakeDocument() {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [modalText, setModalText] = useState("Content of the modal");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [click, setClick] = useState(false);
  const [order, setOrder] = useState("");
  const [id, findId] = useState(0);
  const [getData, setData] = useState<any[]>([]);
  const [modalStep, setModalStep] = useState(0);

  const [firstReport] = Form.useForm();
  const [secondReport] = Form.useForm();
  const [thirdReport] = Form.useForm();

  const showModal = () => {
    setModalStep(3);
  };

  const handleNext = async () => {
    try {
      // const values = await firstReport.validateFields();
      // const requestData = {
      //   reportname: values.testname,
      //   reportpurpose: values.testpurpose,
      //   reportprocessing: values.testprocessing,
      //   name: values.name.slice(1),
      //   role: values.role.slice(1),
      //   started: values.started.slice(1),
      //   ended: values.ended.slice(1),
      // };
      // console.log(
      //   await axios.post(
      //     `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/report`,
      //     {
      //       data: requestData,
      //     }
      //   )
      // );
      // const values = await secondReport.validateFields();
      // const requestData = {
      //   reportadvice: values.advice,
      //   reportconclusion: values.conclusion,
      //   list: values.list.slice(1),
      //   level: values.level.slice(1).map((level: any) => selectConvert(level)),
      //   value: values.solve.slice(1),
      //   reportId: "ba9dff8a-5696-4bf2-9e21-06bd063c5ca4",
      // };
      // console.log(
      //   await axios.post(
      //     `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/report/issue`,
      //     {
      //       data: requestData,
      //     }
      //   )
      // );
      const values = await thirdReport.validateFields();
      const requestData = {
        category: values.category.slice(1).map((e: any) => selectConvert(e)),
        division: values.division.slice(1),
        result: values.result.slice(1),
        steps: values.steps.slice(1),
        types: values.types.slice(1).map((e: any) => selectConvert(e)),
        reportId: "ba9dff8a-5696-4bf2-9e21-06bd063c5ca4",
      };
      console.log(requestData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setModalStep(0);
  };

  const fetching = async function () {
    try {
      const record = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/filter`,
        {
          authUserId: 1,
          pagination: {
            page: page,
            pageSize: pageSize,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_TOKEN}`,
          },
        }
      );
      if (record.data.success === true) {
        setData(record.data.data);
        setPage(record.data.page + 1);
      }
    } catch (error) {}
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/fileupload/${id}`,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetching();
  }, [page, pageSize]);

  return (
    <section>
      <p className="text-end mb-8 customscreen:hidden">
        <Button className="bg-[#01443F] text-white p-6" onClick={showModal}>
          Тестийн тайлан үүсгэх
        </Button>
      </p>
      {/* <Modal
        open={modalStep === 1}
        onOk={handleNext}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={1000}
        className="scrollbar"
        style={{ overflowY: "auto", maxHeight: "800px" }}
      >
        <Form className="p-6" form={firstReport}>
          <div className="flex justify-between text-xl">
            <b>"ЖИМОБАЙЛ" ХХК</b>
            <b>001-ТӨ-МТГ</b>
          </div>
          <div className="mt-8">
            <Form.Item
              name="testname"
              rules={[{ required: true, message: "Тестийн нэр!" }]}
            >
              <Input size="middle" placeholder="Тестийн нэр бичнэ үү..." />
            </Form.Item>
          </div>
          <b>ЗОРИЛГО</b>
          <div className="mt-8">
            <Form.Item
              name="testpurpose"
              rules={[{ required: true, message: "Тестийн зорилго!" }]}
            >
              <Input size="middle" placeholder="Тестийн зорилго бичнэ үү..." />
            </Form.Item>
          </div>
          <div>
            <p className="my-4 font-bold">
              ТЕСТЭД БАГИЙН БҮРЭЛДЭХҮҮН, ТЕСТ ХИЙСЭН ХУВААРЬ
            </p>
            <ReportTestSchedule />
          </div>
          <b>ТЕСТИЙН ЯВЦЫН ТОЙМ</b>
          <div className="mt-8">
            <Form.Item
              name="testprocessing"
              rules={[{ required: true, message: "Тестийн нэр!" }]}
            >
              <Input
                size="middle"
                placeholder="Тестийн танилцуулга бичнэ үү..."
              />
            </Form.Item>
          </div>
        </Form>
      </Modal> */}
      {/* <Modal
        open={modalStep === 2}
        onOk={handleNext}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={1000}
        className="scrollbar"
        style={{ overflowY: "auto", maxHeight: "800px" }}
      >
        <Form className="p-6" form={secondReport}>
          <div className="flex justify-between text-xl">
            <b>"ЖИМОБАЙЛ" ХХК</b>
            <b>001-ТӨ-МТГ</b>
          </div>
          <div>
            <p className="my-4 font-bold">ТЕСТИЙН ҮЕИЙН АЛДААНЫ БҮРТГЭЛ</p>
            <ReportTestError />
          </div>
          <div className="mt-8">
            <p className="my-4 font-bold">ТЕСТИЙН ДҮГНЭЛТ</p>
            <Form.Item
              name="conclusion"
              rules={[{ required: true, message: "Дүгнэлт!" }]}
            >
              <Input size="middle" placeholder="Тестийн дүгнэлт бичнэ үү..." />
            </Form.Item>
          </div>
          <b>ЗӨВЛӨГӨӨ</b>
          <div className="mt-8">
            <Form.Item
              name="advice"
              rules={[{ required: true, message: "Зөвлөгөө!" }]}
            >
              <Input size="middle" placeholder="Зөвлөгөө бичнэ үү..." />
            </Form.Item>
          </div>
        </Form>
      </Modal> */}
      <Modal
        open={modalStep === 3}
        onOk={handleNext}
        onCancel={handleCancel}
        width={1000}
        className="scrollbar"
        style={{ overflowY: "auto", maxHeight: "800px" }}
      >
        <Form form={thirdReport}>
          <ReportTestCase />
        </Form>
      </Modal>
      <div className="bg-white">
        <Table<ListDataType>
          dataSource={getData}
          pagination={false}
          rowKey="id"
        >
          <Table.Column
            title="Тоот"
            dataIndex="generate"
            sortDirections={["descend"]}
            render={(generate: any, id: any) => (
              <div
                className="hover:cursor-pointer"
                onClick={() => {
                  findId(id.id);
                  setClick(true);
                  setOrder(generate);
                }}
              >
                {generate}
              </div>
            )}
          />
          <Table.Column title="Тестийн нэр" dataIndex="title" />

          <Table.Column
            title="Үүсгэсэн ажилтан"
            dataIndex="user"
            render={(user: any) => <span>{convertName(user.employee)}</span>}
          />

          <Table.Column
            title="Огноо"
            dataIndex="timeCreated"
            render={(timeCreated: string) => (
              <span>{formatHumanReadable(timeCreated)}</span>
            )}
          />
          <Table.Column
            title="Үйлдэл"
            dataIndex="id"
            render={(id: string) => (
              <Image
                src="/download.svg"
                alt=""
                width={30}
                height={30}
                className="hover:cursor-pointer"
                onClick={() => {
                  alert(1);
                }}
              />
            )}
          />
        </Table>
      </div>
      <div className="flex justify-end my-6">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={getData.length}
          onChange={(newPage: number, newPageSize: number) => {
            setPage(newPage);
            setPageSize(newPageSize);
          }}
        />
      </div>
      {click && (
        <Dragger {...props}>
          <p className="my-6">
            <Button icon={<UploadOutlined />} type="primary" className="p-6">
              Файл оруулах
            </Button>
          </p>
          <p className="ant-upload-text opacity-50">
            Уг тесттэй хамаарал бүхий тушаал оруулна уу. {order}
          </p>
        </Dragger>
      )}

      {click && <Cards documentId={id} />}
      {/* <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={800}
      >
        <p>Ангилал</p>
        <p className="font-bold text-lg">
          LIME app дээр "Халаасны дата" цэс шалгах
        </p>
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
        <div className="border-t border-b py-4 my-6">
          {sampleModal.map((item: any, index: number) => (
            <p key={index}>{index + ". " + item.index}</p>
          ))}
        </div>
        <div>
          <TextArea rows={4} />
        </div>
        <div className=" my-4">
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <FileImageOutlined />
            </p>
            <p className="ant-upload-text">Зураг оруулах</p>
          </Dragger>
        </div>
      </Modal> */}
    </section>
  );
}
