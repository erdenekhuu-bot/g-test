"use client";
import { Modal, Form, Input, Table, Button, Layout } from "antd";
import { useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRouter } from "next/navigation";
import { DocumentContext } from "./FirstDocument";
import { selectConvert } from "@/components/usable";
import { TestSchedule } from "../usable/TestSchedule";
import { TestRisk } from "../usable/TestRisk";
import { TestEnv } from "../usable/TestEnv";
import { TestCriteria } from "../usable/TestCriteria";

type ModalProps = {
  open: boolean;
  onCancel: () => void;
  next: () => void;
};

const { TextArea } = Input;
dayjs.extend(customParseFormat);

export function SecondDocument({ open, next, onCancel }: ModalProps) {
  const router = useRouter();
  const [attributeForm] = Form.useForm();
  const documentId = useContext(DocumentContext);
  let [mean] = useState<number>(0);

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

      const riskdata = (values.testrisk || []).map((item: any) => {
        return {
          affectionLevel: selectConvert(item.affectionLevel),
          mitigationStrategy: item.mitigationStrategy,
          riskDescription: item.riskDescription,
          riskLevel: selectConvert(item.riskLevel),
          documentId: documentId,
        };
      });

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

      const budgetdata = (values.testenv || []).map((item: any) => ({
        productCategory: String(item.productCategory),
        product: String(item.product),
        priceUnit: parseInt(item.priceUnit),
        priceTotal: parseInt(item.priceTotal),
        amount: parseInt(item.amount),
        documentId: documentId,
      }));

      const apiRequests = [
        axios.post("/api/document/testteam", testteam),
        axios.post("/api/document/budget", budgetdata),
        axios.post("/api/document/attribute", { attributeData }),
        axios.post("/api/document/risk", riskdata),
      ];

      const responses = await Promise.all(apiRequests);
      for (let i in responses) {
        mean += responses[i].status;
      }

      if (mean / responses.length === 201) {
        next();
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <Modal
      open={open}
      onOk={next}
      onCancel={onCancel}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
      footer={[
        <Button key="back" onClick={onCancel}>
          Цуцлах
        </Button>,
        <Button key="next" type="primary" onClick={handleNext}>
          Цааш
        </Button>,
      ]}
    >
      <Form className="p-6" form={attributeForm}>
        <div className="flex justify-between text-xl mb-6">
          <b>"ЖИМОБАЙЛ" ХХК</b>
        </div>
        <TestSchedule />
        <div className="font-bold my-2 text-lg mx-4">
          4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
        </div>
        <div>
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
                <Form.Item name="predict">
                  <TextArea
                    rows={5}
                    style={{ resize: "none" }}
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
              </div>
            </div>
            <TestRisk />
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
                  <TextArea
                    rows={5}
                    style={{ resize: "none" }}
                    showCount
                    maxLength={500}
                  />
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
              <Form.Item name="standby">
                <TextArea
                  rows={5}
                  style={{ resize: "none" }}
                  showCount
                  maxLength={500}
                />
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
              <Form.Item name="execute">
                <TextArea
                  rows={5}
                  style={{ resize: "none" }}
                  showCount
                  maxLength={500}
                />
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
                <TextArea
                  rows={5}
                  style={{ resize: "none" }}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </div>
          </div>
          <div className="font-bold my-2 text-lg mx-4">
            6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
          </div>

          <TestCriteria />
        </div>
        <TestEnv />
      </Form>
    </Modal>
  );
}
