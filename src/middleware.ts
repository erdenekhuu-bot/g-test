import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/home") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
}
