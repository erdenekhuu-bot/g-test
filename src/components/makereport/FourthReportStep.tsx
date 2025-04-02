"use client";
import { Modal, Form, message, Upload, Button } from "antd";
import { ReportContext } from "./createreport";
import { useContext } from "react";
import type { UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
};

const { Dragger } = Upload;

export function FourthReportStep({ open, onCancel }: ModalProps) {
  const [fourthReport] = Form.useForm();
  const { reportId, detailId } = useContext(ReportContext);
  console.log(reportId);
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: `/api/report/upload/${reportId}`,
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name}`);
      } else if (status === "error") {
        message.error(`${info.file.name} failed`);
      }
    },
    onDrop(e) {},
  };

  return (
    <Modal
      open={open}
      onOk={onCancel}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
    >
      <Form form={fourthReport}>
        <div className="flex justify-between text-xl">
          <b>"ЖИМОБАЙЛ" ХХК</b>
        </div>
        <div>
          <p className="my-4 font-bold">БАТАЛГААНЫ ХУУДАС</p>
        </div>
        <Dragger {...props}>
          <p className="my-6">
            <Button icon={<UploadOutlined />} type="primary" className="p-6">
              Файл оруулах
            </Button>
          </p>
          <p className="opacity-50">
            Уг тесттэй хамаарал бүхий тушаал оруулна уу.
          </p>
        </Dragger>
      </Form>
    </Modal>
  );
}
