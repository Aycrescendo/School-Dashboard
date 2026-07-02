import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const students = await prisma.student.findMany({
    include: { class: true },
  });
  const classes = await prisma.class.findMany();
  return NextResponse.json({ students, classes });
}