import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function ParentDashboard() {
  const session = await auth();

  const parent = await prisma.parent.findFirst({
    where: { user: { email: session?.user?.email ?? "" } },
    include: { students: { include: { class: true } } },
  });

  const messages = await prisma.message.findMany({
    where: { parentId: parent?.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const unreadMessages = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      {/* Welcome */}
      <div className="bg-[#800020] text-white rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold">Welcome, {parent?.name ?? "Parent"}! 👋</h2>
        <p className="text-red-200 mt-1">
          {parent?.students.length ?? 0} child(ren) enrolled
        </p>
      </div>

      {/* Children */}
      <h3 className="text-lg font-bold text-gray-800 mb-4">Your Children</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {parent?.students.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-gray-400">
            No children linked to your account yet.
          </div>
        ) : (
          parent?.students.map((student) => (
            <div key={student.id} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#800020] text-white flex items-center justify-center text-xl font-bold">
                {student.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{student.name}</p>
                <p className="text-sm text-gray-500">
                  {student.class?.name ?? "No class"} • {student.admissionNo}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Messages</h3>
            {unreadMessages > 0 && (
              <span className="bg-[#800020] text-white text-xs px-2 py-1 rounded-full">
                {unreadMessages} unread
              </span>
            )}
          </div>
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`py-3 border-b border-gray-100 last:border-0 ${!msg.isRead ? "opacity-100" : "opacity-60"}`}>
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-gray-800">{msg.subject}</p>
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#800020] mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
          <a href="/parent/messages" className="text-[#800020] text-sm font-medium mt-4 inline-block hover:underline">
            View all messages →
          </a>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Announcements</h3>
          {announcements.length === 0 ? (
            <p className="text-gray-400 text-sm">No announcements yet.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="py-2 border-b border-gray-100 last:border-0">
                  <p className="font-medium text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.content}</p>
                </div>
              ))}
            </div>
          )}
          <a href="/parent/announcements" className="text-[#800020] text-sm font-medium mt-4 inline-block hover:underline">
            View all →
          </a>
        </div>
      </div>
    </div>
  );
}