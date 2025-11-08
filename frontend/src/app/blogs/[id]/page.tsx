"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Blog, blogService } from "@/services/blogService";
import { featuredBlogs } from "@/app/dummyData/featuredBlog";
import { BlogSkeleton } from "@/components/BlogSkeleton";
import { Tag } from "lucide-react";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog>();
  const [showRelated, setShowRelated] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await blogService.getBlogById(id as string);
        console.log(response);
        setBlog(response);
        setComments(response.comments?.map((c: any) => c.text) || []);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    if (id) fetchBlog();

    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, [id]);

  const cleanHTML = (html: string) => {
    if (!html) return "";
    return html
      .replaceAll('\\"', '"')
      .replaceAll("\\\\", "\\")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&amp;", "&");
  };

  // Copy button setup for code blocks
  useEffect(() => {
    if (!blog) return;

    const timer = setTimeout(() => {
      const containers = document.querySelectorAll(".ql-code-block-container");

      containers.forEach((container) => {
        if (container.querySelector(".copy-btn")) return;

        const copyBtn = document.createElement("button");
        copyBtn.innerText = "Copy";
        copyBtn.className = "copy-btn";

        copyBtn.addEventListener("click", async () => {
          const codeBlocks = container.querySelectorAll(".ql-code-block");
          const codeText = Array.from(codeBlocks)
            .map((el) => el.textContent || "")
            .join("\n");

          await navigator.clipboard.writeText(codeText);
          copyBtn.innerText = "Copied!";
          setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
        });

        container.appendChild(copyBtn);
        (container as HTMLElement).style.position = "relative";
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [blog]);

  if (!blog)
    return (
      <div className="text-center mt-10">
        <BlogSkeleton />
      </div>
    );

  const handleAddComment = () => {
    if (!comment.trim()) return;
    setComments((prev) => [...prev, comment]);
    setComment("");
  };

  return (
    <div
      className={`p-2 flex flex-row bg-gray-50 rounded-2xl ${
        animate ? "transition-all duration-500 ease-in-out" : ""
      }`}
    >
      
      {/* --- Left: Blog Content --- */}
      <div
        className={`mx-4 space-y-10 ${
          animate ? "transition-all duration-500 ease-in-out" : ""
        } ${showRelated ? "w-[65%]" : "w-full"}`}
      >

        {blog && (
          <h1 className="text-3xl font-bold text-center mt-4 mb-6">
            {blog.title}
          </h1>
        )}
          
        <button className="cursor-pointer p-2 text-blue-400" onClick={() => router.push(`/editblog/${blog._id}`)}>Edit</button> 
        {blog && (
          <div
            key={blog._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
          >
            <div
              className="blog-content text-gray-800 leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: cleanHTML(blog.content) }}
            />
          </div>
        )}
      </div>

      {/* --- Right: Comments + Related Posts --- */}
      <div className="w-[30%] flex flex-col gap-6 mt-20">
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

        {/* Comment Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
          <h2 className="text-2xl border-b-1 font-semibold mb-5 text-gray-900 flex items-center gap-2">
            Comments
          </h2>
          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto mb-5 pr-1 custom-scrollbar">
            {comments.length > 0 ? (
              comments.map((c, i) => (
                <div
                  key={i}
                  className="group bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm text-gray-800 transition-all duration-200 hover:bg-gray-100 hover:shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900">User {i + 1}</span>
                    <span className="text-xs text-gray-400">just now</span>
                  </div>
                  <p className="leading-relaxed">{c}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic text-center py-6">
                No comments yet — be the first to share your thoughts!
              </p>
            )}
          </div>

          {/* Add Comment */}
          <div className="relative border-t border-gray-100 pt-4">
            <textarea
              className="w-full border border-gray-300 rounded-full py-3 pl-4 pr-12 text-md focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none transition"
              placeholder="Write a comment..."
              rows={1}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              className="absolute right-0 bottom-2 bg-gray-900 text-white rounded-full p-4 hover:bg-blue-400 transition active:scale-95 flex items-center justify-center shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
      </div>


        {/* Related Blogs Section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Related Blogs</h2>
          <div className="flex flex-col gap-6">
            {featuredBlogs.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold mb-2 text-gray-800">
                  {a.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {a.desc.slice(0, 40)}...
                </p>
                <button className="text-sm text-gray-900 font-medium hover:underline">
                  Read more →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
