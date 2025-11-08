"use client";

import { useEffect, useState, useMemo } from "react";
import { blogService, Blog } from "@/services/blogService";
import { BlogCard } from "@/components/BlogCard";
import { useRouter } from "next/navigation";
import OverlaySpinner from "@/components/OverlaySpinner";
import { Filter, RefreshCw } from "lucide-react";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
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

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogs.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return ["All", ...Array.from(tagSet)];
  }, [blogs]);

  // Status filters
  const statusOptions = ["All", "Published", "Draft"];

  // Filter blogs based on selected tag + status
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesTag =
        selectedTag === "All" || blog.tags.includes(selectedTag);
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Published" && blog.status === 1) ||
        (selectedStatus === "Draft" && blog.status === 0);
      return matchesTag && matchesStatus;
    });
  }, [blogs, selectedTag, selectedStatus]);

  if (loading) {
    return (
      <div className="h-auto rounded-xl bg-gray-50 py-10 px-6">
        <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Blogs</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage and view your blog posts here
            </p>
          </div>
          <button
            disabled
            className="bg-gray-300 text-white px-4 py-2 rounded-lg cursor-not-allowed"
          >
            + New Blog
          </button>
        </div>

        {/* Skeleton Loader */}
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <OverlaySpinner key={idx} />
          ))}
        </div>
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
      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-6 bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Filter size={18} />
            <span>Filters</span>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">Tag:</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setSelectedTag("All");
              setSelectedStatus("All");
            }}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Blog List */}
      <div className="max-w-6xl mx-auto">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">
              No blogs found with the selected filters.
            </p>
            <button
              onClick={() => router.push("/write")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Write a New Blog
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={{
                  ...blog,
                  _id: blog._id || "",
                  comments: blog.comments.map((comment) => comment.toString()),
                }}
                onClick={(id) => router.push(`/blogs/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
