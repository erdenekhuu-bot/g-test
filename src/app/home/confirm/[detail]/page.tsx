import { prisma } from "@/lib/prisma";
import { DefineLevel } from "@/lib/checkout";
import { ConfirmDetail } from "@/components/window/usable/confirmdetail/page";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ detail: number }>;
}) {
  const { detail } = await params;
  const record = await prisma.$transaction(async (tx) => {
    const data = await tx.document.findUnique({
      where: {
        id: Number(detail),
      },
      include: {
        confirm: {
          include: {
            employee: true,
          },
        },
      },
    });

    return data;
  });

  return <ConfirmDetail document={record} />;
}
