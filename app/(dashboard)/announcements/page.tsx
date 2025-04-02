"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<
    { id: string; title: string; description: string; created_at: string }[]
  >([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("notice")
      .select("id, title, description, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notices:", error);
    } else {
      setAnnouncements(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Title and Description are required!");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("notice")
      .insert([{ title, description }]);

    setLoading(false);

    if (error) {
      console.error("Error adding announcement:", error);
      alert("Failed to add announcement");
    } else {
      setTitle("");
      setDescription("");
      fetchAnnouncements();
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("notice").delete().eq("id", id);

    if (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    } else {
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="p-4  text-amber-50  h-full w-full overflow-y-scroll gap-4 rounded-tl-2xl border  md:p-10 border-neutral-700 bg-neutral-900">
      <div className="flex items-center justify-between  mb-4">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>

      {/* Announcement Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4  rounded-md shadow-md mb-6">
        <h2 className="text-lg text-black font-semibold mb-2">Add New Announcement</h2>
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border bg-gray-300 text-gray-700 font-bold rounded-md mb-2"
        />
        <textarea
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border text-gray-800 font-bold bg-gray-300 rounded-md mb-2"
          rows={3}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Announcement"}
        </button>
      </form>

      {/* Announcement List */}
      <div className="flex flex-col gap-4">
        {announcements.length > 0 ? (
          announcements.map((notice) => (
            <div key={notice.id} className="bg-gray-100 rounded-md p-4 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-black">{notice.title}</h2>
                <span className="text-xs text-gray-500 bg-white rounded-md px-2 py-1">
                  {new Date(notice.created_at).toLocaleDateString()}
                </span>
                <p className="text-sm text-gray-600 mt-1">{notice.description}</p>
              </div>
              <button
                onClick={() => handleDelete(notice.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No announcements available.</p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
