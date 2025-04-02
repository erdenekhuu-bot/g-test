"use client";
import React, { useState, createContext } from "react";
import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import { ReportTestSchedule } from "./ReportTestSchedule";
import { SecondReportStep } from "./secondreportstep";
import { ThirdReportStep } from "./thirdreportstep";
import { FourthReportStep } from "./FourthReportStep";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ReportContextType {
  reportId: any | null;
  detailId: any | null;
}

export const ReportContext = createContext<ReportContextType>({
  reportId: null,
  detailId: null,
});

export function CreateReportModal({
  generate,
  detailId,
}: {
  generate: any;
  detailId: any;
}) {
  const [currentModal, setCurrentModal] = useState(0);
  const [mainForm] = Form.useForm();
  const [reportId, setReportId] = useState();
  const router = useRouter();
  const { data: session, status } = useSession();

  const showModal = () => {
    setCurrentModal(1);
  };

  const handleNext = () => {
    setCurrentModal((prev) => prev + 1);
  };

  const handleCancel = () => {
    setCurrentModal(0);
  };

  const handleSubmit = async () => {
    try {
      const values = await mainForm.validateFields();
      const requestData = {
        reportname: values.testname,
        reportpurpose: values.testpurpose,
        reportprocessing: values.testprocessing,
        reportschedule: values.reportschedule,
        documentId: detailId,
        authuserId: session?.user.id,
      };

      const request = await axios.post("/api/report/make", requestData);

      if (request.data.success) {
        setReportId(request.data.data.id);
        handleNext();
        router.refresh();
      }
    } catch (error) {
      return;
    }
  };
  return (
    <div>
      <Button
        type="primary"
        className="bg-[#01443F] text-white p-6"
        onClick={showModal}
      >
        Тестийн тайлан үүсгэх {generate && "( " + generate + " )"}
      </Button>

      <Modal
        open={currentModal === 1}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={1000}
        className="scrollbar"
        style={{ overflowY: "auto", maxHeight: "800px" }}
      >
        <Form className="p-6" form={mainForm}>
          <div className="flex justify-between text-xl">
            <b>"ЖИМОБАЙЛ" ХХК</b>
            <b>001-ТӨ-МТГ</b>
          </div>
          <div className="mt-8">
            <Form.Item
              name="testname"
              rules={[{ required: true, message: "Тестийн нэр!" }]}
            >
              <Input size="middle" placeholder="Тестийн нэр бичнэ үү..." />
            </Form.Item>
          </div>
          <b>ЗОРИЛГО</b>
          <div className="mt-8">
            <Form.Item
              name="testpurpose"
              rules={[{ required: true, message: "Тестийн зорилго!" }]}
            >
              <Input size="middle" placeholder="Тестийн зорилго бичнэ үү..." />
            </Form.Item>
          </div>
          <div>
            <p className="my-4 font-bold">
              ТЕСТЭД БАГИЙН БҮРЭЛДЭХҮҮН, ТЕСТ ХИЙСЭН ХУВААРЬ
            </p>
            <ReportTestSchedule />
          </div>
          <b>ТЕСТИЙН ЯВЦЫН ТОЙМ</b>
          <div className="mt-8">
            <Form.Item
              name="testprocessing"
              rules={[{ required: true, message: "Тестийн нэр!" }]}
            >
              <Input
                size="middle"
                placeholder="Тестийн танилцуулга бичнэ үү..."
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <ReportContext.Provider value={{ reportId, detailId }}>
        <SecondReportStep
          open={currentModal === 2}
          next={handleNext}
          onCancel={handleCancel}
        />

        <ThirdReportStep
          open={currentModal === 3}
          onCancel={handleCancel}
          next={handleNext}
        />
        <FourthReportStep open={currentModal === 4} onCancel={handleCancel} />
      </ReportContext.Provider>
    </div>
  );
}
