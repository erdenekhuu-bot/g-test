import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function POST(req: NextRequest, { params }: any) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const files = formData.getAll("file") as File[];
    const { slug } = await params;

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: "Хэмжээ хитэрсэн 2 MB",
          },
          { status: 413 }
        );
      }
    }

    const uploadDir = path.join(process.cwd(), "public/upload/images");

    const filePaths: string[] = [];
    const filePath = path.join(uploadDir, `${file.name}`);

    let record;

    if (files.length === 1) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      filePaths.push(`/upload/images/${file.name}`);
    }

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, `${file.name}`);

      await writeFile(filePath, buffer);
      filePaths.push(`/upload/images/${file.name}`);
    }

    const testimage = filePaths.map((item: any) => ({
      path: item,
      testCaseId: parseInt(slug),
    }));

    if (files.length > 1) {
      record = await prisma.testCaseImage.createMany({
        data: testimage,
      });
    } else {
      record = await prisma.testCaseImage.create({
        data: {
          path: filePaths[0],
          testCaseId: parseInt(slug),
        },
      });
    }

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
