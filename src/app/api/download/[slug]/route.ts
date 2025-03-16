import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: any) {
  return NextResponse.json({
    success: true,
  });
}

// export async function GET(req: NextRequest, { params }: any) {
//   const { slug } = await params;
//   const record = await prisma.document.findUnique({
//     where: {
//       id: parseInt(slug),
//     },
//     include: {
//       detail: true,
//       documentemployee: true,
//     },
//   });

//   if (!record) {
//     return NextResponse.json(
//       { success: false, error: "Баримт олдсонгүй" },
//       { status: 404 }
//     );
//   }

//   const pdfDir = path.join(process.cwd(), "public", "pdf");
//   if (!fs.existsSync(pdfDir)) {
//     fs.mkdirSync(pdfDir, { recursive: true });
//   }

//   const fontPath = path.join(process.cwd(), "public", "fonts", "Arial.ttf");
//   const outputPath = path.join(pdfDir, `${record.generate}.pdf`);
//   const doc = new PDFDocument({
//     font: "",
//   });

//   const stream = fs.createWriteStream(outputPath);
//   doc.pipe(stream);

//   doc.registerFont("Arial", fontPath);
//   doc.font("Arial");
//   doc.fontSize(14);

//   doc.fontSize(14).text(`"ЖИМОБАЙЛ"ХХК ${record.generate}`, {
//     align: "justify",
//     width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
//   });

//   const text = record.title;
//   const textWidth = doc.widthOfString(text);
//   const pageWidth = doc.page.width;
//   const x = (pageWidth - textWidth) / 2;

//   doc.moveDown(0.5);
//   doc.fontSize(20).text(text, x, doc.y);

//   doc.moveDown(1);
//   doc.fontSize(12).text(`ЗОРИЛГО: ${record.detail[0].intro}`, 50, doc.y);

//   doc.fontSize(12).text(`${record.documentemployee}`).moveDown(0.5);

//   doc.text(`${record.generate}`);
//   doc.text(`"ЖИМОБАЙЛ"ХХК`, { align: "center" });
//   doc.moveDown();
//   doc.text(`${record.generate || ""}`, { align: "center" });
//   doc.moveDown();
//   doc.text(`${record.title || ""}`);

//   return new Promise((resolve, reject) => {
//     stream.on("finish", () => {
//       const fileStream = fs.createReadStream(outputPath);
//       const readableStream = new ReadableStream({
//         start(controller) {
//           fileStream.on("data", (chunk) => {
//             controller.enqueue(chunk);
//           });

//           fileStream.on("end", () => {
//             controller.close();
//           });

//           fileStream.on("error", (err) => {
//             controller.error(err);
//           });
//         },
//       });

//       const encodedFilename = encodeURIComponent(`${record.generate}.pdf`);

//       const response = new NextResponse(readableStream);
//       response.headers.set(
//         "Content-Disposition",
//         `attachment; filename*=UTF-8''${encodedFilename}`
//       );
//       response.headers.set("Content-Type", "application/pdf");

//       resolve(response);
//     });

//     stream.on("error", (error) => {
//       reject(
//         NextResponse.json({
//           success: false,
//           data: error.message,
//         })
//       );
//     });

//     doc.end();
//   });
// }
