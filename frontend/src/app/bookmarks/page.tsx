// app/blog/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { BlogSkeleton } from "@/components/BlogSkeleton";
import { Avatars } from "@/components/Avatars";
import { Edit2 } from "lucide-react";



export default function BlogDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 border border-indigo-500 rounded-md hover:bg-indigo-50 transition"
      >
        <Edit2 size={14} />
        Change Avatar
      </button>

      {/* Avatar Modal */}
      {isModalOpen && (
        <Avatars
          onClose={() => setIsModalOpen(false)}
          onSelect={(url) => setProfilePic(url)}
        />
      )}

    </div>
  );
}
