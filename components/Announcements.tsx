"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<
    { title: string; description: string; created_at: string }[]
  >([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("notice")
        .select("title, description, created_at")
        .order("created_at", { ascending: false })
        .limit(3); // Show only the latest 3 on the homepage

      if (error) {
        console.error("Error fetching notices:", error);
      } else {
        setAnnouncements(data || []);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <Link href="/announcements" className="text-xs text-blue-500 hover:underline">
          View All
        </Link>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {announcements.length > 0 ? (
          announcements.map((notice, index) => (
            <div key={notice.created_at || index} className="bg-gray-100 rounded-md p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{notice.title}</h2>
                <span className="text-xs text-gray-500 bg-white rounded-md px-2 py-1">
                  {new Date(notice.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{notice.description}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No announcements available.</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
