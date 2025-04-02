import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { AuthUserLoginModel } from "@/types/type";
import { CheckErp } from "@/lib/checkout";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request: AuthUserLoginModel = await req.json();

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
          },
        },
      },
    });

    if (request.password !== "Gmobile98$") {
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
      permission: checkerp,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
