"use client";
import { Table, Form, Input, Button, Flex, Select, DatePicker } from "antd";
import { v4 as uuidv4 } from "uuid";
import { convertName, convertUtil } from "@/components/usable";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { testcaselist } from "@/components/usable";
import { capitalizeFirstLetter } from "@/components/usable";
import dayjs from "dayjs";

const dateFormat = "YYYY/MM/DD";

export function ShareDocument({ document }: any) {
  const [mainform] = Form.useForm();
  const [search, setSearch] = useState("");
  const [getEmployee, setEmployee] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);

  const departmentrole = document.departmentEmployeeRole.map((data: any) => ({
    key: uuidv4(),
    id: data.employee.id,
    department: data.employee.department?.name || "",
    employee: `${data.employee.firstname} ${data.employee.lastname}`,
    jobPosition: data.employee.jobPosition?.name || "",
    role: data.role,
  }));

  const updatedData = document.documentemployee.map((data: any) => {
    const startedDate =
      data.startedDate && dayjs(data.startedDate, dateFormat).isValid()
        ? data.startedDate
        : "";
    const endDate =
      data.endDate && dayjs(data.endDate, dateFormat).isValid()
        ? data.endDate
        : "";
    return {
      key: uuidv4(),
      id: data.employee.id,
      employeeId: `${data.employee.firstname} ${data.employee.lastname}` || "",
      role: data.role || "",
      startedDate,
      endDate,
    };
  });

  mainform.setFieldsValue({
    title: document.title,
    aim: document.detail[0]?.aim,
    intro: document.detail[0]?.intro,
    predict:
      document.attribute.find((attr: any) => attr.category === "Таамаглал")
        ?.value || "",
    dependecy:
      document.attribute.find((attr: any) => attr.category === "Хараат байдал")
        ?.value || "",
    standby:
      document.attribute.find((attr: any) => attr.category === "Бэлтгэл үе")
        ?.value || "",
    execute:
      document.attribute.find(
        (attr: any) => attr.category === "Тестийн гүйцэтгэл"
      )?.value || "",
    terminate:
      document.attribute.find((attr: any) => attr.category === "Тестийн хаалт")
        ?.value || "",
    adding:
      document.attribute.find((attr: any) => attr.category === "Нэмэлт")
        ?.value || "",
    departmentemployee: departmentrole.map((item: any) => ({
      employeeId: { value: item.id, label: item.employee },
      jobposition: item.jobPosition,
      role: item.role,
    })),
    testschedule: updatedData.map((item: any) => ({
      ...item,
      startedDate: item.startedDate ? dayjs(item.startedDate) : null,
      endDate: item.endDate ? dayjs(item.endDate) : null,
    })),
    testrisk: document.riskassessment.map((risk: any) => ({
      key: uuidv4(),
      riskDescription: risk.riskDescription,
      riskLevel: risk.riskLevel,
      affectionLevel: risk.affectionLevel,
      mitigationStrategy: risk.mitigationStrategy,
    })),
    attribute: document.attribute.map((attr: any) => ({
      key: uuidv4(),
      category: attr.category,
      value: attr.value,
    })),
    testcase: document.testcase.map((test: any) => ({
      key: uuidv4(),
      category: test.category,
      types: test.types,
      steps: test.steps,
      result: test.result,
      division: test.division,
    })),
    budget: document.budget.map((budget: any) => ({
      key: uuidv4(),
      name: budget.name,
      amount: budget.amount,
    })),
    bankname: document.bank.name,
    bank: document.bank.address,
    testenv: document.budget.map((data: any) => ({
      key: uuidv4(),
      id: data.id,
      productCategory: data.productCategory || "",
      product: data.product || "",
      amount: data.amount || 0,
      priceUnit: data.priceUnit || 0,
      priceTotal: data.priceTotal || 0,
    })),
  });

  const fetchEmployees = async (searchValue: string) => {
    try {
      const response = await axios.post("/api/employee", {
        firstname: searchValue || "",
      });
      if (response.data.success) {
        setEmployee(response.data.data);
      }
    } catch (error) {
      return;
    }
  };

  const findEmployee = async (id: number) => {
    try {
      const response = await axios.get(`/api/employee/${id}`);
      return response.data.data;
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        fetchEmployees(search);
      } else {
        setEmployee([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSearch = (value: string) => {
    setSearch(capitalizeFirstLetter(value));
  };

  return (
    <div className="bg-white  py-4 rounded-lg shadow">
      <Flex justify="space-evenly">
        <section className="w-3/4">
          {document && (
            <Form form={mainform} layout="vertical">
              <div className="flex justify-between text-xl mb-6">
                <b>"ЖИМОБАЙЛ" ХХК</b>
              </div>
              <div className="mt-8">
                <Form.Item name="title">
                  <Input size="large" placeholder="Тестийн нэр бичнэ үү..." />
                </Form.Item>
              </div>
              <div className="my-4">
                <div className="font-bold my-2 text-lg">Зөвшөөрөл</div>
                <p className="mb-4">
                  Дор гарын үсэг зурсан албан тушаалтнууд нь тестийн үйл
                  ажиллагааны төлөвлөгөөний баримт бичигтэй танилцаж, түүнтэй
                  санал нийлж байгаагаа хүлээн зөвшөөрч, баталгаажуулсан болно.
                  Энэхүү төлөвлөгөөний өөрчлөлтийг доор гарын үсэг зурсан эсвэл
                  тэдгээрийн томилогдсон төлөөлөгчдийн зөвшөөрлийг үндэслэн
                  зохицуулж, нэмэлтээр батална.
                </p>
                <Form.List name="departmentemployee">
                  {(fields, { add, remove }) => (
                    <section>
                      <Table
                        rowKey="key"
                        dataSource={fields}
                        pagination={false}
                        bordered
                        columns={[
                          {
                            title: "Нэр",
                            dataIndex: "employee",
                            key: "employee",
                            render: (_, __, index) => (
                              <Form.Item
                                name={[index, "employeeId"]}
                                style={{ margin: 0 }}
                              >
                                <Select
                                  labelInValue
                                  showSearch
                                  allowClear
                                  style={{ width: "100%" }}
                                  placeholder=""
                                  options={convertUtil(getEmployee)}
                                  onSearch={(value) => setSearch(value)}
                                  filterOption={false}
                                  onChange={async (data, option) => {
                                    const selectedEmployee = await findEmployee(
                                      data.value
                                    );
                                    if (selectedEmployee) {
                                      const newData = [...dataSource];
                                      newData[index] = {
                                        ...newData[index],
                                        id: selectedEmployee.id,
                                        employee: `${selectedEmployee.firstname} ${selectedEmployee.lastname}`,
                                        department:
                                          selectedEmployee.department?.name ||
                                          "",
                                        jobPosition:
                                          selectedEmployee.jobPosition?.name ||
                                          "",
                                      };
                                      setDataSource(newData);
                                      const currentValues =
                                        mainform.getFieldValue(
                                          "departmentemployee"
                                        ) || [];
                                      currentValues[index] = {
                                        ...currentValues[index],
                                        employeeId: {
                                          value: selectedEmployee.id,
                                          label: `${selectedEmployee.firstname} ${selectedEmployee.lastname}`,
                                        },
                                        jobposition:
                                          selectedEmployee.jobPosition?.name ||
                                          "",
                                      };
                                      mainform.setFieldsValue({
                                        departmentemployee: currentValues,
                                      });
                                    }
                                  }}
                                />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Албан тушаал",
                            dataIndex: "jobPosition",
                            key: "jobPosition",
                            width: 300,
                            render: (_, __, index) => (
                              <Form.Item
                                name={[index, "jobposition"]}
                                style={{ margin: 0 }}
                              >
                                <Input readOnly />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Үүрэг",
                            dataIndex: "role",
                            key: "role",
                            render: (_, __, index) => (
                              <Form.Item
                                name={[index, "role"]}
                                style={{ margin: 0 }}
                              >
                                <Select
                                  tokenSeparators={[","]}
                                  options={[
                                    {
                                      value: "ACCESSER",
                                      label:
                                        "Тестийн төсрийг хянан баталгаажуулах",
                                    },
                                    {
                                      value: "VIEWER",
                                      label:
                                        "Баримт бичгийг хянан баталгаажуулах",
                                    },
                                  ]}
                                />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "",
                            key: "id",
                            render: (_, __, index) => (
                              <Image
                                src="/trash.svg"
                                alt=""
                                className="hover:cursor-pointer"
                                width={20}
                                height={20}
                                onClick={() => remove(index)}
                              />
                            ),
                          },
                        ]}
                      />
                      <div className="text-end mt-4">
                        <Button
                          type="primary"
                          onClick={() =>
                            add({
                              key: uuidv4(),
                              employee: "",
                              jobPosition: "",
                              role: "",
                              department: "",
                            })
                          }
                        >
                          Мөр нэмэх
                        </Button>
                      </div>
                    </section>
                  )}
                </Form.List>
              </div>
              <div className="my-4">
                <div className="font-bold my-2 text-lg mx-4">
                  1. Үйл ажиллагааны зорилго
                </div>
                <Form.Item name="aim">
                  <Input.TextArea
                    rows={5}
                    placeholder="Тестийн зорилго бичнэ үү..."
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              </div>
              <div className="my-4">
                <div className="font-bold my-2 text-lg mx-4">
                  2. Төслийн танилцуулга
                </div>
                <Form.Item name="intro">
                  <Input.TextArea
                    rows={5}
                    placeholder="Тестийн танилцуулга бичнэ үү..."
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              </div>
              <div className="font-bold my-2 text-lg mx-4">
                3.ТЕСТИЙН БАГИЙН БҮРЭЛДЭХҮҮН, ТЕСТ ХИЙСЭН ХУВААРЬ
              </div>
              <Form.List name="testschedule">
                {(fields, { add, remove }) => (
                  <section>
                    <Table
                      dataSource={fields}
                      pagination={false}
                      bordered
                      rowKey="key"
                      columns={[
                        {
                          title: "Албан тушаал/Ажилтны нэр",
                          dataIndex: "employeeId",
                          key: "employeeId",
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, "employeeId"]}
                              rules={[{ required: false }]}
                            >
                              <Select
                                placeholder=""
                                style={{ width: "100%" }}
                                options={convertUtil(getEmployee)}
                                filterOption={false}
                                onSearch={handleSearch}
                                showSearch
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Үүрэг",
                          dataIndex: "role",
                          key: "role",
                          width: 300,
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, "role"]}
                              rules={[{ required: false }]}
                            >
                              <Select
                                tokenSeparators={[","]}
                                options={[
                                  {
                                    value: "Хяналт тавих, Асуудал шийдвэрлэх",
                                    label: "Хяналт тавих, Асуудал шийдвэрлэх",
                                  },
                                  {
                                    value: "Техникийн нөхцөлөөр хангах",
                                    label: "Техникийн нөхцөлөөр хангах",
                                  },
                                  {
                                    value: "Төлөвлөгөө боловсруулах, Тест хийх",
                                    label: "Төлөвлөгөө боловсруулах, Тест хийх",
                                  },
                                ]}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Эхлэх хугацаа",
                          dataIndex: "startedDate",
                          key: "startedDate",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "startedDate"]}>
                              <DatePicker format={dateFormat} />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Дуусах хугацаа",
                          dataIndex: "endDate",
                          key: "endDate",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "endDate"]}>
                              <DatePicker format={dateFormat} />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "",
                          key: "id",
                          render: (_, __, index) => (
                            <Image
                              src="/trash.svg"
                              alt="Delete"
                              className="hover:cursor-pointer"
                              width={20}
                              height={20}
                              onClick={() => remove(index)}
                            />
                          ),
                        },
                      ]}
                    />
                    <div className="text-end mt-4">
                      <Button
                        type="primary"
                        onClick={() =>
                          add({
                            key: uuidv4(),
                            employeeId: "",
                            role: "",
                            startedDate: "",
                            endDate: "",
                          })
                        }
                      >
                        Мөр нэмэх
                      </Button>
                    </div>
                  </section>
                )}
              </Form.List>
              <div className="font-bold my-2 text-lg mx-4">
                4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
              </div>
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
                    <Input.TextArea rows={5} style={{ resize: "none" }} />
                  </Form.Item>
                </div>
                <li className="mb-2 mt-4">4.2 Эрсдэл</li>
                <Form.List name="testrisk">
                  {(fields, { add, remove }) => (
                    <section>
                      <Table
                        dataSource={fields}
                        pagination={false}
                        bordered
                        rowKey="key"
                        columns={[
                          {
                            title: "Эрсдэл",
                            dataIndex: "riskDescription",
                            key: "riskDescription",
                            render: (_, __, index) => (
                              <Form.Item
                                name={[index, "riskDescription"]}
                                rules={[{ required: false }]}
                              >
                                <Input.TextArea
                                  rows={1}
                                  placeholder=""
                                  maxLength={500}
                                />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Эрсдлийн магадлал",
                            dataIndex: "riskLevel",
                            key: "riskLevel",
                            render: (_, __, index) => (
                              <Form.Item
                                name={[index, "riskLevel"]}
                                rules={[{ required: false }]}
                              >
                                <Select
                                  placeholder=""
                                  style={{ width: "100%" }}
                                  options={[
                                    {
                                      label: "HIGH",
                                      value: 1,
                                    },
                                    {
                                      label: "MEDIUM",
                                      value: 2,
                                    },
                                    {
                                      label: "LOW",
                                      value: 3,
                                    },
                                  ]}
                                  showSearch
                                  filterOption={(input, option) =>
                                    (option?.label ?? "")
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Эрсдлийн нөлөөлөл",
                            dataIndex: "affectionLevel",
                            key: "affectionLevel",
                            render: (_, __, index) => (
                              <Form.Item name={[index, "affectionLevel"]}>
                                <Select
                                  placeholder=""
                                  style={{ width: "100%" }}
                                  options={[
                                    {
                                      label: "HIGH",
                                      value: 1,
                                    },
                                    {
                                      label: "MEDIUM",
                                      value: 2,
                                    },
                                    {
                                      label: "LOW",
                                      value: 3,
                                    },
                                  ]}
                                  showSearch
                                  filterOption={(input, option) =>
                                    (option?.label ?? "")
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Бууруулах арга зам",
                            dataIndex: "mitigationStrategy",
                            key: "mitigationStrategy",
                            render: (_, __, index) => (
                              <Form.Item
                                name={[index, "mitigationStrategy"]}
                                rules={[{ required: false }]}
                              >
                                <Input.TextArea
                                  rows={1}
                                  placeholder=""
                                  maxLength={500}
                                />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "",
                            key: "id",
                            render: (_, __, index) => (
                              <Image
                                src="/trash.svg"
                                alt=""
                                className="hover:cursor-pointer"
                                width={20}
                                height={20}
                                onClick={() => remove(index)}
                              />
                            ),
                          },
                        ]}
                      />
                      <div className="text-end mt-4">
                        <Button
                          type="primary"
                          onClick={() =>
                            add({
                              key: uuidv4(),
                              id:
                                Math.max(
                                  0,
                                  ...dataSource.map((item) => item.id)
                                ) + 1,
                              riskDescription: "",
                              riskLevel: "",
                              affectionLevel: "",
                              mitigationStrategy: "",
                            })
                          }
                        >
                          Мөр нэмэх
                        </Button>
                      </div>
                    </section>
                  )}
                </Form.List>
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
                        <Input.TextArea rows={5} style={{ resize: "none" }} />
                      </Form.Item>
                    </div>
                  </div>
                </Form.Item>
                <div className="font-bold my-2 text-lg mx-4">
                  5. Тестийн үе шат
                </div>
                <div>
                  <li>
                    5.1 Бэлтгэл үе
                    <ul className="ml-8">
                      • Эхний оруулсан бэлтгэл үе энэ форматын дагуу харагдах.
                      Хэдэн ч мөр байх боломжтой.
                    </ul>
                  </li>
                  <div className="mt-2">
                    <Form.Item name="standby">
                      <Input.TextArea rows={5} style={{ resize: "none" }} />
                    </Form.Item>
                  </div>
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
                    <Input.TextArea rows={5} style={{ resize: "none" }} />
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
                    <Input.TextArea rows={5} style={{ resize: "none" }} />
                  </Form.Item>
                </div>
              </div>
              <div className="font-bold my-2 text-lg mx-4">
                6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
              </div>
              <div className="my-4">
                <Form.Item name="adding">
                  <Input.TextArea rows={1} placeholder="" maxLength={500} />
                </Form.Item>
              </div>
              <Form.List name="attribute">
                {(fields, { add, remove }) => (
                  <section>
                    <Table
                      dataSource={fields}
                      pagination={false}
                      bordered
                      rowKey="key"
                      columns={[
                        {
                          title: "Ангилал",
                          dataIndex: "category",
                          key: "category",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "category"]}>
                              <Select
                                placeholder=""
                                style={{ width: "100%" }}
                                options={[
                                  {
                                    label: "Түтгэлзүүлэх",
                                    value: "Түтгэлзүүлэр",
                                  },
                                  {
                                    label: "Дахин эхлүүлэх",
                                    value: "Дахин эхлүүлэх",
                                  },
                                ]}
                                showSearch
                                filterOption={(input, option) =>
                                  (option?.label ?? "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Шалгуур",
                          dataIndex: "value",
                          key: "value",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "value"]}>
                              <Input.TextArea
                                rows={1}
                                placeholder=""
                                maxLength={500}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "",
                          key: "id",
                          render: (_, __, index) => (
                            <Image
                              src="/trash.svg"
                              alt=""
                              className="hover:cursor-pointer"
                              width={20}
                              height={20}
                              onClick={() => remove(index)}
                            />
                          ),
                        },
                      ]}
                    />
                    <div className="text-end mt-4">
                      <Button
                        type="primary"
                        onClick={() =>
                          add({
                            key: uuidv4(),
                            id:
                              Math.max(
                                0,
                                ...dataSource.map((item) => item.id)
                              ) + 1,
                            category: "",
                            value: "",
                          })
                        }
                      >
                        Мөр нэмэх
                      </Button>
                    </div>
                  </section>
                )}
              </Form.List>

              <div className="font-bold my-2 text-lg mx-4">
                7. Тестийн төсөв /Тестийн орчин/
              </div>
              <Form.List name="testenv">
                {(fields, { add, remove }) => (
                  <section>
                    <Table
                      dataSource={fields}
                      pagination={false}
                      bordered
                      rowKey="key"
                      columns={[
                        {
                          title: "Ангилал",
                          dataIndex: "productCategory",
                          key: "productCategory",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "productCategory"]}>
                              <Input.TextArea
                                rows={1}
                                placeholder=""
                                maxLength={500}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Төрөл",
                          dataIndex: "product",
                          key: "product",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "product"]}>
                              <Input.TextArea
                                rows={1}
                                placeholder=""
                                maxLength={500}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Тоо ширхэг",
                          dataIndex: "amount",
                          key: "amount",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "amount"]}>
                              <Input placeholder="" type="number" />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Нэгж үнэ (₮)",
                          dataIndex: "priceUnit",
                          key: "priceUnit",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "priceUnit"]}>
                              <Input placeholder="" type="number" />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Нийт үнэ (₮)",
                          dataIndex: "priceTotal",
                          key: "priceTotal",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "priceTotal"]}>
                              <Input
                                style={{ width: 200 }}
                                placeholder=""
                                type="number"
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "",
                          key: "id",
                          render: (_, __, index) => (
                            <Image
                              src="/trash.svg"
                              alt=""
                              className="hover:cursor-pointer"
                              width={20}
                              height={20}
                              onClick={() => remove(index)}
                            />
                          ),
                        },
                      ]}
                    />
                    <div className="text-end mt-4">
                      <Button
                        type="primary"
                        onClick={() =>
                          add({
                            key: uuidv4(),
                            id:
                              Math.max(
                                0,
                                ...dataSource.map((item) => item.id)
                              ) + 1,
                            productCategory: "",
                            product: "",
                            amount: 0,
                            priceUnit: 0,
                            priceTotal: 0,
                          })
                        }
                      >
                        Мөр нэмэх
                      </Button>
                    </div>
                  </section>
                )}
              </Form.List>
              <div className="">
                <p className="my-4 font-bold">ТӨСӨВИЙН ДАНС</p>
                <Flex gap={10}>
                  <Form.Item name="bankname" style={{ flex: 1 }}>
                    <Input size="middle" placeholder="Дансны эзэмшигч" />
                  </Form.Item>
                  <Form.Item name="bank" style={{ flex: 1 }}>
                    <Input
                      size="middle"
                      type="number"
                      placeholder="Дансны дугаар"
                    />
                  </Form.Item>
                </Flex>
              </div>
              <div className="font-bold my-2 text-lg mx-4">
                5.3. Тестийн кэйс
              </div>
              <Form.List name="testcase">
                {(fields, { add, remove }) => (
                  <section>
                    <Table
                      dataSource={fields}
                      pagination={false}
                      bordered
                      rowKey="key"
                      columns={[
                        {
                          title: "Ангилал",
                          dataIndex: "category",
                          key: "category",
                          width: 200,
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, "category"]}
                              rules={[{ required: false }]}
                            >
                              <Select
                                placeholder=""
                                options={testcaselist}
                                showSearch
                                filterOption={(input, option) =>
                                  (option?.label ?? "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Тестийн төрөл",
                          dataIndex: "types",
                          key: "types",
                          width: 200,
                          render: (_, __, index) => (
                            <Form.Item name={[index, "types"]}>
                              <Input.TextArea rows={1} maxLength={500} />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Тест хийх алхамууд",
                          dataIndex: "steps",
                          key: "steps",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "steps"]}>
                              <Input.TextArea rows={1} maxLength={500} />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Үр дүн",
                          dataIndex: "result",
                          key: "result",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "result"]}>
                              <Input.TextArea rows={1} maxLength={500} />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Хариуцах нэгж",
                          dataIndex: "division",
                          key: "division",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "division"]}>
                              <Input.TextArea rows={1} maxLength={500} />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "",
                          key: "action",
                          render: (_, __, index) => (
                            <Image
                              src="/trash.svg"
                              alt="Delete"
                              width={20}
                              height={20}
                              className="hover:cursor-pointer"
                              onClick={() => remove(index)}
                            />
                          ),
                        },
                      ]}
                    />
                    <div className="text-end mt-4">
                      <Button
                        type="primary"
                        onClick={() =>
                          add({
                            key: uuidv4(),
                            category: "",
                            types: "",
                            steps: "",
                            result: "",
                            division: "",
                          })
                        }
                      >
                        Мөр нэмэх
                      </Button>
                    </div>
                  </section>
                )}
              </Form.List>
            </Form>
          )}
        </section>
        <section>
          <p className="text-2xl">Хуваалцаж байгаа хүмүүс</p>
          {document.shareGroup.map((emp: any, index: number) => (
            <Flex
              gap={8}
              style={{ margin: "30px 0" }}
              align="center"
              key={index}
            >
              <UserOutlined className="text-5xl" />
              <p>{convertName(emp.employee)}</p>
            </Flex>
          ))}
        </section>
      </Flex>
    </div>
  );
}
