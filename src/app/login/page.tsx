"use client";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FieldType = {
  username?: string;
  password?: string;
};

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });
      if (result?.ok) {
        router.push("/home/create");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center relative">
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
            rules={[{ required: true, message: "Нууц үгээ оруулна уу" }]}
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
