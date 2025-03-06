"use client";
import { Modal, Form } from "antd";
import { TestCase } from "./TestCase";
import { useState } from "react";
import { selectConvert } from "../usable";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  confirmLoading?: boolean;
  onOk?: () => void;
  documentId?: number | null;
};

export function ThirdStep({
  open,
  confirmLoading,
  onOk,
  onCancel,
  documentId,
}: ModalProps) {
  const [data, setData] = useState<any>([]);
  const [caseForm] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await caseForm.validateFields();

      const caseData = {
        category: values.category
          .slice(1)
          .map((index: any) => selectConvert(index)),
        division: values.division.slice(1),
        result: values.result.slice(1),
        steps: values.steps.slice(1),
        types: values.types.slice(1).map((index: any) => selectConvert(index)),
      };
      console.log(caseData);
    } catch (error) {}
  };
  return (
    <Modal
      open={open}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
    >
      <Form form={caseForm} className="p-6">
        <div className="flex justify-between text-xl mb-6">
          <b>"ЖИМОБАЙЛ" ХХК</b>
          <b>{data.generate}</b>
        </div>
        <div className="font-bold my-2 text-lg mx-4">5.3. Тестийн кэйс</div>
        <TestCase documentId={documentId} />
      </Form>
    </Modal>
  );
}
