import { NextRequest, NextResponse } from "next/server";
import { runSync } from "@/lib/sync_service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Татаж байна...");
    await runSync();
    console.log("Татаж дууссан");
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
