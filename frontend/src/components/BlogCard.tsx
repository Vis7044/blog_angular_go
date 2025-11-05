"use client";

import React from "react";
import DOMPurify from "dompurify";
import { MessageSquare, Heart, Tag } from "lucide-react";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  coverPhoto?: string;
  likes: string[];
  comments: string[];
  tags: string[];
  status: number;
}

interface BlogCardProps {
  blog: Blog;
  onClick?: (id: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onClick }) => {
  const previewText = DOMPurify.sanitize(blog.content)
    .replace(/<[^>]+>/g, "") // remove HTML tags
    .slice(0, 120) + (blog.content.length > 120 ? "..." : "");

  const statusLabel =
    blog.status === 1 ? "Published" : blog.status === 0 ? "Draft" : "Unknown";

  return (
    <div
      onClick={() => onClick?.(blog._id)}
      className="cursor-pointer rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white overflow-hidden"
    >
      {/* Cover Photo */}
      {blog.coverPhoto ? (
        <img
          src={blog.coverPhoto}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          <img src="/loginArt.jpg" />
        </div>
      )}

      {/* Blog Info */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {blog.title}
        </h2>

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{previewText}</p>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart size={14} />
              <span>{blog.likes.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={14} />
              <span>{blog.comments.length}</span>
            </div>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              blog.status === 1
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
