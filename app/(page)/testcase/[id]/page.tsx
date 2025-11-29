import { prisma } from "@/action/prisma";
import ClientReport from "@/components/client/ClientReport";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await prisma.document.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      detail: true,
      documentemployee: {
        include: {
          employee: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
        },
      },
      budget: true,
      testcase: {
        orderBy: {
          id: "asc",
        },
        include: {
          testCaseImage: true,
        },
      },
      report: {
        include: {
          issue: true,
          usedphone: true,
        },
      },
    },
  });

  return <ClientReport data={record} />;
}
