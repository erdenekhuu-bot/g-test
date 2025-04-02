"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export function Menu() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const handleMenuClick = (url: string) => {
    router.push(url);
  };

  const chekcout = session?.user.permission.kind?.length;

  // const chekcout = session?.user.employee.jobPosition.name
  //   .toLowerCase()
  //   .includes("дарга");

  // const level = session?.user.employee.jobPosition.name
  //   .toLowerCase()
  //   .includes("захирал");
  return (
    <div>
      <p className="mt-20"></p>
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
        <span className="text-[#01443F] font-medium">
          Тестийн төлөвлөгөө үүсгэх
        </span>
      </p>
      {chekcout > 1 && (
        <p
          onClick={() => {
            handleMenuClick("/home/list");
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
            Ирсэн тестийн төлөвлөгөө
          </span>
        </p>
      )}

      {/* {chekcout && (
        <p
          onClick={() => {
            handleMenuClick("/home/permission");
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
          <span className="text-[#01443F] font-medium">Зөвшөөрөл</span>
        </p>
      )} */}

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
        <span className="text-[#01443F] font-medium">Хэслтсийн тайлангууд</span>
      </p>
      {/* <p
        onClick={() => {
          handleMenuClick("/home/report");
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
        <span className="text-[#01443F] font-medium">Нийт бүртгэл</span>
      </p> */}
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
        <span className="text-[#01443F] font-medium">Ашигласан дугаарууд</span>
      </p>
      <p
        className="text-[#01443F] mt-8 p-4 hover:cursor-pointer flex items-center hover:bg-[#F1F3F5]"
        onClick={() =>
          signOut({
            callbackUrl: `${process.env.NEXT_PUBLIC_API_URL}/`,
            redirect: true,
          })
        }
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
