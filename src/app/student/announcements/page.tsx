import { prisma } from "@/lib/prisma";

export default async function StudentAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Announcements</h2>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
            No announcements yet.
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{a.title}</h3>
                <span className="text-xs text-gray-400">
                  {new Date(a.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-3 text-gray-600 text-sm">{a.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}