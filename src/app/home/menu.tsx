"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Badge } from "antd";
import { useEffect } from "react";
import { globalState } from "../store";

export function Menu() {
  const {
    notificationCount,
    getNotification,
    reportNotificationCount,
    takeReportNotification,
    planNotification,
    setPlanNotification,
  } = globalState();
  const router = useRouter();
  const { data: session } = useSession();

  const handleMenuClick = (url: string) => {
    router.push(url);
  };

  const chekcout = session?.user.permission.kind?.length;
  const manager = session?.user.username;
  useEffect(() => {
    if (session?.user?.id) {
      getNotification(session.user.id);
      takeReportNotification(session.user.id);
      setPlanNotification(session.user.id);
    }
  }, [session?.user?.id]);

  return (
    <div>
      <p className="mt-20"></p>
      {chekcout > 1 ? (
        <div
          onClick={() => {
            handleMenuClick("/home/report");
          }}
          className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
        >
          {planNotification < 1 ? (
            <Image
              src="/document.svg"
              alt=""
              width={25}
              height={25}
              className="mr-2"
            />
          ) : (
            <div className="mr-2">
              <Badge count={planNotification}>
                <Image src="/document.svg" alt="" width={25} height={25} />
              </Badge>
            </div>
          )}
          <span className="text-[#01443F] font-medium">
            Хэлтсийн ажилчдын төлөвлөгөө
          </span>
        </div>
      ) : null}

      {chekcout > 1 || manager === "cc573" ? null : (
        <p
          onClick={() => {
            handleMenuClick("/home/create");
          }}
          className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
        >
          <Image
            src="/file-plus.svg"
            alt=""
            width={25}
            height={25}
            className="mr-2"
          />
          <span className="text-[#01443F] font-medium">Төлөвлөгөө үүсгэх</span>
        </p>
      )}

      {chekcout ? (
        chekcout > 4 ? (
          <div
            onClick={() => {
              handleMenuClick("/home/ceo");
            }}
            className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
          >
            {notificationCount < 1 ? (
              <Image
                src="/file-plus.svg"
                alt=""
                width={25}
                height={25}
                className="mr-2"
              />
            ) : (
              <div className="mr-2">
                <Badge count={notificationCount}>
                  <Image src="/file-plus.svg" alt="" width={25} height={25} />
                </Badge>
              </div>
            )}
            <span className="text-[#01443F] font-bold">Ирсэн төлөвлөгөөө1</span>
          </div>
        ) : chekcout > 2 ? (
          <div
            onClick={() => {
              handleMenuClick("/home/access");
            }}
            className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
          >
            {notificationCount < 1 ? (
              <Image
                src="/file-plus.svg"
                alt=""
                width={25}
                height={25}
                className="mr-2"
              />
            ) : (
              <div className="mr-2">
                <Badge count={notificationCount}>
                  <Image src="/file-plus.svg" alt="" width={25} height={25} />
                </Badge>
              </div>
            )}
            <span className="text-[#01443F] font-bold">Ирсэн төлөвлөгөө</span>
          </div>
        ) : (
          <div
            onClick={() => {
              handleMenuClick("/home/list");
            }}
            className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
          >
            {notificationCount < 1 ? (
              <Image
                src="/document.svg"
                alt=""
                width={25}
                height={25}
                className="mr-2"
              />
            ) : (
              <div className="mr-2">
                <Badge count={notificationCount}>
                  <Image src="/document.svg" alt="" width={25} height={25} />
                </Badge>
              </div>
            )}
            <span className="text-[#01443F] font-medium">Ирсэн төлөвлөгөө</span>
          </div>
        )
      ) : null}

      {chekcout > 1 ? null : (
        <p
          onClick={() => {
            handleMenuClick("/home/document");
          }}
          className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
        >
          <Image
            src="/file-plus.svg"
            alt=""
            width={25}
            height={25}
            className="mr-2"
          />
          <span className="text-[#01443F] font-medium">Тайлан үүсгэх</span>
        </p>
      )}
      {chekcout > 1 ? (
        <div
          onClick={() => {
            handleMenuClick("/home/allreport");
          }}
          className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
        >
          {reportNotificationCount < 1 ? (
            <Image
              src="/document.svg"
              alt=""
              width={25}
              height={25}
              className="mr-2"
            />
          ) : (
            <div className="mr-2">
              <Badge count={reportNotificationCount}>
                <Image src="/document.svg" alt="" width={25} height={25} />
              </Badge>
            </div>
          )}
          <span className="text-[#01443F] font-medium">Ирсэн тайлангууд</span>
        </div>
      ) : null}

      {manager === "cc573" && (
        <div
          onClick={() => {
            handleMenuClick("/home/manager");
          }}
          className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
        >
          {reportNotificationCount < 1 ? (
            <Image
              src="/document.svg"
              alt=""
              width={25}
              height={25}
              className="mr-2"
            />
          ) : (
            <div className="mr-2">
              <Badge count={reportNotificationCount}>
                <Image src="/document.svg" alt="" width={25} height={25} />
              </Badge>
            </div>
          )}
          <span className="text-[#01443F] font-medium">
            Ирсэн төлөвлөгөөнүүд (cc573)
          </span>
        </div>
      )}

      {chekcout > 1 ? (
        <p
          onClick={() => {
            handleMenuClick("/home/division");
          }}
          className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
        >
          <Image
            src="/file-plus.svg"
            alt=""
            width={25}
            height={25}
            className="mr-2"
          />
          <span className="text-[#01443F] font-medium">
            Хэлтсийн тайлангууд
          </span>
        </p>
      ) : null}
      {chekcout > 1 ? null : (
        <p
          onClick={() => {
            handleMenuClick("/home/testnumbers");
          }}
          className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
        >
          <Image
            src="/document.svg"
            alt=""
            width={25}
            height={25}
            className="mr-2"
          />
          <span className="text-[#01443F] font-medium">
            Ашигласан дугаарууд
          </span>
        </p>
      )}
      <p
        className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
        onClick={() => signOut()}
      >
        <Image
          src="/settings.svg"
          alt=""
          width={25}
          height={25}
          className="mr-2"
        />
        <span className="text-[#01443F] font-medium">Гарах</span>
      </p>
    </div>
  );
}
