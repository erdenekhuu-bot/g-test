"use client";
import { Modal, Form, Input, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect, createContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { OnlyReadTestCase } from "../usable/onlyread/OnlyReadTestCase";
import { OnlyReadTestEnv } from "../usable/onlyread/OnlyReadTestEnv";
import { OnlyReadTestSchedule } from "../usable/onlyread/OnlyReadTestSchedule";
import { OnlyReadDepartmentEmployee } from "../usable/onlyread/OnlyReadDepartmentEmployee";
import { OnlyReadTestRisk } from "../usable/onlyread/OnlyReadTestRisk";

type ModalProps = {
  open?: boolean;
  handleOk?: () => void;
  onCancel?: () => void;
  detailId?: any;
};

const { TextArea } = Input;
dayjs.extend(customParseFormat);

export const ReadDetail = createContext<any | null>(null);

export function FullModal({ open, onCancel, handleOk, detailId }: ModalProps) {
  const [data, setData] = useState<any>([]);
  const [attributeForm] = Form.useForm();
  const [filteredTableData, setFilteredTableData] = useState<any[]>([]);

  const detail = async function ({ id }: { id: number }) {
    try {
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        setData(request.data.data);
        const filteredAttributes = request.data.data.attribute.filter(
          (attr: any) =>
            attr.categoryMain === "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур"
        );

        const formValues = {
          title: request.data.data.title,
          aim: request.data.data.detail[0].aim,
          intro: request.data.data.detail[0].intro,
          predict:
            request.data.data.attribute.find(
              (attr: any) => attr.category === "Таамаглал"
            )?.value || "",
          dependecy:
            request.data.data.attribute.find(
              (attr: any) => attr.category === "Хараат байдал"
            )?.value || "",
          standby:
            request.data.data.attribute.find(
              (attr: any) => attr.category === "Бэлтгэл үе"
            )?.value || "",
          execute:
            request.data.data.attribute.find(
              (attr: any) => attr.category === "Тестийн гүйцэтгэл"
            )?.value || "",
          terminate:
            request.data.data.attribute.find(
              (attr: any) => attr.category === "Тестийн хаалт"
            )?.value || "",
        };

        attributeForm.setFieldsValue(formValues);
        setFilteredTableData(filteredAttributes);
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    detailId && detail({ id: detailId });
  }, [detailId]);

  const columns = [
    {
      title: "Ангилал",
      dataIndex: "categoryMain",
      key: "categoryMain",
    },
    {
      title: "Шалгуур",
      dataIndex: "category",
      key: "category",
    },
  ];

  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
    >
      <ReadDetail.Provider value={data}>
        <Form className="p-6" form={attributeForm}>
          <div className="flex justify-between text-xl mb-6">
            <b>"ЖИМОБАЙЛ" ХХК</b>
            <b>{data.generate}</b>
          </div>
          <div className="mt-8">
            <Form.Item name="title" initialValue={data.title}>
              <Input size="large" readOnly />
            </Form.Item>
          </div>
          <div className="my-4">
            <div className="font-bold my-2 text-lg">Зөвшөөрөл</div>
            <p className="mb-4">
              Дор гарын үсэг зурсан албан тушаалтнууд нь тестийн үйл ажиллагааны
              төлөвлөгөөний баримт бичигтэй танилцаж, түүнтэй санал нийлж
              байгаагаа хүлээн зөвшөөрч, баталгаажуулсан болно. Энэхүү
              төлөвлөгөөний өөрчлөлтийг доор гарын үсэг зурсан эсвэл тэдгээрийн
              томилогдсон төлөөлөгчдийн зөвшөөрлийг үндэслэн зохицуулж,
              нэмэлтээр батална.
            </p>

            <OnlyReadDepartmentEmployee />
          </div>
          <div className="my-4">
            <div className="font-bold my-2 text-lg mx-4">
              1. Үйл ажиллагааны зорилго
            </div>
            <Form.Item name="aim">
              <TextArea rows={5} style={{ resize: "none" }} readOnly />
            </Form.Item>
          </div>
          <div className="my-4">
            <div className="font-bold my-2 text-lg mx-4">
              2. Төслийн танилцуулга
            </div>
            <Form.Item name="intro">
              <TextArea rows={5} readOnly style={{ resize: "none" }} />
            </Form.Item>
          </div>
          <OnlyReadTestSchedule />
          <div className="font-bold my-2 text-lg mx-4">
            4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
          </div>
          <div>
            <OnlyReadTestRisk />
            <Form.Item name="execute">
              <div>
                <li>4.2 Таамаглал</li>
                <div className="mt-2">
                  <Form.Item
                    name="predict"
                    rules={[{ required: true, message: "Тестийн нэр!" }]}
                  >
                    <TextArea rows={5} style={{ resize: "none" }} readOnly />
                  </Form.Item>
                </div>
              </div>

              <div>
                <li>4.3 Хараат байдал</li>
                <div className="mt-2">
                  <Form.Item
                    name="dependecy"
                    rules={[{ required: true, message: "Тестийн нэр!" }]}
                  >
                    <TextArea rows={5} style={{ resize: "none" }} readOnly />
                  </Form.Item>
                </div>
              </div>
            </Form.Item>

            <div className="font-bold my-2 text-lg mx-4">5. Тестийн үе шат</div>
            <div>
              <li>5.1 Бэлтгэл үе</li>
              <div className="mt-2">
                <Form.Item
                  name="standby"
                  rules={[{ required: true, message: "Тестийн бэлтгэл үе!" }]}
                >
                  <TextArea rows={5} style={{ resize: "none" }} readOnly />
                </Form.Item>
              </div>
            </div>

            <div>
              <li>5.2 Тестийн гүйцэтгэл</li>
              <div className="mt-2">
                <Form.Item
                  name="execute"
                  rules={[{ required: true, message: "Тестийн гүйцэтгэл!" }]}
                >
                  <TextArea rows={5} style={{ resize: "none" }} readOnly />
                </Form.Item>
              </div>
            </div>

            <div>
              <li>5.3 Тестийн хаалт</li>
              <div className="mt-2">
                <Form.Item
                  name="terminate"
                  rules={[{ required: true, message: "Тестийн хаалт!" }]}
                >
                  <TextArea rows={5} style={{ resize: "none" }} readOnly />
                </Form.Item>
              </div>
            </div>
            <div className="font-bold my-2 text-lg mx-4 mb-4">
              6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
            </div>
            <Table
              rowKey="id"
              dataSource={filteredTableData}
              columns={columns}
              pagination={false}
              bordered
            />
          </div>
          <OnlyReadTestEnv />
          <div className="font-bold my-2 text-lg mx-4 mb-4">
            5.3. Тестийн кэйс
          </div>
          <OnlyReadTestCase />
        </Form>
      </ReadDetail.Provider>
    </Modal>
  );
}
