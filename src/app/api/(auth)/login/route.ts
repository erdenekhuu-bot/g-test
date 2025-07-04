import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { AuthUserLoginModel } from "@/types/type";
import { CheckErp } from "@/lib/checkout";
import { DecryptAndChecking } from "@/lib/checkout";

export async function POST(req: NextRequest) {
  try {
    const request: AuthUserLoginModel = await req.json();
    const response: any = await DecryptAndChecking(request);

    if (response.status !== 200) {
      return NextResponse.json(
        {
          success: false,
          data: "Нууц үг буруу байна",
        },
        {
          status: 404,
        }
      );
    }
    const record = await prisma.authUser.findFirst({
      where: {
        username: request.username,
      },
      include: {
        employee: {
          select: {
            jobPosition: {
              select: {
                jobPositionGroup: true,
              },
            },
            departmentEmployeeRole: {
              where: {
                rode: false,
              },
            },
          },
        },
      },
    });
    const checkerp =
      record &&
      (await CheckErp(
        record?.employee?.jobPosition?.jobPositionGroup?.name as string,
        record
      ));

    const token = {
      accesstoken:
        record &&
        jwt.sign(
          { _id: record.id, email: record.email },
          `${process.env.SECRET_KEY}`,
          {
            algorithm: "HS384",
            expiresIn: "1h",
          }
        ),
      refreshtoken:
        record &&
        jwt.sign(
          { _id: record.id, email: record.email },
          `${process.env.REFRESH_SECRET_KEY}`,
          {
            algorithm: "HS384",
            expiresIn: "1d",
          }
        ),
    };
    return NextResponse.json({
      success: true,
      data: record,
      token: token,
      employee: record?.employee,
      permission: checkerp,
      received: 0,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
