import { prisma } from "@/lib/prisma";
import { GraduationCap, Users, BookOpen, ClipboardList } from "lucide-react";

export default async function AdminDashboard() {
  const totalStudents = await prisma.student.count();
  const totalTeachers = await prisma.teacher.count();
  const totalClasses = await prisma.class.count();
  const totalSubjects = await prisma.subject.count();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-blue-500 text-white p-3 rounded-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-green-500 text-white p-3 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Teachers</p>
            <p className="text-2xl font-bold text-gray-800">{totalTeachers}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-purple-500 text-white p-3 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Classes</p>
            <p className="text-2xl font-bold text-gray-800">{totalClasses}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-orange-500 text-white p-3 rounded-lg">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Subjects</p>
            <p className="text-2xl font-bold text-gray-800">{totalSubjects}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a href="/admin/students/new" className="bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:opacity-90 transition text-center">Add New Student</a>
        <a href="/admin/teachers/new" className="bg-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:opacity-90 transition text-center">Add New Teacher</a>
        <a href="/admin/classes/new" className="bg-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:opacity-90 transition text-center">Create Class</a>
        <a href="/admin/subjects/new" className="bg-orange-600 text-white px-6 py-4 rounded-xl font-semibold hover:opacity-90 transition text-center">Add Subject</a>
        <a href="/admin/announcements/new" className="bg-red-600 text-white px-6 py-4 rounded-xl font-semibold hover:opacity-90 transition text-center">Post Announcement</a>
        <a href="/admin/results" className="bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold hover:opacity-90 transition text-center">View Results</a>
      </div>
    </div>
  );
}