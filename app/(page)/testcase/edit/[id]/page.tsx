import { prisma } from "@/action/prisma";
import ClientTestCaseAction from "@/components/client/ClientTestCaseAction";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await prisma.testCase.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      document: {
        select: {
          documentemployee: {
            select: {
              employee: true,
            },
          },
        },
      },
    },
  });
  return <ClientTestCaseAction record={record} />;
}
