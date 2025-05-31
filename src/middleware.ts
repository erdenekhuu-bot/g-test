import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/home" || req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  const token = await getToken({ req, secret: process.env.SECRET_KEY });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  try {
    const { payload } = await jwtVerify(
      token.accessToken,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|api|_next/static|_next/image|favicon.ico|upload/images).*)",
  ],
};
