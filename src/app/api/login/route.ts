import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { AuthUserLoginModel } from "@/types/type";

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
            jobPosition: true,
          },
        },
      },
    });

    const checkerp =
      record &&
      (await prisma.authUserData.findUnique({
        where: {
          authUserId: record.id,
        },
        select: {
          permissions: true,
        },
      }));

    if (!checkerp) {
      return NextResponse.json({
        success: false,
        data: "ERP дээр бүртгэлгүй байна",
      });
    }

    const token = {
      accesstoken:
        record &&
        jwt.sign(
          { _id: record.id, email: record.email },
          `${process.env.SECRET_KEY}`,
          {
            algorithm: "HS384",
            expiresIn: "1d",
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
      success: !record ? false : true,
      data: record,
      token: token,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
