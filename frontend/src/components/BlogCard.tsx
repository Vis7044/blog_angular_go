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
  const previewText =
    DOMPurify.sanitize(blog.content)
      .replace(/<[^>]+>/g, "")
      .slice(0, 600) + (blog.content.length > 150 ? "..." : "");

  const statusLabel =
    blog.status === 1 ? "Published" : blog.status === 0 ? "Draft" : "Archieved";

  return (
    <div
      onClick={() => onClick?.(blog._id)}
      className="flex flex-col sm:flex-row cursor-pointer rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-300 overflow-hidden"
    >
      {/* Cover Photo */}
      <div className="sm:w-2/6 w-full h-48 sm:h-auto relative overflow-hidden">
        {blog.coverPhoto ? (
          <div className="w-full contain-size h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <img
            src={blog.coverPhoto}
            alt={blog.title}
            className="opacity-80 w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <img
              src="/loginArt.jpg"
              alt="default"
              className="w-40 opacity-60"
            />
          </div>
        )}
      </div>

      {/* Blog Info */}
      <div className="sm:w-3/5 w-full p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {blog.title}
          </h2>

          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {previewText}
          </p>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-black text-white px-2 py-1 rounded-full flex items-center gap-1 font-medium"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-5 text-gray-500 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart
                size={14}
                className="text-pink-500 fill-pink-500/10 hover:fill-pink-500 transition-colors duration-200"
              />
              <span>{blog.likes.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={14} className="text-black" />
              <span>{blog.comments.length}</span>
            </div>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
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
