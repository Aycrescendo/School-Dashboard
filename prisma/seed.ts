import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  // Admin
  const adminUser = await prisma.user.upsert({
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
  const teacherUser = await prisma.user.upsert({
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

  // Student
  const studentUser = await prisma.user.upsert({
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
        },
      },
    },
  });

  // Parent
  const parentUser = await prisma.user.upsert({
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

  console.log("✅ Seed completed!", { adminUser, teacherUser, studentUser, parentUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });