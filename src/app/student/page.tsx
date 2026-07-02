import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { GraduationCap, BookOpen, ClipboardList } from "lucide-react";

export default async function StudentDashboard() {
  const session = await auth();

  const student = await prisma.student.findFirst({
    where: { user: { email: session?.user?.email ?? "" } },
    include: { class: true },
  });

  const results = await prisma.result.findMany({
    where: { studentId: student?.id },
    include: { subject: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const attendance = await prisma.attendance.findMany({
    where: { studentId: student?.id },
    orderBy: { date: "desc" },
    take: 5,
  });

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const presentCount = await prisma.attendance.count({
    where: { studentId: student?.id, status: "PRESENT" },
  });

  const totalAttendance = await prisma.attendance.count({
    where: { studentId: student?.id },
  });

  const attendanceRate = totalAttendance > 0
    ? Math.round((presentCount / totalAttendance) * 100)
    : 0;

  return (
    <div>
      {/* Welcome */}
      <div className="bg-[#800020] text-white rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold">Welcome, {student?.name ?? "Student"}! 👋</h2>
        <p className="text-red-200 mt-1">
          Class: {student?.class?.name ?? "Not assigned"} • Admission No: {student?.admissionNo}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-blue-500 text-white p-3 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Subjects</p>
            <p className="text-2xl font-bold text-gray-800">{results.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-green-500 text-white p-3 rounded-lg">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Attendance Rate</p>
            <p className="text-2xl font-bold text-gray-800">{attendanceRate}%</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-purple-500 text-white p-3 rounded-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Latest Grade</p>
            <p className="text-2xl font-bold text-gray-800">
              {results[0]?.grade ?? "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Results</h3>
          {results.length === 0 ? (
            <p className="text-gray-400 text-sm">No results yet.</p>
          ) : (
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{result.subject.name}</p>
                    <p className="text-xs text-gray-500">{result.term} Term • {result.year}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800">{result.score}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      result.grade === "A" ? "bg-green-100 text-green-700" :
                      result.grade === "B" ? "bg-blue-100 text-blue-700" :
                      result.grade === "C" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {result.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <a href="/student/results" className="text-[#800020] text-sm font-medium mt-4 inline-block hover:underline">
            View all results →
          </a>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Latest Announcements</h3>
          {announcements.length === 0 ? (
            <p className="text-gray-400 text-sm">No announcements yet.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="py-2 border-b border-gray-100 last:border-0">
                  <p className="font-medium text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(a.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.content}</p>
                </div>
              ))}
            </div>
          )}
          <a href="/student/announcements" className="text-[#800020] text-sm font-medium mt-4 inline-block hover:underline">
            View all →
          </a>
        </div>
      </div>
    </div>
  );
}