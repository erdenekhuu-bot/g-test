"use client";
import {
  Button,
  Modal,
  Form,
  Select,
  message,
  Typography,
  Divider,
  Space,
  Radio,
} from "antd";
import type { FormProps } from "antd";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  UserSwitchOutlined,
  SolutionOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { ZUSTAND } from "@/app/zustand";
import { ChangeStatus, convertAdmin } from "@/action/admin";

const { Title } = Typography;

const PERMISSIONS_OPTIONS = [
  { label: "Бүгд", value: "ADMIN" },
  { label: "Унших", value: "VIEWER" },
  { label: "Засах", value: "DEV" },
  { label: "Хянах", value: "REPORT" },
];

export function AdminWindow() {
  const [messageApi, contextHolder] = message.useMessage();
  const { checkout, getCheckout, employeeId } = ZUSTAND();
  const [mainForm] = Form.useForm();
  const [search, setSearch] = useState("");
  const handleCancel = () => {
    getCheckout(-1);
    mainForm.resetFields();
  };
  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const onFinish: FormProps["onFinish"] = async (values) => {
    const merged = {
      ...values,
      employeeId,
    };
    console.log(merged);
    // const response = await ChangeStatus(merged);
    // if (response > 0) {
    //   messageApi.success("Амжилттай хадгалагдлаа!");
    //   getCheckout(-1);
    // } else {
    //   messageApi.error("Хадгалах үйлдэл амжилтгүй боллоо.");
    // }
  };

  return (
    <Modal
      title={
        <Space>
          <UserSwitchOutlined style={{ color: "#1890ff" }} />
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
            Ажилтны Мэдээлэл Засах
          </Title>
        </Space>
      }
      open={checkout === 20}
      onCancel={handleCancel}
      width={500}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Болих
        </Button>,
        <Button key="next" type="primary" onClick={() => mainForm.submit()}>
          Хадгалах
        </Button>,
      ]}
    >
      {contextHolder}
      <Divider style={{ margin: "16px 0" }} />
      <Form form={mainForm} onFinish={onFinish} layout="vertical">
        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Эрх</span>}
          name="super"
        >
          <Radio.Group>
            {PERMISSIONS_OPTIONS.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
