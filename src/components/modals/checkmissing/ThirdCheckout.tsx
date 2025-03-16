"use client";
import { Modal, Form } from "antd";
import { createContext, useEffect } from "react";
import { selectConvert } from "../../usable";
import axios from "axios";
import { EditTestCase } from "../edit_modals/EditTestCase";
import { useRouter } from "next/navigation";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  documentId: any;
};

export const ThirdContext = createContext<any | null>(null);

export function ThirdCheckout({ open, onCancel, documentId }: ModalProps) {
  const [caseForm] = Form.useForm();
  const router = useRouter();
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
        documentId: documentId,
      };
      const request = await axios.post("/api/document/testcase", caseData);
      console.log(request);
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
      <ThirdContext.Provider value={documentId}>
        <Form form={caseForm} className="p-6">
          <div className="flex justify-between text-xl mb-6">
            <b>"ЖИМОБАЙЛ" ХХК</b>
          </div>
          <div className="font-bold my-2 text-lg mx-4">5.3. Тестийн кэйс</div>
          <EditTestCase />
        </Form>
      </ThirdContext.Provider>
    </Modal>
  );
}
