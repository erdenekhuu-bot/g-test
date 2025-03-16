"use client";
import { Modal, Form, Input, Button } from "antd";
import { useContext } from "react";
import { ReportTestError } from "./report/ReportTestError";
import axios from "axios";
import { selectConvert } from "../usable";
import { ReportContext } from "./CreateReportModal";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  next: () => void;
};

export function SecondReportStep({ open, onCancel, next }: ModalProps) {
  const [secondReport] = Form.useForm();
  const reportId = useContext(ReportContext);

  const handleNext = async () => {
    try {
      const values = await secondReport.validateFields();
      const requestData = {
        reportadvice: values.advice,
        reportconclusion: values.conclusion,
        list: values.list.slice(1),
        level: values.level.slice(1).map((level: any) => selectConvert(level)),
        value: values.solve.slice(1),
        exception: values.exception.slice(1).map((item: any) => item),
        reportId: reportId,
      };
      const request = await axios.post(`/api/report/issue`, requestData);
      console.log(request);
      if (request.data.success) {
        next();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={open}
      onOk={next}
      onCancel={onCancel}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
      footer={[
        <Button key="back" onClick={onCancel}>
          Цуцлах
        </Button>,
        <Button key="next" type="primary" onClick={handleNext}>
          Дараах
        </Button>,
      ]}
    >
      <Form form={secondReport} className="p-6">
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
    </Modal>
  );
}
