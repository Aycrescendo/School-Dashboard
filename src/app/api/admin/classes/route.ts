import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const classes = await prisma.class.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(classes);
}

export async function POST(req: Request) {
  try {
    const { name, teacherId } = await req.json();
    const cls = await prisma.class.create({
      data: { name, teacherId: teacherId || null },
    });
    return NextResponse.json({ success: true, cls });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Class name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}