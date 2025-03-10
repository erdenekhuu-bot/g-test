"use client";
import React, { useState, createContext, useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import { ReportTestSchedule } from "./report/ReportTestSchedule";
import { SecondReportStep } from "./SecondReportStep";
import { ThirdReportStep } from "./ThirdReportStep";

export const ReportContext = createContext<string | null>(null);

export function CreateReportModal() {
  const [currentModal, setCurrentModal] = useState(0);
  const [mainForm] = Form.useForm();

  const [documentId, setDocumentId] = useState<string | null>(null);

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
        name: values.name.slice(1),
        role: values.role.slice(1),
        started: values.started.slice(1),
        ended: values.ended.slice(1),
      };
      console.log(requestData);
      const request = await axios.post("/api/report/make", requestData);
      console.log(request);
      if (request.data.success) {
        setDocumentId(request.data.data.id);
        handleNext();
      }
    } catch (error) {
      console.log(error);
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
        Тестийн тайлан үүсгэх
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

      <ReportContext.Provider value={documentId}>
        <SecondReportStep
          open={currentModal === 2}
          next={handleNext}
          onCancel={handleCancel}
        />

        <ThirdReportStep open={currentModal === 3} onCancel={handleCancel} />
      </ReportContext.Provider>
    </div>
  );
}
