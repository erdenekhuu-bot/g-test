"use client";
import { Modal, Form, Input } from "antd";
import { useState, useEffect, createContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { selectConvert } from "@/components/usable";
import { useRouter } from "next/navigation";
import { ReadTestSchedule } from "../usable/EditTestSchedule";
import { ReadTestRisk } from "../usable/EditTestRisk";
import { ReadTestEnv } from "../usable/EditTestEnv";
import { ReadTestCriteria } from "../usable/EditTestCriteria";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  documentId: any;
};

const { TextArea } = Input;
dayjs.extend(customParseFormat);

export const SecondContext = createContext<any | null>(null);

export function SecondRead({ open, onCancel, documentId }: ModalProps) {
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [attributeForm] = Form.useForm();
  let [mean, setMean] = useState<number>(0);

  const handleNext = async () => {
    try {
      const values = await attributeForm.validateFields();
      const testteam = (values.testschedule || []).map((item: any) => ({
        employeeId: item.employeeId,
        role: item.role,
        startedDate: dayjs(item.startedDate).format("YYYY-MM-DDTHH:mm:ssZ"),
        endDate: dayjs(item.endDate).format("YYYY-MM-DDTHH:mm:ssZ"),
        documentId: documentId,
      }));

      const budgetdata = (values.testenv || []).map((item: any) => ({
        productCategory: String(item.productCategory),
        product: String(item.product),
        priceUnit: parseInt(item.priceUnit),
        priceTotal: parseInt(item.priceTotal),
        amount: parseInt(item.amount),
        documentId: documentId,
      }));

      let attributeData = [
        {
          categoryMain: "Тестийн үе шат",
          category: "Бэлтгэл үе",
          value: values.predict || "",
          documentId: documentId,
        },
        {
          categoryMain: "Тестийн үе шат",
          category: "Тестийн гүйцэтгэл",
          value: values.dependecy || "",
          documentId: documentId,
        },
        {
          categoryMain: "Тестийн үе шат",
          category: "Тестийн хаалт",
          value: values.standby || "",
          documentId: documentId,
        },
        {
          categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
          category: "Таамаглал",
          value: values.execute || "",
          documentId: documentId,
        },
        {
          categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
          category: "Хараат байдал",
          value: values.terminate || "",
          documentId: documentId,
        },
      ];

      const addition = (values.attribute || []).map((item: any) => {
        return {
          categoryMain: "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур",
          category: item.category,
          value: item.value,
          documentId: documentId,
        };
      });

      addition.forEach((item: any) => {
        attributeData.push(item);
      });

      const riskdata = (values.testrisk || []).map((item: any) => {
        return {
          affectionLevel: selectConvert(item.affectionLevel),
          mitigationStrategy: item.mitigationStrategy,
          riskDescription: item.riskDescription,
          riskLevel: selectConvert(item.riskLevel),
          documentId: documentId,
        };
      });

      const apiRequests = [
        axios.put("/api/document/testteam", testteam),
        axios.put("/api/document/budget", budgetdata),
        axios.put("/api/document/attribute", attributeData),
        axios.put("/api/document/risk", riskdata),
      ];
      const responses = await Promise.all(apiRequests);
      for (let i in responses) {
        mean += responses[i].status;
      }
      if (mean / responses.length === 200) {
        onCancel();
        router.refresh();
      }
    } catch (error) {
      return;
    }
  };

  const detail = async function ({ id }: { id: string }) {
    try {
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
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
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    documentId && detail({ id: documentId });
  }, [documentId]);

  return (
    <Modal
      open={open}
      onOk={handleNext}
      onCancel={onCancel}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
    >
      <SecondContext.Provider value={documentId}>
        <Form className="p-6" form={attributeForm}>
          <div className="flex justify-between text-xl mb-6">
            <b>"ЖИМОБАЙЛ" ХХК</b>
            <b>{data.generate}</b>
          </div>
          <ReadTestSchedule />
          <div className="font-bold my-2 text-lg mx-4">
            4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
          </div>
          <div>
            <Form.Item name="execute">
              <div>
                <li>
                  4.2 Таамаглал
                  <ul className="ml-8">
                    • Эхний оруулсан таамаглал энэ форматын дагуу харагдах.
                    Хэдэн ч мөр байх боломжтой.
                  </ul>
                </li>
                <div className="mt-2">
                  <Form.Item name="predict">
                    <TextArea rows={5} style={{ resize: "none" }} />
                  </Form.Item>
                </div>
              </div>
              <ReadTestRisk />
              <div>
                <li>
                  4.3 Хараат байдал
                  <ul className="ml-8">
                    • Эхний оруулсан хараат байдал энэ форматын дагуу харагдах.
                    Хэдэн ч мөр байх боломжтой.
                  </ul>
                </li>
                <div className="mt-2">
                  <Form.Item name="dependecy">
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
                  • Эхний оруулсан бэлтгэл үе энэ форматын дагуу харагдах. Хэдэн
                  ч мөр байх боломжтой.
                </ul>
              </li>
              <div className="mt-2">
                <Form.Item name="standby">
                  <TextArea rows={5} style={{ resize: "none" }} />
                </Form.Item>
              </div>
            </div>

            <div>
              <li>
                5.2 Тестийн гүйцэтгэл
                <ul className="ml-8">
                  • Эхний оруулсан тестийн гүйцэтгэл энэ форматын дагуу
                  харагдах. Хэдэн ч мөр байх боломжтой.
                </ul>
              </li>
              <div className="mt-2">
                <Form.Item name="execute">
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
                <Form.Item name="terminate">
                  <TextArea rows={5} style={{ resize: "none" }} />
                </Form.Item>
              </div>
            </div>
            <div className="font-bold my-2 text-lg mx-4">
              6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
            </div>
            <ReadTestCriteria />
          </div>
          <ReadTestEnv />
        </Form>
      </SecondContext.Provider>
    </Modal>
  );
}
