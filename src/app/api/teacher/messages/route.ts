import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { parentId, subject, content } = await req.json();

    const message = await prisma.message.create({
      data: {
        parentId,
        subject,
        content,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  const messages = await prisma.message.findMany({
    include: { parent: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(messages);
}