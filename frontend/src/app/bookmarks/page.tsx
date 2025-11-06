// app/blog/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { BlogSkeleton } from "@/components/BlogSkeleton";


export default function BlogDetail() {
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      
      <BlogSkeleton />

    </div>
  );
}
