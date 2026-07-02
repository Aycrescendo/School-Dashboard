import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");

  console.log("Fetching students for classId:", classId);

  if (!classId) {
    return NextResponse.json([]);
  }

  const students = await prisma.student.findMany({
    where: { classId },
    orderBy: { name: "asc" },
  });

  console.log("Found students:", students.length);

  return NextResponse.json(students);
}