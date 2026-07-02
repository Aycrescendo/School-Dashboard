import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const subjects = await prisma.subject.findMany({
    include: { class: true, teacher: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(subjects);
}

export async function POST(req: Request) {
  try {
    const { name, classId, teacherId } = await req.json();
    const subject = await prisma.subject.create({
      data: { name, classId, teacherId: teacherId || null },
    });
    return NextResponse.json({ success: true, subject });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}