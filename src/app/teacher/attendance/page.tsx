"use client";

import { useState, useEffect } from "react";

export default function AttendancePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/classes")
      .then((r) => r.json())
      .then(setClasses);
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      setStudents([]);
      setAttendance({});
      setSuccess("");
      setError("");

      fetch(`/api/teacher/students?classId=${selectedClass}`)
        .then((r) => r.json())
        .then((data) => {
          setStudents(data);
          // Default all students to PRESENT
          const defaultAttendance: any = {};
          data.forEach((s: any) => {
            defaultAttendance[s.id] = "PRESENT";
          });
          setAttendance(defaultAttendance);
          setLoading(false);
        });
    }
  }, [selectedClass]);

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendance((prev: any) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedClass) {
      setError("Please select a class.");
      return;
    }
    setSaving(true);
    setSuccess("");
    setError("");

    const entries = students.map((student) => ({
      studentId: student.id,
      classId: selectedClass,
      status: attendance[student.id] || "PRESENT",
      date,
    }));

    try {
      const res = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Attendance saved successfully!");
      } else {
        setError("❌ Error: " + JSON.stringify(data));
      }
    } catch (err) {
      setError("❌ Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter((s) => s === "PRESENT").length;
  const absentCount = Object.values(attendance).filter((s) => s === "ABSENT").length;
  const lateCount = Object.values(attendance).filter((s) => s === "LATE").length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Take Attendance</h2>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Loading students...
        </div>
      )}

      {/* No class selected */}
      {!selectedClass && !loading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Please select a class to take attendance.
        </div>
      )}

      {/* No students */}
      {!loading && selectedClass && students.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          No students found in this class.
        </div>
      )}

      {/* Attendance Table */}
      {!loading && students.length > 0 && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-sm text-green-600">Present</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-sm text-red-600">Absent</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
              <p className="text-sm text-yellow-600">Late</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Student</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {student.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        {["PRESENT", "ABSENT", "LATE"].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleAttendanceChange(student.id, status)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                              attendance[student.id] === status
                                ? status === "PRESENT"
                                  ? "bg-green-500 text-white"
                                  : status === "ABSENT"
                                  ? "bg-red-500 text-white"
                                  : "bg-yellow-500 text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-[#800020] text-white px-6 py-2 rounded-lg hover:bg-[#6b001a] transition font-medium"
              >
                {saving ? "Saving..." : "Save Attendance"}
              </button>
              {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}