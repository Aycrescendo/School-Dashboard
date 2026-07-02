"use client";

import { useState, useEffect } from "react";

export default function TeacherMessagesPage() {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    parentId: "",
    subject: "",
    content: "",
  });

  useEffect(() => {
    fetch("/api/teacher/parents")
      .then((r) => r.json())
      .then(setParents);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/teacher/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Message sent successfully!");
        setForm({ parentId: "", subject: "", content: "" });
      } else {
        setError("❌ Error: " + JSON.stringify(data));
      }
    } catch (err) {
      setError("❌ Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Message Parents</h2>

      <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Parent
            </label>
            <select
              value={form.parentId}
              onChange={(e) => setForm({ ...form, parentId: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            >
              <option value="">Select a parent</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.phone ? `(${p.phone})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="e.g. Your child's performance this term"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="Type your message to the parent here..."
            />
          </div>

          {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#800020] text-white px-6 py-2 rounded-lg hover:bg-[#6b001a] transition font-medium"
            >
              {saving ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}