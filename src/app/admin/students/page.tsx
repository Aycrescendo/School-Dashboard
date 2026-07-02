import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    include: { class: true, user: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Students</h2>
        <Link
          href="/admin/students/new"
          className="flex items-center gap-2 bg-[#800020] text-white px-4 py-2 rounded-lg hover:bg-[#6b001a] transition"
        >
          <UserPlus className="w-4 h-4" />
          Add Student
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Admission No</th>
              <th className="px-6 py-4 text-left">Gender</th>
              <th className="px-6 py-4 text-left">Class</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  No students found. Add your first student!
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.admissionNo}</td>
                  <td className="px-6 py-4 text-gray-600">{student.gender}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {student.class?.name ?? "Not assigned"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.user.email}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/students/${student.id}`}
                      className="text-[#800020] hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}