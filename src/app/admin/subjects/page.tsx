import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({
    include: { class: true, teacher: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Subjects</h2>
        <Link
          href="/admin/subjects/new"
          className="flex items-center gap-2 bg-[#800020] text-white px-4 py-2 rounded-lg hover:bg-[#6b001a] transition"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Subject Name</th>
              <th className="px-6 py-4 text-left">Class</th>
              <th className="px-6 py-4 text-left">Teacher</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subjects.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                  No subjects found. Add your first subject!
                </td>
              </tr>
            ) : (
              subjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{subject.name}</td>
                  <td className="px-6 py-4 text-gray-600">{subject.class.name}</td>
                  <td className="px-6 py-4 text-gray-600">{subject.teacher?.name ?? "Not assigned"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}