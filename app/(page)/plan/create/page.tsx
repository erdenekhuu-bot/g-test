"use client";
import { Form, message, Input, Breadcrumb, Layout, Flex, Button } from "antd";
import { redirect } from "next/navigation";
import type { FormProps } from "antd";
import { useSession } from "next-auth/react";
import {
  DepartmentEmployeeRole,
  TestSchedule,
  TestRisk,
  Addition,
  TestBudget,
  TestCase,
} from "@/components/childform/ChildDocument";
import { removeDepartment } from "@/lib/usable";
import dayjs from "dayjs";
import { createDocument } from "@/action/document";

export default function Page() {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const [mainForm] = Form.useForm();

  const onFinish: FormProps["onFinish"] = async (values) => {
    let converting = {
      ...removeDepartment(values),
      authuserId: Number(session?.user.id),
    };
    let cleanedData = { ...converting };
    delete cleanedData.key;
    const bank = {
      bankname: values.bankname || "",
      bank: values.bank || "",
    };
    const testteam = (values.testschedule || []).map((item: any) => ({
      employeeId: item.employeeId,
      role: item.role,
      startedDate: dayjs(item.startedDate).format("YYYY-MM-DDTHH:mm:ssZ"),
      endDate: dayjs(item.endDate).format("YYYY-MM-DDTHH:mm:ssZ"),
    }));

    const riskdata = (values.testrisk || []).map((item: any) => {
      return {
        affectionLevel: item.affectionLevel,
        mitigationStrategy: item.mitigationStrategy,
        riskDescription: item.riskDescription,
        riskLevel: item.riskLevel,
      };
    });
    let attributeData = [
      {
        categoryMain: "Тестийн үе шат",
        category: "Бэлтгэл үе",
        value: values.predict || "",
      },
      {
        categoryMain: "Тестийн үе шат",
        category: "Тестийн гүйцэтгэл",
        value: values.dependecy || "",
      },
      {
        categoryMain: "Тестийн үе шат",
        category: "Тестийн хаалт",
        value: values.standby || "",
      },
      {
        categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
        category: "Таамаглал",
        value: values.execute || "",
      },
      {
        categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
        category: "Хараат байдал",
        value: values.terminate || "",
      },
      {
        categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
        category: "Нэмэлт",
        value: values.adding || "",
      },
    ];

    const addition = (values.attribute || []).map((item: any) => {
      return {
        categoryMain: "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур",
        category: item.category,
        value: item.value,
      };
    });

    addition.forEach((item: any) => {
      attributeData.push(item);
    });

    const budgetdata = (values.testbudget || []).map((item: any) => ({
      productCategory: String(item.productCategory),
      product: String(item.product),
      priceUnit: Number(item.priceUnit),
      priceTotal: Number(item.priceTotal),
      amount: Number(item.amount),
      id: Number(item.id),
    }));

    const testcase = (values.testcase || []).map(({ id, ...rest }: any) => ({
      ...rest,
    }));
    const merge = {
      converting,
      bank,
      testteam,
      riskdata,
      attributeData,
      budgetdata,
      testcase,
    };
    const result = await createDocument(merge);
    if (result > 0) {
      messageApi.success("Амжилттай хадгалагдлаа!");
    } else {
      messageApi.error("Алдаа гарлаа");
    }
  };
  return (
    <Layout.Content>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: (
              <span
                style={{
                  cursor: "pointer",
                }}
                onClick={() => redirect("/plan")}
              >
                Үндсэн хуудас руу буцах
              </span>
            ),
          },
          {
            title: "Удирдамж үүсгэх хуудас",
          },
        ]}
      />
      {contextHolder}
      <Form form={mainForm} onFinish={onFinish}>
        <div className="mt-4">
          <p className="font-bold my-2 text-lg">Тестийн тоот</p>
          <Form.Item name="generate">
            <Input size="large" placeholder="Тестийн тоот" />
          </Form.Item>
        </div>
        <div className="mt-4">
          <p className="font-bold my-2 text-lg">Тестийн нэр</p>
          <Form.Item name="title">
            <Input size="large" placeholder="Тестийн нэр" />
          </Form.Item>
        </div>
        <div className="my-2">
          <p className="font-bold">Зөвшөөрөл</p>
          <p className="mb-4">
            Доор гарын үсэг зурсан албан тушаалтнууд нь тестийн үйл ажиллагааны
            төлөвлөгөөний баримт бичигтэй танилцаж, түүнтэй санал нийлж
            байгаагаа хүлээн зөвшөөрч, баталгаажуулсан болно. Энэхүү
            төлөвлөгөөний өөрчлөлтийг доор гарын үсэг зурсан эсвэл тэдгээрийн
            томилогдсон төлөөлөгчдийн зөвшөөрлийг үндэслэн зохицуулж, нэмэлтээр
            батална.
          </p>
          <DepartmentEmployeeRole form={mainForm} />
        </div>
        <div className="my-4">
          <div className="font-bold my-2 text-lg mx-4">
            1. Үйл ажиллагааны зорилго
          </div>
          <Form.Item name="aim">
            <Input.TextArea rows={5} placeholder="Тестийн зорилго" />
          </Form.Item>
        </div>
        <div className="pb-4">
          <div className="font-bold my-2 text-lg mx-4">
            2. Тестийн танилцуулга
          </div>
          <Form.Item name="intro">
            <Input.TextArea rows={5} placeholder="Тестийн танилцуулга" />
          </Form.Item>
        </div>
        <TestSchedule form={mainForm} />
        <div className="font-bold my-2 text-lg">
          4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
        </div>
        <li>4.1 Таамаглал</li>
        <div className="mt-2">
          <Form.Item name="predict">
            <Input.TextArea rows={5} />
          </Form.Item>
        </div>
        <TestRisk form={mainForm} />
        <div>
          <li>4.3 Хараат байдал</li>
          <div className="mt-2">
            <Form.Item name="dependecy">
              <Input.TextArea rows={5} />
            </Form.Item>
          </div>
        </div>
        <div className="font-bold my-2 text-lg mx-4">5. Тестийн үе шат</div>
        <div>
          <li>5.1 Бэлтгэл үе</li>
          <div className="mt-2">
            <Form.Item name="standby">
              <Input.TextArea rows={5} />
            </Form.Item>
          </div>
        </div>
        <div>
          <li>5.2 Тестийн гүйцэтгэл</li>
          <div className="mt-2">
            <Form.Item name="execute">
              <Input.TextArea rows={5} />
            </Form.Item>
          </div>
        </div>
        <div>
          <li>5.3 Тестийн хаалт</li>
          <div className="mt-2">
            <Form.Item name="terminate">
              <Input.TextArea rows={5} />
            </Form.Item>
          </div>
        </div>
        <div className="font-bold my-2 text-lg mx-4">
          6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
        </div>
        <div className="my-4">
          <Form.Item name="adding">
            <Input placeholder="" />
          </Form.Item>
        </div>
        <Addition form={mainForm} />
        <TestBudget form={mainForm} />
        <div className="">
          <p className="my-4 font-bold">ТӨСВИЙН ДАНС</p>
          <Flex gap={10}>
            <Form.Item name="bankname" style={{ flex: 1 }}>
              <Input size="middle" placeholder="Дансны эзэмшигч" />
            </Form.Item>
            <Form.Item name="bank" style={{ flex: 1 }}>
              <Input size="middle" type="number" placeholder="Дансны дугаар" />
            </Form.Item>
          </Flex>
        </div>
        <TestCase form={mainForm} />
        <Flex justify="center">
          <Button size="large" type="primary" onClick={() => mainForm.submit()}>
            Хадгалах
          </Button>
        </Flex>
      </Form>
    </Layout.Content>
  );
}
