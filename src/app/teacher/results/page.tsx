"use client";

import { useState, useEffect } from "react";

export default function TeacherResultsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [term, setTerm] = useState("FIRST");
  const [year, setYear] = useState("2025/2026");
  const [scores, setScores] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/classes")
      .then((r) => r.json())
      .then(setClasses)
      .catch((err) => console.error("Failed to load classes:", err));
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      setStudents([]);
      setSubjects([]);
      setScores({});
      setSuccess("");
      setError("");

      fetch(`/api/admin/subjects`)
        .then((r) => r.json())
        .then((data) => {
          const filtered = data.filter((s: any) => s.classId === selectedClass);
          setSubjects(filtered);
        })
        .catch((err) => console.error("Failed to load subjects:", err));

      fetch(`/api/teacher/students?classId=${selectedClass}`)
        .then((r) => r.json())
        .then((data) => {
          console.log("Students loaded:", data);
          setStudents(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load students:", err);
          setLoading(false);
        });
    }
  }, [selectedClass]);

  const handleScoreChange = (studentId: string, field: string, value: string) => {
    setScores((prev: any) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSubject) {
      setError("Please select a subject first.");
      return;
    }

    setSaving(true);
    setSuccess("");
    setError("");

    const entries = students.map((student) => ({
      studentId: student.id,
      subjectId: selectedSubject,
      caScore: parseFloat(scores[student.id]?.caScore || "0"),
      examScore: parseFloat(scores[student.id]?.examScore || "0"),
      comment: scores[student.id]?.comment || "",
      term,
      year,
    }));

    console.log("Submitting:", JSON.stringify(entries, null, 2));

    try {
      const res = await fetch("/api/teacher/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        setSuccess("✅ Results saved successfully!");
      } else {
        setError("❌ Error: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("❌ Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Results</h2>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            >
              <option value="FIRST">First Term</option>
              <option value="SECOND">Second Term</option>
              <option value="THIRD">Third Term</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
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
          Please select a class to get started.
        </div>
      )}

      {/* No students */}
      {!loading && selectedClass && students.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          No students found in this class.
        </div>
      )}

      {/* Select subject prompt */}
      {!loading && students.length > 0 && !selectedSubject && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Please select a subject to enter results.
        </div>
      )}

      {/* Results table */}
      {!loading && students.length > 0 && selectedSubject && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Student</th>
                <th className="px-6 py-4 text-left">CA Score (40)</th>
                <th className="px-6 py-4 text-left">Exam Score (60)</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Grade</th>
                <th className="px-6 py-4 text-left">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => {
                const ca = parseFloat(scores[student.id]?.caScore || "0");
                const exam = parseFloat(scores[student.id]?.examScore || "0");
                const total = ca + exam;
                const grade =
                  total >= 70 ? "A" :
                  total >= 60 ? "B" :
                  total >= 50 ? "C" :
                  total >= 40 ? "D" : "F";

                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        max="40"
                        value={scores[student.id]?.caScore || ""}
                        onChange={(e) => handleScoreChange(student.id, "caScore", e.target.value)}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={scores[student.id]?.examScore || ""}
                        onChange={(e) => handleScoreChange(student.id, "examScore", e.target.value)}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">{total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        grade === "A" ? "bg-green-100 text-green-700" :
                        grade === "B" ? "bg-blue-100 text-blue-700" :
                        grade === "C" ? "bg-yellow-100 text-yellow-700" :
                        grade === "D" ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={scores[student.id]?.comment || ""}
                        onChange={(e) => handleScoreChange(student.id, "comment", e.target.value)}
                        className="w-48 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                        placeholder="e.g. Excellent performance"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-[#800020] text-white px-6 py-2 rounded-lg hover:bg-[#6b001a] transition font-medium"
            >
              {saving ? "Saving..." : "Save Results"}
            </button>
            {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}