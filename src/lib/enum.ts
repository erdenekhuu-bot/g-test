import { DocumentStateEnum } from "@prisma/client";

export function Checking(arg: any) {
  switch (arg) {
    case 0:
      return DocumentStateEnum.DENY;
    case 1:
      return DocumentStateEnum.PENDING;
    case 2:
      return DocumentStateEnum.FORWARD;
    case 3:
      return DocumentStateEnum.ACCESS;
    default:
      return DocumentStateEnum.DENY;
  }
}

export function MiddleCheck(arg: any) {
  switch (arg) {
    case 1:
      return DocumentStateEnum.MIDDLE;
    case 2:
      return DocumentStateEnum.ACCESS;
    default:
      return DocumentStateEnum.FORWARD;
  }
}
