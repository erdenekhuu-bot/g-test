"use client";
import { Form, Input, Table, Flex, Steps, Button } from "antd";
import { useState, useRef, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { convertName, mongollabel } from "@/components/usable";
import { Badge } from "@/components/ui/badge";
import type { ColumnsType } from "antd/es/table";

const columns = [
  {
    title: "Ангилал",
    dataIndex: "category",
    key: "id",
  },
  {
    title: "Шалгуур",
    dataIndex: "value",
    key: "value",
  },
];

const { TextArea } = Input;
dayjs.extend(customParseFormat);

export function ReportDetail({ document, step }: any) {
  const [attributeForm] = Form.useForm();
  const [filteredTableData, setFilteredTableData] = useState([]);

  const reference = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const transformStyle = useMemo(
    () => ({
      transform: `translateY(${scrollPosition}px)`,
      willChange: "transform",
    }),
    [scrollPosition]
  );

  useEffect(() => {
    if (reference.current) {
      Object.assign(reference.current.style, transformStyle);
    }
  }, [transformStyle, scrollPosition]);

  useEffect(() => {
    const formValues = {
      title: document.title,
      aim: document.detail?.[0]?.aim,
      intro: document.detail?.[0]?.intro,
      predict:
        document.attribute.find((attr: any) => attr.category === "Таамаглал")
          ?.value || "",
      dependecy:
        document.attribute.find(
          (attr: any) => attr.category === "Хараат байдал"
        )?.value || "",
      standby:
        document.attribute.find((attr: any) => attr.category === "Бэлтгэл үе")
          ?.value || "",
      execute:
        document.attribute.find(
          (attr: any) => attr.category === "Тестийн гүйцэтгэл"
        )?.value || "",
      terminate:
        document.attribute.find(
          (attr: any) => attr.category === "Тестийн хаалт"
        )?.value || "",
      adding:
        document.attribute.find((attr: any) => attr.category === "Нэмэлт")
          ?.value || "",
      bankname: document.bank?.name,
      bank: document.bank?.address,
    };

    const filteredAttributes = document.attribute.filter(
      (attr: any) =>
        attr.categoryMain === "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур"
    );

    attributeForm.setFieldsValue(formValues);
    setFilteredTableData(filteredAttributes);
  }, [document, attributeForm]);

  const ReadDepartmentEmployeeColumn: ColumnsType = [
    {
      title: "Хэлтэс",
      dataIndex: "department",
      key: "department",
      width: 300,
      render: (_, record: any) => {
        return record?.employee?.department.name;
      },
    },
    {
      title: "Нэр",
      dataIndex: "employee",
      key: "employee",
      render: (_, record: any) => record?.employee?.firstname,
    },

    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (_, record: any) => mongollabel(record?.role),
    },
  ];

  const ReadTestScheduleColumn: ColumnsType = [
    {
      title: "Албан тушаал/Ажилтны нэр",
      dataIndex: "employee",
      key: "employee",
      render: (employee: any) => convertName(employee),
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (role) => role,
    },
    {
      title: "Эхлэх хугацаа",
      dataIndex: "startedDate",
      key: "startedDate",
      render: (startedDate) =>
        new Date(startedDate).toLocaleString().split(" ")[0],
    },
    {
      title: "Дуусах хугацаа",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => new Date(endDate).toLocaleString().split(" ")[0],
    },
  ];

  const ReadTestRiskColumn: ColumnsType = [
    {
      title: "Эрсдэл",
      dataIndex: "riskDescription",
      key: "riskDescription",
      render: (riskDescription) => riskDescription,
    },
    {
      title: "Эрсдлийн магадлал",
      dataIndex: "riskLevel",
      key: "riskLevel",
      render: (riskLevel) => riskLevel,
    },
    {
      title: "Эрсдлийн нөлөөлөл",
      dataIndex: "affectionLevel",
      key: "affectionLevel",
      render: (affectionLevel) => affectionLevel,
    },
    {
      title: "Бууруулах арга зам",
      dataIndex: "mitigationStrategy",
      key: "mitigationStrategy",
      render: (mitigationStrategy) => mitigationStrategy,
    },
  ];

  const ReadTestEnvColumn: ColumnsType = [
    {
      title: "Ангилал",
      dataIndex: "productCategory",
      key: "productCategory",
      render: (productCategory) => productCategory,
    },
    {
      title: "Төрөл",
      dataIndex: "product",
      key: "product",
      render: (product) => product,
    },
    {
      title: "Тоо ширхэг",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => amount,
    },
    {
      title: "Нэгж үнэ (₮)",
      dataIndex: "priceUnit",
      key: "priceUnit",
      render: (priceUnit) => priceUnit,
    },
    {
      title: "Нийт үнэ (₮)",
      dataIndex: "priceTotal",
      key: "priceTotal",
      render: (priceTotal) => priceTotal,
    },
  ];

  const ReadTestCaseColumn: ColumnsType = [
    {
      title: "Ангилал",
      dataIndex: "category",
      key: "category",
      render: (category) => category,
    },
    {
      title: "Тестийн төрөл",
      dataIndex: "types",
      key: "types",
      render: (types) => types,
    },
    {
      title: "Тест хийх алхамууд",
      dataIndex: "steps",
      key: "steps",
      render: (steps) => <div style={{ whiteSpace: "pre-wrap" }}>{steps}</div>,
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      render: (result) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
      ),
    },
    {
      title: "Хариуцах нэгж",
      dataIndex: "division",
      key: "division",
      render: (division) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{division}</div>
      ),
    },
  ];

  return (
    <Form
      form={attributeForm}
      className="p-2 flex gap-x-8 h-screen overflow-auto scrollbar"
      onScroll={(e: React.UIEvent<HTMLFormElement>) => {
        const currentScroll = e.currentTarget.scrollTop;
        setScrollPosition(currentScroll);
      }}
    >
      <section className="flex-1 w-3/4">
        <div className="first-column p-6">
          <div className="flex justify-between text-xl mb-6">
            <b>"ЖИМОБАЙЛ" ХХК</b>
          </div>
          <div className="mt-8">
            <Form.Item name="title">
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
            <Table
              dataSource={document.departmentEmployeeRole}
              columns={ReadDepartmentEmployeeColumn}
              pagination={false}
              bordered
              rowKey="id"
            />
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
              <TextArea
                rows={5}
                placeholder="Тестийн танилцуулга бичнэ үү..."
                style={{ resize: "none" }}
                readOnly
              />
            </Form.Item>
          </div>
          <Table
            rowKey="id"
            dataSource={document.documentemployee}
            columns={ReadTestScheduleColumn}
            pagination={false}
            bordered
          />
          <div className="font-bold my-2 text-lg mx-4">
            4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
          </div>
          <div>
            <Table
              rowKey="id"
              dataSource={document.riskassessment}
              columns={ReadTestRiskColumn}
              pagination={false}
              bordered
            />
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
            <div className="font-bold my-2 text-lg mx-4">
              6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
            </div>
            <div className="my-4">
              <Form.Item name="adding">
                <Input.TextArea
                  rows={1}
                  placeholder=""
                  maxLength={500}
                  readOnly
                />
              </Form.Item>
            </div>
            <Table
              rowKey="id"
              dataSource={filteredTableData}
              columns={columns}
              pagination={false}
              bordered
            />
          </div>
          <div className="font-bold my-2 text-lg mx-4">
            7. Тестийн төсөв /Тестийн орчин/
          </div>
          <Table
            rowKey="id"
            dataSource={document.budget}
            columns={ReadTestEnvColumn}
            pagination={false}
            bordered
          />
          <div className="">
            <p className="my-4 font-bold">ТӨСӨВИЙН ДАНС</p>
            <Flex gap={10}>
              <Form.Item name="bankname" style={{ flex: 1 }}>
                <Input size="middle" placeholder="Дансны эзэмшигч" readOnly />
              </Form.Item>
              <Form.Item name="bank" style={{ flex: 1 }}>
                <Input
                  size="middle"
                  type="number"
                  placeholder="Дансны дугаар"
                  readOnly
                />
              </Form.Item>
            </Flex>
          </div>
          <div className="font-bold my-2 text-lg mx-4">5.3. Тестийн кэйс</div>
          <Table
            dataSource={document.testcase}
            columns={ReadTestCaseColumn}
            rowKey="id"
            pagination={false}
            bordered
          />
        </div>
      </section>
      <div
        className="w-1/4 p-4 mt-8 h-[700px] overflow-auto scrollbar"
        ref={reference}
        style={transformStyle}
      >
        <Steps
          current={step.findIndex((item: any) => item.state === "ACCESS")}
          direction="vertical"
          items={step.map((item: any, index: number) => ({
            title: `${
              item.state === "ACCESS" ? "Баталгаажсан" : "Хүлээгдэж байгаа"
            }`,
            description: (
              <section key={index} className="text-[12px] mb-12">
                <p className="opacity-50">{item.employee.jobPosition?.name}</p>
                <p className="opacity-50">{convertName(item.employee)}</p>
                <p className="opacity-50">
                  {new Date(item.startedDate).toLocaleString()}
                </p>
                <div className="mt-4">
                  {item.state === "ACCESS" ? (
                    <Badge variant="info">Баталгаажсан</Badge>
                  ) : (
                    <Button type="primary" disabled>
                      Баталгаажуулах
                    </Button>
                  )}
                </div>
              </section>
            ),
            status: item.state === "ACCESS" ? "process" : "wait",
          }))}
        />
      </div>
    </Form>
  );
}
