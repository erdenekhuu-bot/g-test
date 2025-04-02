"use client";
import { Modal, Form } from "antd";
import { useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DocumentContext } from "./FirstDocument";
import { TestCase } from "../usable/TestCase";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
};

export function ThirdDocument({ open, onCancel }: ModalProps) {
  const [caseForm] = Form.useForm();
  const documentId = useContext(DocumentContext);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const values = await caseForm.validateFields();

      const testcase = (values.testcase || []).map((item: any) => {
        return {
          category: String(item.category),
          division: item.division,
          result: item.result,
          steps: item.steps,
          types: String(item.types),
          documentId: documentId,
        };
      });

      const request = await axios.post("/api/document/testcase", testcase);
      if (request.data.success) {
        onCancel();
        router.refresh();
      }
    } catch (error) {}
  };

  return (
    <Modal
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
    >
      <Form form={caseForm} className="p-6">
        <div className="flex justify-between text-xl mb-6">
          <b>"ЖИМОБАЙЛ" ХХК</b>
        </div>
        <div className="font-bold my-2 text-lg mx-4">5.3. Тестийн кэйс</div>
        <TestCase />
      </Form>
    </Modal>
  );
}
