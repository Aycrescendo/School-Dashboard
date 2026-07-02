import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function StudentResultsPage() {
  const session = await auth();

  const student = await prisma.student.findFirst({
    where: { user: { email: session?.user?.email ?? "" } },
  });

  const results = await prisma.result.findMany({
    where: { studentId: student?.id },
    include: { subject: true, teacher: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Results</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Subject</th>
              <th className="px-6 py-4 text-left">CA Score</th>
              <th className="px-6 py-4 text-left">Exam Score</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-left">Grade</th>
              <th className="px-6 py-4 text-left">Term</th>
              <th className="px-6 py-4 text-left">Year</th>
              <th className="px-6 py-4 text-left">Comment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                  No results yet.
                </td>
              </tr>
            ) : (
              results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{result.subject.name}</td>
                  <td className="px-6 py-4 text-gray-600">{result.caScore ?? "—"}</td>
                  <td className="px-6 py-4 text-gray-600">{result.examScore ?? "—"}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{result.score}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      result.grade === "A" ? "bg-green-100 text-green-700" :
                      result.grade === "B" ? "bg-blue-100 text-blue-700" :
                      result.grade === "C" ? "bg-yellow-100 text-yellow-700" :
                      result.grade === "D" ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {result.grade ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{result.term}</td>
                  <td className="px-6 py-4 text-gray-600">{result.year}</td>
                  <td className="px-6 py-4 text-gray-500 italic">{result.comment ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}