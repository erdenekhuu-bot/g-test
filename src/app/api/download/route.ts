import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), "public", "sample.pdf");
    const fileBuffer = await fs.readFile(filePath);
    const response = new NextResponse(fileBuffer);
    response.headers.set(
      "Content-Disposition",
      'attachment; filename="sample.pdf"'
    );
    response.headers.set("Content-Type", "application/pdf");
    return response;
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
