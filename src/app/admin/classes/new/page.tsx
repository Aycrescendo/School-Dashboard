"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teachers, setTeachers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", teacherId: "" });

  useEffect(() => {
    fetch("/api/admin/teachers").then((r) => r.json()).then(setTeachers);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error || "Something went wrong"); return; }
    router.push("/admin/classes");
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/classes" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Create Class</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="e.g. JSS 1A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Class Teacher</label>
            <select
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            >
              <option value="">Select a teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#800020] text-white px-6 py-2 rounded-lg hover:bg-[#6b001a] transition font-medium"
            >
              {loading ? "Saving..." : "Create Class"}
            </button>
            <Link href="/admin/classes" className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}