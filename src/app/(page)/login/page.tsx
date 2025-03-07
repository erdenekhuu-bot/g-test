"use client";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import Image from "next/image";
import axios from "axios";

type FieldType = {
  username?: string;
  password?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
  console.log(await axios.post("/api/login", values));
};

export default function Login() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Image src="/background.png" alt="" fill className="absolute z-0" />
      <Form
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        className="z-10"
      >
        <div className="my-8">
          <Form.Item<FieldType>
            label=""
            name="username"
            rules={[{ required: true, message: "Нэвтрэх нэрээ оруулна уу" }]}
          >
            <Input placeholder="Нэвтрэх нэр" className="w-96 py-2" />
          </Form.Item>
        </div>

        <div className="my-8">
          <Form.Item<FieldType>
            label=""
            name="password"
            rules={[{ required: true, message: "Нууц үгээ нэвтрүүлнэ үү" }]}
          >
            <Input.Password placeholder="Нууц үг" className="w-96 py-2" />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            size="large"
            htmlType="submit"
            className="w-96 bg-[#01443F] text-white"
          >
            Нэвтрэх
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
