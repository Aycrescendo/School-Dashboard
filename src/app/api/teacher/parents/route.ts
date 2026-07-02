import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const parents = await prisma.parent.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(parents);
}