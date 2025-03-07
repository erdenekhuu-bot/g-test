"use client";
import { Modal, Form, Input, Table, Button, Layout } from "antd";
import { useState, useContext } from "react";
import axios from "axios";
import { TestSchedule } from "./TestSchedule";
import { TestRisk } from "./TestRisk";
import { TestEnv } from "./TestEnv";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { selectConvert } from "../usable";
import { DocumentContext } from "./CreateDocumentModal";
import { ReadTestCase } from "./read_update_modals/ReadTestCase";

type ModalProps = {
  open: boolean;
  handleOk: () => void;
  onCancel: () => void;
};

const { TextArea } = Input;
dayjs.extend(customParseFormat);

export function FullModal({ open, onCancel, handleOk }: ModalProps) {
  const [data, setData] = useState<any>([]);
  const [attributeForm] = Form.useForm();
  const documentId = useContext(DocumentContext);
  let [mean, setMean] = useState<number>(0);

  return (
    <Modal
      open={open}
      onOk={handleOk}
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
        <div className="mt-8">
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Тестийн нэр!" }]}
            initialValue={data.title}
          >
            <Input size="large" placeholder="Тестийн нэр бичнэ үү..." />
          </Form.Item>
        </div>
        <div className="my-4">
          <div className="font-bold my-2 text-lg">Зөвшөөрөл</div>
          <p className="mb-4">
            Дор гарын үсэг зурсан албан тушаалтнууд нь тестийн үйл ажиллагааны
            төлөвлөгөөний баримт бичигтэй танилцаж, түүнтэй санал нийлж
            байгаагаа хүлээн зөвшөөрч, баталгаажуулсан болно. Энэхүү
            төлөвлөгөөний өөрчлөлтийг доор гарын үсэг зурсан эсвэл тэдгээрийн
            томилогдсон төлөөлөгчдийн зөвшөөрлийг үндэслэн зохицуулж, нэмэлтээр
            батална.
          </p>

          <Table dataSource={[]} columns={[]} pagination={false} bordered />
        </div>

        <div className="my-4">
          <div className="font-bold my-2 text-lg mx-4">
            1. Үйл ажиллагааны зорилго
          </div>
          <Form.Item
            name="aim"
            rules={[{ required: true, message: "Зорилго бичих шаардлагатай!" }]}
          >
            <TextArea
              rows={5}
              placeholder="Тестийн зорилго бичнэ үү..."
              style={{ resize: "none" }}
            />
          </Form.Item>
        </div>

        <div className="my-4">
          <div className="font-bold my-2 text-lg mx-4">
            2. Төслийн танилцуулга
          </div>
          <Form.Item
            name="intro"
            rules={[
              { required: true, message: "Танилцуулга бичих шаардлагатай!" },
            ]}
          >
            <TextArea
              rows={5}
              placeholder="Тестийн танилцуулга бичнэ үү..."
              style={{ resize: "none" }}
            />
          </Form.Item>
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
        <div className="font-bold my-2 text-lg mx-4">5.3. Тестийн кэйс</div>
        <ReadTestCase documentId={documentId} />
      </Form>
    </Modal>
  );
}
