"use client";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Input, Form, Modal, Card, Flex } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { ReadReportTestSchedule } from "@/components/makereport/read/ReadReportTestSchedule";
import { ReadReportTestError } from "@/components/makereport/read/ReadReportTestError";
import { ReadReportTestCase } from "@/components/makereport/read/ReadReportTestCase";
import { ReadUsedPhone } from "@/components/makereport/read/ReadUsedPhone";
import Link from "next/link";

type ModalProps = {
  open?: boolean;
  handleOk?: () => void;
  onCancel?: () => void;
  detailId?: any;
};

dayjs.extend(customParseFormat);

export const ReportEmployeeContext = createContext<any | null>(null);

export function FullReport({ open, onCancel, handleOk, detailId }: ModalProps) {
  const [mainForm] = Form.useForm();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const detail = async function ({ id }: { id: number }) {
    try {
      setLoading(true);
      const request = await axios.get(`/api/report/make/${id}`);
      if (request.data.success) {
        setData(request.data.data);
        const formValues = {
          testname: request.data.data.reportname,
          testpurpose: request.data.data.reportpurpose,
          testprocessing: request.data.data.reportprocessing,
          advice: request.data.data.reportadvice,
          conclusion: request.data.data.reportconclusion,
        };

        mainForm.setFieldsValue(formValues);
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    detailId && detail({ id: detailId });
  }, [detailId]);

  console.log(data);
  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
    >
      <ReportEmployeeContext.Provider value={data}>
        <Form className="p-6" form={mainForm}>
          <div className="flex justify-between text-xl">
            <b>"ЖИМОБАЙЛ" ХХК</b>
          </div>
          <div className="mt-8">
            <Form.Item
              name="testname"
              rules={[{ required: true, message: "Тестийн нэр!" }]}
            >
              <Input
                size="middle"
                placeholder="Тестийн нэр бичнэ үү..."
                readOnly
              />
            </Form.Item>
          </div>
          <b>ЗОРИЛГО</b>
          <div className="mt-8">
            <Form.Item
              name="testpurpose"
              rules={[{ required: true, message: "Тестийн зорилго!" }]}
            >
              <Input
                size="middle"
                placeholder="Тестийн зорилго бичнэ үү..."
                readOnly
              />
            </Form.Item>
          </div>
          <div>
            <p className="my-4 font-bold">
              ТЕСТЭД БАГИЙН БҮРЭЛДЭХҮҮН, ТЕСТ ХИЙСЭН ХУВААРЬ
            </p>
            <ReadReportTestSchedule />
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
                readOnly
              />
            </Form.Item>
          </div>

          <div>
            <p className="my-4 font-bold">ТЕСТИЙН ҮЕИЙН АЛДААНЫ БҮРТГЭЛ</p>
            <ReadReportTestError />
          </div>
          <div className="mt-8">
            <p className="my-4 font-bold">ТЕСТИЙН ДҮГНЭЛТ</p>
            <Form.Item
              name="conclusion"
              rules={[{ required: true, message: "Дүгнэлт!" }]}
            >
              <Input
                size="middle"
                placeholder="Тестийн дүгнэлт бичнэ үү..."
                readOnly
              />
            </Form.Item>
          </div>
          <b>ЗӨВЛӨГӨӨ</b>
          <div className="mt-8">
            <Form.Item
              name="advice"
              rules={[{ required: true, message: "Зөвлөгөө!" }]}
            >
              <Input
                size="middle"
                placeholder="Зөвлөгөө бичнэ үү..."
                readOnly
              />
            </Form.Item>
          </div>
          <ReadReportTestCase />
          <ReadUsedPhone />

          {data?.file?.map((item: any, index: number) => (
            <Card
              key={index}
              title="Хавсаргасан файл"
              variant="outlined"
              style={{ width: 300, margin: "30px 0" }}
            >
              <Flex gap={10} align="center">
                <FileSearchOutlined className="text-5xl hover:cursor-pointer" />
                <Link href={item.path}>{item.fileName}</Link>
              </Flex>
            </Card>
          ))}
        </Form>
      </ReportEmployeeContext.Provider>
    </Modal>
  );
}
