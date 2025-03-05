import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {
  try {
    const request = await req.json();
    const record = await prisma.authUser.findFirst({
      where: {
        email: request.email,
      },
    });
    const view =
      record &&
      (await prisma.authUserData.findFirst({
        where: {
          authUserId: record.id,
        },
        select: {
          permissions: true,
        },
      }));
    const token = {
      accesstoken:
        record &&
        jwt.sign({ email: record?.email }, "GMOBILE_KEY", {
          algorithm: "HS384",
          expiresIn: "1d",
        }),
      refreshtoken:
        record &&
        jwt.sign({ email: record?.email }, "GMOBILE_REFRESH_KEY", {
          algorithm: "HS384",
          expiresIn: "1d",
        }),
    };
    return NextResponse.json({
      success: !record ? false : true,
      data: record,
      token: token,
      view: view,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
