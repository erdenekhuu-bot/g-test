import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

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

    return NextResponse.json(
      {
        success: true,
        data: relativePath,
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
