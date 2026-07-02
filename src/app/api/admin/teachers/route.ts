import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const teachers = await prisma.teacher.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(teachers);
}

export async function POST(req: Request) {
  try {
    const { name, email, password, gender, phone } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "TEACHER",
        teacher: {
          create: {
            name,
            gender,
            phone: phone || null,
          },
        },
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }
}