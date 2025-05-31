"use client";
import { Modal, Form } from "antd";
import { ReportTestCase } from "./ReportTestCase";
import { ReportContext } from "./createreport";
import { useContext } from "react";
import { UsedPhone } from "./UsedPhone";
import axios from "axios";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  next: () => void;
};

export function ThirdReportStep({ open, onCancel, next }: ModalProps) {
  const [thirdReport] = Form.useForm();
  const { reportId, detailId } = useContext(ReportContext);

  const handleSubmit = async () => {
    try {
      const values = await thirdReport.validateFields();

      const mergin = {
        ...values,
        reportId,
        detailId,
      };
      const request = await axios.post("/api/report/testcase", mergin);
      if (request.data.success) {
        next();
      }
    } catch (error) {
      return;
    }
  };
  return (
    <Modal
      open={open}
      onOk={handleSubmit}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
    >
      <Form form={thirdReport}>
        <ReportTestCase />
        <UsedPhone />
      </Form>
    </Modal>
  );
}
