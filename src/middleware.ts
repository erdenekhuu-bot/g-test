import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/home" || req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  const res = NextResponse.next();

  res.headers.append("Access-Control-Allow-Credentials", "true");
  res.headers.append("Access-Control-Allow-Origin", "*");
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT"
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // if (req.nextUrl.pathname.startsWith("/api/")) {
  //   const authHeader = req.headers.get("authorization");

  //   if (!authHeader || !authHeader.startsWith("Bearer")) {
  //     return NextResponse.json(
  //       { success: false, data: "Токен авах шаардлагатай" },
  //       { status: 401 }
  //     );
  //   }

  //   const token = authHeader.split(" ")[1];
  //   try {
  //     const secret = new TextEncoder().encode(process.env.SECRET_KEY as string);
  //     const { payload } = await jwtVerify(token, secret);

  //     req.headers.set("user", JSON.stringify(payload));

  //     return NextResponse.next();
  //   } catch (error) {
  //     return NextResponse.json(
  //       { success: false, data: "Буруу токен" },
  //       { status: 401 }
  //     );
  //   }
  // }

  return res;
}

export const config = {
  matcher: ["/home", "/", "/api/document/:path*"],
};
