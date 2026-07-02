import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { entries } = await req.json();

    const teacher = await prisma.teacher.findFirst();
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    for (const entry of entries) {
      const existing = await prisma.attendance.findFirst({
        where: {
          studentId: entry.studentId,
          classId: entry.classId,
          date: {
            gte: new Date(entry.date + "T00:00:00.000Z"),
            lte: new Date(entry.date + "T23:59:59.999Z"),
          },
        },
      });

      if (existing) {
        await prisma.attendance.update({
          where: { id: existing.id },
          data: { status: entry.status },
        });
      } else {
        await prisma.attendance.create({
          data: {
            studentId: entry.studentId,
            classId: entry.classId,
            teacherId: teacher.id,
            status: entry.status,
            date: new Date(entry.date),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}