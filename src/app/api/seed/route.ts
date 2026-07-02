import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const password = await bcrypt.hash("password123", 10);

    // Admin
    await prisma.user.upsert({
      where: { email: "admin@school.com" },
      update: {},
      create: {
        email: "admin@school.com",
        password,
        role: "ADMIN",
        admin: {
          create: {
            name: "Super Admin",
            phone: "08000000000",
          },
        },
      },
    });

    // Teacher
    await prisma.user.upsert({
      where: { email: "teacher@school.com" },
      update: {},
      create: {
        email: "teacher@school.com",
        password,
        role: "TEACHER",
        teacher: {
          create: {
            name: "Mr. Johnson",
            phone: "08011111111",
            gender: "MALE",
          },
        },
      },
    });

    // Create class JSS 1A and assign teacher
    const teacher = await prisma.teacher.findFirst({
      where: { user: { email: "teacher@school.com" } },
    });

    const jss1a = await prisma.class.upsert({
      where: { name: "JSS 1A" },
      update: { teacherId: teacher?.id },
      create: {
        name: "JSS 1A",
        teacherId: teacher?.id,
      },
    });

    // Create subject Mathematics
    await prisma.subject.upsert({
      where: { id: "mathematics-jss1a" },
      update: {},
      create: {
        id: "mathematics-jss1a",
        name: "Mathematics",
        classId: jss1a.id,
        teacherId: teacher?.id,
      },
    });

    // Parent
    await prisma.user.upsert({
      where: { email: "parent@school.com" },
      update: {},
      create: {
        email: "parent@school.com",
        password,
        role: "PARENT",
        parent: {
          create: {
            name: "Mr. Doe Senior",
            phone: "08033333333",
          },
        },
      },
    });

    // Get parent record
    const parentRecord = await prisma.parent.findFirst({
      where: { user: { email: "parent@school.com" } },
    });

    // Student — assigned to JSS 1A and linked to parent
    await prisma.user.upsert({
      where: { email: "student@school.com" },
      update: {},
      create: {
        email: "student@school.com",
        password,
        role: "STUDENT",
        student: {
          create: {
            name: "John Doe",
            gender: "MALE",
            admissionNo: "STU/2024/001",
            classId: jss1a.id,
            parentId: parentRecord?.id,
          },
        },
      },
    });

    // Update existing student — assign class and parent
    const existingStudent = await prisma.student.findFirst({
      where: { admissionNo: "STU/2024/001" },
    });

    if (existingStudent) {
      await prisma.student.update({
        where: { id: existingStudent.id },
        data: {
          classId: jss1a.id,
          parentId: parentRecord?.id,
        },
      });
    }

    return NextResponse.json({ message: "✅ Seed completed successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}