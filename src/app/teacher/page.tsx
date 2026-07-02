export default function TeacherDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome, Teacher! 👨‍🏫</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <a href="/teacher/attendance" className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition">
          <div className="bg-blue-500 text-white p-3 rounded-lg text-2xl">📋</div>
          <div>
            <p className="font-semibold text-gray-800">Take Attendance</p>
            <p className="text-sm text-gray-500">Mark today's attendance</p>
          </div>
        </a>
        <a href="/teacher/results" className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition">
          <div className="bg-green-500 text-white p-3 rounded-lg text-2xl">📝</div>
          <div>
            <p className="font-semibold text-gray-800">Enter Results</p>
            <p className="text-sm text-gray-500">Add scores & comments</p>
          </div>
        </a>
        <a href="/teacher/messages" className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition">
          <div className="bg-purple-500 text-white p-3 rounded-lg text-2xl">💬</div>
          <div>
            <p className="font-semibold text-gray-800">Message Parents</p>
            <p className="text-sm text-gray-500">Send messages to parents</p>
          </div>
        </a>
      </div>
    </div>
  );
}