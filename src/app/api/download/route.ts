import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
