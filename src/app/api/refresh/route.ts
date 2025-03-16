import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
interface JWTPayload extends jwt.JwtPayload {
  _id: string;
}

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    if (!request.token) {
      return NextResponse.json({
        success: false,
        data: "Token required",
      });
    }
    const token = jwt.verify(
      request.token,
      `${process.env.REFRESH_SECRET_KEY}`
    ) as JWTPayload;

    const newAccessToken = jwt.sign(
      { _id: token.id, email: token.email, type: "access" },
      `${process.env.SECRET_KEY}`,
      {
        expiresIn: "2h",
      }
    );

    return NextResponse.json({
      success: true,
      data: newAccessToken,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
