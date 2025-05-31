import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DefineLevel } from "@/lib/checkout";

export async function GET() {
  try {
    const record = await prisma.departmentEmployeeRole.findMany({
      include: {
        employee: {
          include: {
            jobPosition: {
              select: {
                jobPositionGroup: true,
              },
            },
          },
        },
      },
    });
    const dataWithLevels = record.map((item) => ({
      ...item, // Spread the original item data
      level: DefineLevel(
        item.employee?.jobPosition?.jobPositionGroup?.name || ""
      ),
    }));

    // const convert = record.filter((item: any) => item.level < 4);
    // const result = convert.every((item) => item.rode === true);

    return NextResponse.json(
      {
        success: true,
        data: dataWithLevels,
      },
      { status: 200 }
    );
  } catch (error) {
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
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { DefineLevel } from "@/lib/checkout";

// export async function GET() {
//   try {
//     // First, get all records with the necessary relations
//     const records = await prisma.departmentEmployeeRole.findMany({
//       include: {
//         employee: {
//           include: {
//             jobPosition: {
//               select: {
//                 jobPositionGroup: true,
//               },
//             },
//           },
//         },
//         document: true, // Include document relation for updating
//       },
//     });

//     // Process records to add level and identify which need updating
//     const recordsWithLevels = records.map((item) => ({
//       ...item,
//       level: DefineLevel(
//         item.employee?.jobPosition?.jobPositionGroup?.name || ""
//       ),
//     }));

//     // Filter records that meet the criteria (level 2 and rode true)
//     const recordsToUpdate = recordsWithLevels.filter(
//       (item) => item.level < 4 && item.rode === true
//     );

//     // // Update all qualifying documents to MIDDLE state
//     // const updatePromises = recordsToUpdate.map((item) =>
//     //   prisma.document.update({
//     //     where: { id: item.documentId },
//     //     data: { state: "MIDDLE" },
//     //   })
//     // );

//     // // Execute all updates
//     // await Promise.all(updatePromises);

//     // // Return the processed data
//     // const responseData = recordsWithLevels.map((item) => ({
//     //   id: item.id,
//     //   level: item.level,
//     //   rode: item.rode,
//     //   documentState: item.document.state, // Include the current document state
//     // }));

//     return NextResponse.json(
//       {
//         success: true,
//         // message: `${recordsToUpdate.length} documents updated to MIDDLE state`,
//         // data: responseData,
//         data: recordsWithLevels,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
