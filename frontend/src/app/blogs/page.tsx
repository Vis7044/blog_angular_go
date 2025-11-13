"use client";

import { useEffect, useState, useMemo } from "react";
import { blogService, Blog } from "@/services/blogService";
import MyBlogsFilters from "@/components/MyBlogsFilters";
import MyBlogsGrid from "@/components/MyBlogsGrid";
import { BlogSkeleton } from "@/components/BlogSkeleton";
import { useRouter } from "next/navigation";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Collect unique tags for filter dropdown
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogs.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return ["All", ...Array.from(tagSet)];
  }, [blogs]);

  // Filter + search logic
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesTag =
        selectedTag === "All" || blog.tags.includes(selectedTag);
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Published" && blog.status === 1) ||
        (selectedStatus === "Draft" && blog.status === 0);
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTag && matchesStatus && matchesSearch;
    });
  }, [blogs, selectedTag, selectedStatus, searchQuery]);

  // Loading State
  if (loading)
    return (
      <div className="max-w-6xl mx-auto py-10">
        <BlogSkeleton />
      </div>
    );

  // Error State
  if (error)
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-500 text-lg">
        {error}
      </div>
    );

  // Main UI
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Blogs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and view your blog posts here
          </p>
        </div>
        <button
          onClick={() => router.push("/write")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
        >
          + New Blog
        </button>
      </div>

      {/* Filters */}
      <MyBlogsFilters
        allTags={allTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onReset={() => {
          setSelectedTag("All");
          setSelectedStatus("All");
          setSearchQuery("");
        }}
      />

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto">
        {filteredBlogs.length > 0 ? (
          <MyBlogsGrid blogs={filteredBlogs} />
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg">
              No blogs found with the selected filters.
            </p>
            <button
              onClick={() => router.push("/write")}
              className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Write a New Blog
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
