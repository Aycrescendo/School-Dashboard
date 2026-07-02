import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    include: { class: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <Link
          href="/admin/announcements/new"
          className="flex items-center gap-2 bg-[#800020] text-white px-4 py-2 rounded-lg hover:bg-[#6b001a] transition"
        >
          <Plus className="w-4 h-4" />
          Post Announcement
        </Link>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
            No announcements yet. Post your first announcement!
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{a.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {a.class ? `Class: ${a.class.name}` : "All Students & Parents"} •{" "}
                    {new Date(a.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-xs bg-[#800020] text-white px-3 py-1 rounded-full">
                  {a.class ? "Class" : "General"}
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