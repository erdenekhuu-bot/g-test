"use client";
import { Modal, Form } from "antd";
import { ReportTestCase } from "./report/ReportTestCase";
import { ReportContext } from "./CreateReportModal";
import { useContext } from "react";
import { selectConvert } from "../usable";
import axios from "axios";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
};

export function ThirdReportStep({ open, onCancel }: ModalProps) {
  const [thirdReport] = Form.useForm();
  const reportId = useContext(ReportContext);
  console.log(reportId);
  const handleSubmit = async () => {
    try {
      const values = await thirdReport.validateFields();
      console.log(values);
      const caseData = {
        category: values.category
          .slice(1)
          .map((index: any) => selectConvert(index)),
        division: values.division.slice(1),
        result: values.result.slice(1),
        steps: values.steps.slice(1),
        types: values.types.slice(1).map((index: any) => selectConvert(index)),
        reportId: reportId,
      };
      console.log(caseData);
      const request = await axios.post("/api/report/testcase", caseData);
      console.log(request);
      if (request.data.success) {
        onCancel();
      }
    } catch (error) {}
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
      </Form>
    </Modal>
  );
}
