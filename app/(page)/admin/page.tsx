import { prisma } from "@/action/prisma";
import ClientAdmin from "@/components/client/ClientAdmin";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 10;
  const record = await prisma.$transaction(async (tx) => {
    const employee = await tx.employee.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [
          {
            isDeleted: false,
          },
          {
            firstname: {
              contains: search || "",
            },
          },
        ],
      },
      include: {
        jobPosition: true,
        department: true,
      },
    });

    return employee;
  });
  const totalCount = await prisma.employee.count({
    where: {
      isDeleted: false,
    },
  });
  return (
    <ClientAdmin
      data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
