"use client";
import { Modal, Form, Input, Table, Button, Select } from "antd";
import { useState } from "react";
import axios from "axios";
import { TestSchedule } from "./TestSchedule";
import { TestRisk } from "./TestRisk";
import { TestEnv } from "./TestEnv";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { selectConvert } from "../usable";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  confirmLoading?: boolean;
  onOk?: () => void;
  documentId?: number | null;
};

const { TextArea } = Input;
dayjs.extend(customParseFormat);

export function SecondStep({
  open,
  confirmLoading,
  onOk,
  onCancel,
  documentId,
}: ModalProps) {
  const [data, setData] = useState<any>([]);
  const [attributeForm] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = attributeForm.getFieldsValue();
      const teamdata = {
        employeeId: values.employeeId.slice(1),
        role: values.role.slice(1),
        startedDate: values.startedDate
          .slice(1)
          .map((index: any) => dayjs(index).format("YYYY-MM-DDTHH:mm:ssZ")),
        endDate: values.endDate
          .slice(1)
          .map((index: any) => dayjs(index).format("YYYY-MM-DDTHH:mm:ssZ")),
        documentId: documentId,
      };
      const budgetdata = {
        productCategory: values.productCategory
          .slice(1)
          .map((index: any) => selectConvert(index)),
        product: values.product
          .slice(1)
          .map((index: any) => selectConvert(index)),
        amount: values.amount.slice(1).map((index: any) => parseInt(index)),
        priceUnit: values.priceUnit
          .slice(1)
          .map((index: any) => parseInt(index)),
        priceTotal: values.priceTotal
          .slice(1)
          .map((index: any) => parseInt(index)),
        documentId: documentId,
      };
      const attributeData = [
        {
          categoryMain: "Тестийн үе шат",
          category: "Бэлтгэл үе",
          value: values.predict,
          documentId: documentId,
        },
        {
          categoryMain: "Тестийн үе шат",
          category: "Тестийн гүйцэтгэл",
          value: values.dependecy,
          documentId: documentId,
        },
        {
          categoryMain: "Тестийн үе шат",
          category: "Тестийн хаалт",
          value: values.standby,
          documentId: documentId,
        },
        {
          categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
          category: "Таамаглал",
          value: values.execute,
          documentId: documentId,
        },
        {
          categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
          category: "Хараат байдал",
          value: values.terminate,
          documentId: documentId,
        },
      ];
      const riskData = {
        affectionLevel: values.affectionLevel
          .slice(1)
          .map((index: any) => selectConvert(index)),
        mitigationStrategy: values.mitigationStrategy.slice(1),
        riskDescription: values.riskDescription.slice(1),
        riskLevel: values.riskLevel
          .slice(1)
          .map((index: any) => selectConvert(index)),
        documentId: documentId,
      };
      const apiRequests = [
        axios.post("/api/document/testteam", teamdata),
        axios.post("/api/document/budget", budgetdata),
        axios.post("/api/document/attribute", attributeData),
        axios.post("/api/document/risk", riskData),
      ];
      const responses = await Promise.all(apiRequests);
      responses.forEach((response) => {
        console.log(response.data);
      });
    } catch (error) {
      console.log(error);
    }
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
      <Form className="p-6" form={attributeForm}>
        <div className="flex justify-between text-xl mb-6">
          <b>"ЖИМОБАЙЛ" ХХК</b>
          <b>{data.generate}</b>
        </div>
        <TestSchedule />
        <div className="font-bold my-2 text-lg mx-4">
          4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
        </div>
        <div>
          <TestRisk />
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
        <TestEnv />
      </Form>
    </Modal>
  );
}
