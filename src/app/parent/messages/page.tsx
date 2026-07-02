import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function ParentMessagesPage() {
  const session = await auth();

  const parent = await prisma.parent.findFirst({
    where: { user: { email: session?.user?.email ?? "" } },
  });

  const messages = await prisma.message.findMany({
    where: { parentId: parent?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${!msg.isRead ? "border-[#800020]" : "border-gray-200"}`}>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{msg.subject}</h3>
                <div className="flex items-center gap-2">
                  {!msg.isRead && (
                    <span className="bg-[#800020] text-white text-xs px-2 py-1 rounded-full">New</span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-gray-600">{msg.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}