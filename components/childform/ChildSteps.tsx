"use client";
import { Steps, Button, Badge } from "antd";
import { convertName } from "@/lib/usable";
import { useSession } from "next-auth/react";
export function ChildSteps(record: any) {
  const { data: session } = useSession();
  return (
    <Steps
      style={{ height: "100vh", zIndex: 10, overflow: "auto" }}
      current={record.record[0].result.findIndex(
        (item: any) => item.state === "ACCESS"
      )}
      direction="vertical"
      items={record.record[0].result.map((item: any, index: number) => ({
        title: `${
          item.state === "ACCESS" ? "Баталгаажсан" : "Хүлээгдэж байгаа"
        }`,
        description: (
          <section key={index} className="text-[12px] mb-12">
            <p className="opacity-50">{item.jobPosition}</p>
            <p className="opacity-50">{convertName(item.employee)}</p>
            <p className="opacity-50">
              {new Date(item.startedDate).toLocaleString()}
            </p>
            <div className="mt-4">
              {item.state === "ACCESS" ? (
                <Badge text="Зөвшөөрсөн" status="success" />
              ) : (
                <Button
                  type="primary"
                  disabled={
                    Number(session?.user.id) === item.authUser ? false : true
                  }
                  //   onClick={() => {
                  //     getCheckout(7);
                  //   }}
                >
                  Баталгаажуулах
                </Button>
              )}
            </div>
          </section>
        ),
        status: item.state === "ACCESS" ? "process" : "wait",
      }))}
    />
  );
}
