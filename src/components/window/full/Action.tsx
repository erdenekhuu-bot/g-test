"use client";
import { Modal, Form, Input, Table, Steps, Button, Flex, message } from "antd";
import { useState, useEffect, createContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { convertName } from "@/components/usable";
import { useSession } from "next-auth/react";
import { ReadDepartmentEmployee } from "../usable/ReadDepartmentEmployee";
import { ReadTestSchedule } from "../usable/ReadTestSchedule";
import { ReadTestRisk } from "../usable/ReadTestRisk";
import { ReadTestEnv } from "../usable/ReadTestEnv";
import { ReadTestCase } from "../usable/ReadTestCase";
import { Badge } from "@/components/ui/badge";
import { globalState } from "@/app/store";
import { useRouter } from "next/navigation";

type ModalProps = {
  open: boolean;
  handleOk: () => void;
  onCancel: () => void;
  detailId: any;
};

const columns = [
  {
    title: "Ангилал",
    dataIndex: "category",
    key: "id",
  },
  {
    title: "Шалгуур",
    dataIndex: "value",
    key: "id",
  },
];

const { TextArea } = Input;
dayjs.extend(customParseFormat);

export const ActionDetail = createContext<any | null>(null);

export function ActionModal({
  open,
  onCancel,
  handleOk,
  detailId,
}: ModalProps) {
  const { data: session } = useSession();
  const [data, setData] = useState<any>([]);
  const [attributeForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [filteredTableData, setFilteredTableData] = useState<any[]>([]);
  const [otp, setOtp] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [append, setAppend] = useState("");
  const { getNotification } = globalState();
  const router = useRouter();

  const detail = async function ({ id }: { id: number }) {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        setData(request.data.data);
        const filteredAttributes = request.data.data.attribute.filter(
          (attr: any) =>
            attr.categoryMain === "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур"
        );
        const formValues = {
          title: request.data.data.title,
          aim: request.data.data.detail[0].aim,
          intro: request.data.data.detail[0].intro,
          predict:
            request.data.data.attribute.find(
              (attr: any) => attr.category === "Таамаглал"
            )?.value || "",
          dependecy:
            request.data.data.attribute.find(
              (attr: any) => attr.category === "Хараат байдал"
            )?.value || "",
          standby:
            request.data.data.attribute.find(
              (attr: any) => attr.category === "Бэлтгэл үе"
            )?.value || "",
          execute:
            request.data.data.attribute.find(
              (attr: any) => attr.category === "Тестийн гүйцэтгэл"
            )?.value || "",
          terminate:
            request.data.data.attribute.find(
              (attr: any) => attr.category === "Тестийн хаалт"
            )?.value || "",
          bankname: request.data.data.bank?.name,
          bank: request.data.data.bank?.address,
        };

        attributeForm.setFieldsValue(formValues);
        setFilteredTableData(filteredAttributes);
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (detailId) {
      detail({ id: detailId });

      const intervalId = setInterval(() => {
        detail({ id: detailId });
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [detailId]);

  const showOTP = () => {
    setOtp(true);
  };

  const cancelOTP = () => {
    setOtp(false);
  };

  const sendOTP = async () => {
    try {
      const response = await axios.put("/api/otp/created", {
        authuserId: session?.user.id,
      });
      if (response.status === 200) {
        messageApi.success("Нэг удаагийн код илгээгдлээ!");
      }
    } catch (error) {
      messageApi.error("Амжилтгүй боллоо.");
      return;
    }
  };

  const checkOTP = async () => {
    try {
      const response = await axios.post("/api/final/", {
        authuserId: session?.user.id,
        otp: parseInt(append),
        reject: 3,
        documentId: detailId,
      });
      if (response.data.success && session?.user?.id) {
        cancelOTP();
        getNotification(session.user.id);
        router.refresh();
      }
    } catch (error) {
      messageApi.error("Амжилтгүй боллоо.");
      return;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width={1000}
      className="scrollbar"
      style={{ overflowY: "auto", maxHeight: "800px" }}
      footer={[<></>]}
    >
      <ActionDetail.Provider value={data}>
        <Form form={attributeForm} className="p-4 flex gap-x-8">
          {loading && (
            <section className="flex-1 w-3/4">
              <div className="p-6">
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
                    Дор гарын үсэг зурсан албан тушаалтнууд нь тестийн үйл
                    ажиллагааны төлөвлөгөөний баримт бичигтэй танилцаж, түүнтэй
                    санал нийлж байгаагаа хүлээн зөвшөөрч, баталгаажуулсан
                    болно. Энэхүү төлөвлөгөөний өөрчлөлтийг доор гарын үсэг
                    зурсан эсвэл тэдгээрийн томилогдсон төлөөлөгчдийн
                    зөвшөөрлийг үндэслэн зохицуулж, нэмэлтээр батална.
                  </p>

                  <ReadDepartmentEmployee />
                </div>
                <div className="my-4">
                  <div className="font-bold my-2 text-lg mx-4">
                    1. Үйл ажиллагааны зорилго
                  </div>
                  <Form.Item name="aim">
                    <TextArea rows={5} style={{ resize: "none" }} readOnly />
                  </Form.Item>
                </div>
                <ReadTestSchedule />
                <div className="font-bold my-2 text-lg mx-4">
                  4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
                </div>
                <div>
                  <ReadTestRisk />
                  <Form.Item name="execute">
                    <div>
                      <li>4.2 Таамаглал</li>
                      <div className="mt-2">
                        <Form.Item
                          name="predict"
                          rules={[{ required: true, message: "Тестийн нэр!" }]}
                        >
                          <TextArea
                            rows={5}
                            style={{ resize: "none" }}
                            readOnly
                          />
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
                          <TextArea
                            rows={5}
                            style={{ resize: "none" }}
                            readOnly
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </Form.Item>

                  <div className="font-bold my-2 text-lg mx-4">
                    5. Тестийн үе шат
                  </div>
                  <div>
                    <li>5.1 Бэлтгэл үе</li>
                    <div className="mt-2">
                      <Form.Item
                        name="standby"
                        rules={[
                          { required: true, message: "Тестийн бэлтгэл үе!" },
                        ]}
                      >
                        <TextArea
                          rows={5}
                          style={{ resize: "none" }}
                          readOnly
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div>
                    <li>5.2 Тестийн гүйцэтгэл</li>
                    <div className="mt-2">
                      <Form.Item
                        name="execute"
                        rules={[
                          { required: true, message: "Тестийн гүйцэтгэл!" },
                        ]}
                      >
                        <TextArea
                          rows={5}
                          style={{ resize: "none" }}
                          readOnly
                        />
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
                        <TextArea
                          rows={5}
                          style={{ resize: "none" }}
                          readOnly
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="font-bold my-2 text-lg mx-4">
                    6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
                  </div>
                  <Table
                    rowKey="id"
                    dataSource={filteredTableData}
                    columns={columns}
                    pagination={false}
                    bordered
                  />
                </div>
                <ReadTestEnv />
                <div className="">
                  <p className="my-4 font-bold">ТӨСӨВИЙН ДАНС</p>
                  <Flex gap={10}>
                    <Form.Item name="bankname" style={{ flex: 1 }}>
                      <Input
                        size="middle"
                        placeholder="Дансны эзэмшигч"
                        readOnly
                      />
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
                <div className="font-bold my-2 text-lg mx-4">
                  5.3. Тестийн кэйс
                </div>
                <ReadTestCase />
              </div>
            </section>
          )}
          {loading && (
            <section className="w-1/4 p-4 mt-8">
              <Steps
                current={data?.departmentEmployeeRole?.findIndex(
                  (item: any) => item.state === "ACCESS"
                )}
                direction="vertical"
                items={data?.departmentEmployeeRole?.map(
                  (item: any, index: number) => ({
                    title: `${
                      item.state === "ACCESS"
                        ? "Баталгаажсан"
                        : "Хүлээгдэж байгаа"
                    }`,
                    description: (
                      <section key={index} className="text-[12px] mb-12">
                        <p className="opacity-50">
                          {item.employee.jobPosition.name}
                        </p>
                        <p className="opacity-50">
                          {convertName(item.employee)}
                        </p>
                        <p className="opacity-50">
                          {new Date(item.startedDate).toLocaleString()}
                        </p>
                        <div className="mt-4">
                          {item.state === "ACCESS" ? (
                            <Badge variant="info">Баталгаажсан</Badge>
                          ) : (
                            <Button
                              type="primary"
                              onClick={showOTP}
                              disabled={
                                session?.user.id === item.employee.authUser.id
                                  ? false
                                  : true
                              }
                            >
                              Баталгаажуулах
                            </Button>
                          )}
                        </div>
                      </section>
                    ),
                    status: item.state === "ACCESS" ? "process" : "wait",
                  })
                )}
              />
            </section>
          )}
        </Form>
        <Modal
          title=""
          open={otp}
          onCancel={cancelOTP}
          width={500}
          footer={[
            <Flex justify="space-between">
              <Button key="back" type="link" onClick={sendOTP} className="mx-6">
                Дахин код авах
              </Button>

              <Button
                key="next"
                type="primary"
                onClick={checkOTP}
                className="mx-6"
              >
                Шалгах
              </Button>
            </Flex>,
          ]}
        >
          {contextHolder}
          <p className="mt-4 text-xl px-2 text-center">
            {session?.user.mobile} дугаарт илгээсэн 6 оронтой кодыг оруулна уу.
          </p>

          <div className="my-4">
            <Flex gap="middle" align="center" vertical>
              <Input.OTP
                size="large"
                onChange={(e: any) => {
                  setAppend(e);
                }}
              />
              <Button
                type="primary"
                className="w-[90%]"
                onClick={() => {
                  sendOTP();
                }}
              >
                Нууц код авах
              </Button>
            </Flex>
          </div>
        </Modal>
      </ActionDetail.Provider>
    </Modal>
  );
}
