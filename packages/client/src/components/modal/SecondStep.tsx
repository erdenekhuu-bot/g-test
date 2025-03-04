"use client";
import { Modal, Form, Input, Table, Button, Select } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { ModalProps } from "@/types/type";
import { TestSchedule } from "../TestSchedule";
import { TestRisk } from "../TestRisk";
import { TestEnv } from "../TestEnv";

const { TextArea } = Input;

export function SecondStep({
  open,
  confirmLoading,
  onOk,
  onCancel,
  documentId,
}: ModalProps) {
  const [data, setData] = useState<any>([]);
  const [attributeForm] = Form.useForm();

  const getDocument = async function ({ id }: { id: any }) {
    try {
      const record = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/list/${id}`
      );
      if (record.data.success === true) {
        setData(record.data.data);
      }
    } catch (error) {
      return -1;
    }
  };

  const handleSubmit = async () => {
    try {
      const values = attributeForm.getFieldsValue();
      const documentUrl = `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/document/attribute/${documentId}`;

      const payloads = [
        {
          categoryMain: "Тестийн үе шат",
          category: "Бэлтгэл үе",
          value: values.predict,
        },
        {
          categoryMain: "Тестийн үе шат",
          category: "Тестийн гүйцэтгэл",
          value: values.dependecy,
        },
        {
          categoryMain: "Тестийн үе шат",
          category: "Тестийн хаалт",
          value: values.standby,
        },
        {
          categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
          category: "Таамаглал",
          value: values.execute,
        },
        {
          categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
          category: "Хараат байдал",
          value: values.terminate,
        },
      ];

      const requests = payloads.map((payload) =>
        axios.post(documentUrl, payload)
      );

      console.log(await Promise.allSettled(requests));
    } catch (error) {}
  };

  useEffect(() => {
    documentId && getDocument({ id: documentId });
  }, [documentId]);

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
      <Form className="p-6" form={attributeForm}>
        <div className="flex justify-between text-xl mb-6">
          <b>"ЖИМОБАЙЛ" ХХК</b>
          <b>{data.generate}</b>
        </div>
        <TestSchedule documentId={documentId} />
        <div className="font-bold my-2 text-lg mx-4">
          4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
        </div>
        <div>
          <TestRisk documentId={documentId} />
          <Form.Item name="execute">
            <div>
              <li>
                4.2 Таамаглал
                <ul className="ml-8">
                  • Эхний оруулсан таамаглал энэ форматын дагуу харагдах. Хэдэн
                  ч мөр байх боломжтой.
                </ul>
              </li>
              <div className="mt-2">
                <Form.Item
                  name="predict"
                  rules={[{ required: true, message: "Тестийн нэр!" }]}
                >
                  <TextArea rows={5} style={{ resize: "none" }} />
                </Form.Item>
              </div>
            </div>

            <div>
              <li>
                4.3 Хараат байдал
                <ul className="ml-8">
                  • Эхний оруулсан хараат байдал энэ форматын дагуу харагдах.
                  Хэдэн ч мөр байх боломжтой.
                </ul>
              </li>
              <div className="mt-2">
                <Form.Item
                  name="dependecy"
                  rules={[{ required: true, message: "Тестийн нэр!" }]}
                >
                  <TextArea rows={5} style={{ resize: "none" }} />
                </Form.Item>
              </div>
            </div>
          </Form.Item>

          <div className="font-bold my-2 text-lg mx-4">5. Тестийн үе шат</div>
          <div>
            <li>
              5.1 Бэлтгэл үе
              <ul className="ml-8">
                • Эхний оруулсан бэлтгэл үе энэ форматын дагуу харагдах. Хэдэн ч
                мөр байх боломжтой.
              </ul>
            </li>
            <div className="mt-2">
              <Form.Item
                name="standby"
                rules={[{ required: true, message: "Тестийн бэлтгэл үе!" }]}
              >
                <TextArea rows={5} style={{ resize: "none" }} />
              </Form.Item>
            </div>
          </div>

          <div>
            <li>
              5.2 Тестийн гүйцэтгэл
              <ul className="ml-8">
                • Эхний оруулсан тестийн гүйцэтгэл энэ форматын дагуу харагдах.
                Хэдэн ч мөр байх боломжтой.
              </ul>
            </li>
            <div className="mt-2">
              <Form.Item
                name="execute"
                rules={[{ required: true, message: "Тестийн гүйцэтгэл!" }]}
              >
                <TextArea rows={5} style={{ resize: "none" }} />
              </Form.Item>
            </div>
          </div>

          <div>
            <li>
              5.3 Тестийн хаалт
              <ul className="ml-8">
                • Эхний оруулсан тестийн хаалт энэ форматын дагуу харагдах.
                Хэдэн ч мөр байх боломжтой.
              </ul>
            </li>
            <div className="mt-2">
              <Form.Item
                name="terminate"
                rules={[{ required: true, message: "Тестийн хаалт!" }]}
              >
                <TextArea rows={5} style={{ resize: "none" }} />
              </Form.Item>
            </div>
          </div>
          <div className="font-bold my-2 text-lg mx-4">
            6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
          </div>
          <Table
            dataSource={[
              {
                id: 1,
                value: "los",
              },
            ]}
            pagination={false}
            rowKey="id"
          >
            <Table.Column
              title="Ангилал"
              dataIndex="jobposition"
              render={() => <Input />}
            />
            <Table.Column
              title="Шалгуур"
              dataIndex="role"
              render={() => <Input />}
            />
          </Table>
          <div className="text-end mt-4">
            <Button type="primary">Мөр нэмэх</Button>
          </div>
        </div>
        <TestEnv documentId={documentId} />
      </Form>
    </Modal>
  );
}
