import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
export async function POST() {
  return NextResponse.json(true);
}

// (globalThis as any).otpStore = (globalThis as any).otpStore || {};
// export const otpStore: { [key: string]: { otp: number; expires: number } } = (
//   globalThis as any
// ).otpStore;

// export async function POST(req: Request) {
//   try {
//     const { authuserId } = await req.json();

//     const authuser = await prisma.authUser.findUnique({
//       where: {
//         id: authuserId,
//       },
//       select: {
//         mobile: true,
//       },
//     });

//     const phone = authuser?.mobile;

//     if (!phone) {
//       return NextResponse.json({
//         success: false,
//         message: "Phone number is required",
//       });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000);
//     otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 };

//     const sendSms = `http://sms-special.gmobile.mn/cgi-bin/sendsms?username=test1234&password=test12*34&from=245&to=${phone}&text=${otp}`;
//     const response = await axios.get(sendSms);

//     if (response.status !== 200) {
//       return NextResponse.json({
//         success: false,
//         message: "Failed to send OTP via SMS",
//       });
//     }

//     return NextResponse.json({ success: true, message: "success", otp });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error });
//   }
// }
