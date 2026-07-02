import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getGrade(score: number): string {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
}

export async function POST(req: Request) {
  try {
    const { entries } = await req.json();

    const teacher = await prisma.teacher.findFirst();
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    for (const entry of entries) {
      const total = entry.caScore + entry.examScore;
      const grade = getGrade(total);

      // Check if result already exists
      const existing = await prisma.result.findFirst({
        where: {
          studentId: entry.studentId,
          subjectId: entry.subjectId,
          term: entry.term,
          year: entry.year,
        },
      });

      if (existing) {
        await prisma.result.update({
          where: { id: existing.id },
          data: {
            caScore: entry.caScore,
            examScore: entry.examScore,
            score: total,
            grade,
            comment: entry.comment,
          },
        });
      } else {
        await prisma.result.create({
          data: {
            studentId: entry.studentId,
            subjectId: entry.subjectId,
            teacherId: teacher.id,
            caScore: entry.caScore,
            examScore: entry.examScore,
            score: total,
            grade,
            comment: entry.comment,
            term: entry.term,
            year: entry.year,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}