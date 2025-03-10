import { NextRequest, NextResponse } from "next/server";

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
