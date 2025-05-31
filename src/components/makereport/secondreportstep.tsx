"use client";
import { Modal, Form, Input, Button } from "antd";
import { useContext } from "react";
import { ReportTestError } from "./ReportTestError";
import axios from "axios";
import { ReportContext } from "./createreport";
import { ReportBudget } from "./ReportBudget";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  next: () => void;
};

export function SecondReportStep({ open, onCancel, next }: ModalProps) {
  const [secondReport] = Form.useForm();
  const { reportId, detailId } = useContext(ReportContext);
  const handleNext = async () => {
    try {
      const values = await secondReport.validateFields();
      const budget = (values.reportbudget || []).map((item: any) => {
        return {
          total: parseInt(item.total),
          spent: parseInt(item.spent),
          excess: parseInt(item.excess),
        };
      });
      const requestData = {
        reportadvice: values.advice,
        reportconclusion: values.conclusion,
        reporttesterror: values.reporttesterror,
        reportId: reportId,
        reportbudget: budget,
      };

      const request = await axios.post(`/api/report/issue`, requestData);
      if (request.data.success) {
        next();
      }
    } catch (error) {}
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
        <div>
          <p className="my-4 font-bold">ТЕСТИЙН ҮЕИЙН ТӨСӨВ</p>
          <ReportBudget />
        </div>
        <div className="mt-8">
          <p className="my-4 font-bold">ТЕСТИЙН ДҮГНЭЛТ</p>
          <Form.Item
            name="conclusion"
            rules={[{ required: true, message: "Дүгнэлт!" }]}
          >
            <Input.TextArea
              rows={5}
              placeholder="Тестийн дүгнэлт бичнэ үү..."
              style={{ resize: "none" }}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>
        <b>ЗӨВЛӨГӨӨ</b>
        <div className="mt-8">
          <Form.Item
            name="advice"
            rules={[{ required: true, message: "Зөвлөгөө!" }]}
          >
            <Input.TextArea
              rows={5}
              placeholder="Зөвлөгөө бичнэ үү..."
              style={{ resize: "none" }}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
