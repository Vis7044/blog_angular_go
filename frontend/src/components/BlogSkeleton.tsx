import React from "react";

export const BlogSkeleton = () => {
  return (
    <div className="animate-pulse w-full max-w-4xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="h-8 bg-gray-300 rounded-md w-3/4 mb-6"></div>

      {/* Date */}
      <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-8"></div>

      {/* Content paragraphs */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
      </div>

      {/* Code block */}
      <div className="bg-gray-200 rounded-md h-40 mt-8"></div>

      {/* More content */}
      <div className="space-y-4 mt-8">
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
