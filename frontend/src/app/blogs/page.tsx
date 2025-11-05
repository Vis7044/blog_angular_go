"use client";

import { useEffect, useState } from "react";
import { blogService, Blog } from "@/services/blogService";
import { BlogCard } from "@/components/BlogCard";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import OverlaySpinner from "@/components/OverlaySpinner";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const userBlogs = await blogService.getBlogsByUser();
        setBlogs(userBlogs);
      } catch (err: any) {
        setError(err?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <OverlaySpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="h-auto rounded-xl bg-gray-50 py-10 px-6">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Blogs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and view your blog posts here
          </p>
        </div>
        <button
          onClick={() => router.push("/write")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Blog
        </button>
      </div>

      {/* Blog List */}
      <div className="max-w-6xl mx-auto">
        {blogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">You haven’t written any blogs yet.</p>
            <button
              onClick={() => router.push("/blogs/create")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Write Your First Blog
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={{ ...blog, _id: blog._id || "", comments: blog.comments.map((comment) => comment.toString()) }}
                onClick={(id) => router.push(`/blogs/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
