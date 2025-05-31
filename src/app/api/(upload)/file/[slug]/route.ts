import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: any) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const { slug } = await params;
    if (!file) {
      return NextResponse.json(
        { error: "Файл хадгалагдсангүй" },
        { status: 404 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/upload/files");
    const filePath = path.join(uploadDir, file.name);

    const baseName = path.basename(file.name, path.extname(file.name));

    await writeFile(filePath, buffer);

    const relativePath = `/upload/files/${file.name}`;

    const record = await prisma.file.create({
      data: {
        fileName: file.name,
        path: relativePath,
        documentId: parseInt(slug),
      },
    });

    record &&
      (await prisma.document.update({
        where: {
          id: parseInt(slug),
        },
        data: {
          statement: baseName,
        },
      }));

    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      {
        status: 500,
      }
    );
  }
}
