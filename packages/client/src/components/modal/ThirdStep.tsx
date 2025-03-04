"use client";
import { Modal } from "antd";
import { TestCase } from "../TestCase";
import { useState, useEffect } from "react";
import axios from "axios";

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
  const getDocument = async function ({ id }: { id: any }) {
    try {
      const record = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/list/${id}`
      );
      if (record.data.success) {
        setData(record.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (documentId) {
      getDocument({ id: documentId });
    }
  }, [documentId]);
  return (
    <Modal
      open={open}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
    >
      <div className="p-6">
        <div className="flex justify-between text-xl mb-6">
          <b>"ЖИМОБАЙЛ" ХХК</b>
          <b>{data.generate}</b>
        </div>
        <div className="font-bold my-2 text-lg mx-4">5.3. Тестийн кэйс</div>
        <TestCase documentId={documentId} />
      </div>
    </Modal>
  );
}
