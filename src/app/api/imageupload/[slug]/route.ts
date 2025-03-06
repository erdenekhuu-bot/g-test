import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: any) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("image") as File[];
    const { slug } = await params;
    if (!files.length) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public/upload/images");
    const filePaths: string[] = [];

    const testcase = await prisma.testCase.findUnique({
      where: {
        id: slug,
      },
    });

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, `${file.name}`);

      await writeFile(filePath, buffer);
      filePaths.push(`/upload/images/${file.name}`);
    }

    const testimage = filePaths.map((item: any) => ({
      path: item,
      testCaseId: slug,
    }));

    const record = await prisma.testCaseImage.createMany({
      data: testimage,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
