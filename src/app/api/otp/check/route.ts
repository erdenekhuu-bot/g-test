import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST() {
  return NextResponse.json(true);
}
// (globalThis as any).otpStore = (globalThis as any).otpStore || {};
// export const otpStore: { [key: string]: { otp: number; expires: number } } = (
//   globalThis as any
// ).otpStore;

// export async function POST(req: Request) {
//   const { authuserId, otp } = await req.json();

//   const authuser = await prisma.authUser.findUnique({
//     where: {
//       id: authuserId,
//     },
//     select: {
//       mobile: true,
//     },
//   });
//   const phone = authuser?.mobile;

//   if (!phone || !otp) {
//     return NextResponse.json({
//       success: false,
//       message: "Phone and OTP are required",
//     });
//   }

//   const storedOtpData = otpStore[phone];

//   if (!storedOtpData || storedOtpData.otp !== otp) {
//     return NextResponse.json({ success: false, message: "Invalid OTP" });
//   }

//   if (Date.now() > storedOtpData.expires) {
//     return NextResponse.json({ success: false, message: "OTP expired" });
//   }

//   delete otpStore[phone];

//   return NextResponse.json({ success: true, message: "success" });
// }
