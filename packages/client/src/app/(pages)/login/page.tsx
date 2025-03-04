"use client";
import { Button, Form, Input, message } from "antd";
import type { FormProps } from "antd";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { revalidatePath } from "next/cache";
import { FieldType } from "@/types/interface";

export default function LoginLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/create");
      }
    } catch (error) {
      console.log(error);
      revalidatePath("/login");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.error(errorInfo);
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      <Image
        src="/background.png"
        alt="Background"
        fill
        className="absolute z-0 object-cover"
        priority
      />

      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="z-10 bg-white/90 p-8 rounded-lg shadow-lg"
      >
        <div className="my-8">
          <Form.Item<FieldType>
            name="username"
            rules={[
              {
                required: true,
                message: "Нэвтрэх нэрээ оруулна уу",
              },
            ]}
          >
            <Input
              placeholder="Нэвтрэх нэр"
              className="w-96 py-2"
              size="large"
              disabled={loading}
            />
          </Form.Item>
        </div>

        <div className="my-8">
          <Form.Item<FieldType>
            name="password"
            rules={[
              {
                required: true,
                message: "Нууц үгээ нэвтрүүлнэ үү",
              },
            ]}
          >
            <Input.Password
              placeholder="Нууц үг"
              className="w-96 py-2"
              size="large"
              disabled={loading}
            />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            size="large"
            htmlType="submit"
            className="w-96 bg-[#01443F] text-white hover:bg-[#025952]"
            loading={loading}
          >
            Нэвтрэх
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
