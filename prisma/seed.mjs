import bcrypt from "bcryptjs";

const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({});

async function main() {
  const password = await bcrypt.hash("password123", 10);

  // Admin
  await prisma.user.upsert({
    where: { email: "admin@school.com" },
    update: {},
    create: {
      email: "admin@school.com",
      password,
      role: "ADMIN",
      admin: { create: { name: "Super Admin", phone: "08000000000" } },
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
      teacher: { create: { name: "Mr. Johnson", phone: "08011111111", gender: "MALE" } },
    },
  });

  // Student
  await prisma.user.upsert({
    where: { email: "student@school.com" },
    update: {},
    create: {
      email: "student@school.com",
      password,
      role: "STUDENT",
      student: { create: { name: "John Doe", gender: "MALE", admissionNo: "STU/2024/001" } },
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
      parent: { create: { name: "Mr. Doe Senior", phone: "08033333333" } },
    },
  });

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });