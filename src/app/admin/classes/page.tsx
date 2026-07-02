import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ClassesPage() {
  const classes = await prisma.class.findMany({
    include: { teacher: true, students: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Classes</h2>
        <Link
          href="/admin/classes/new"
          className="flex items-center gap-2 bg-[#800020] text-white px-4 py-2 rounded-lg hover:bg-[#6b001a] transition"
        >
          <Plus className="w-4 h-4" />
          Create Class
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Class Name</th>
              <th className="px-6 py-4 text-left">Class Teacher</th>
              <th className="px-6 py-4 text-left">No. of Students</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No classes found. Create your first class!
                </td>
              </tr>
            ) : (
              classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{cls.name}</td>
                  <td className="px-6 py-4 text-gray-600">{cls.teacher?.name ?? "Not assigned"}</td>
                  <td className="px-6 py-4 text-gray-600">{cls.students.length}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/classes/${cls.id}`}
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