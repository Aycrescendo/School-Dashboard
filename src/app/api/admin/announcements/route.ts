import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    include: { class: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(announcements);
}

export async function POST(req: Request) {
  try {
    const { title, content, classId } = await req.json();
    const announcement = await prisma.announcement.create({
      data: { title, content, classId: classId || null },
    });
    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post announcement" }, { status: 500 });
  }
}