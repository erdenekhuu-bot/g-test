"use client";
import { Modal, Form } from "antd";
import { createContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ReadTestCase } from "../usable/EditTestCase";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  documentId: any;
};

export const ThirdContext = createContext<any | null>(null);

export function ThirdRead({ open, onCancel, documentId }: ModalProps) {
  const [caseForm] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const values = await caseForm.validateFields();

      const testcase = (values.testcase || []).map((item: any) => {
        return {
          category: item.category,
          division: item.division,
          result: item.result,
          steps: item.steps,
          types: item.types,
          documentId: documentId,
        };
      });

      const request = await axios.put("/api/document/testcase", testcase);

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
          <ReadTestCase />
        </Form>
      </ThirdContext.Provider>
    </Modal>
  );
}
