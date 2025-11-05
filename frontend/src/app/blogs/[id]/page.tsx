"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Blog, blogService } from "@/services/blogService";
import { featuredBlogs } from "@/app/dummyData/featuredBlog";
import { BlogSkeleton } from "@/components/BlogSkeleton";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog>();
  const [showRelated, setShowRelated] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await blogService.getBlogById(id as string);
        setBlog(response);
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
    }, 300); // wait for the DOM to render fully
  
    return () => clearTimeout(timer);
  }, [blog]);
  
  

  if (!blog)
    return (
      <div className="text-center mt-10">
        <BlogSkeleton />
      </div>
    );

  return (
    <div
      className={`p-6 flex flex-row bg-gray-50 ${
        animate ? "transition-all duration-500 ease-in-out" : ""
      }`}
    >
      {/* Blog Content */}
      <div
        className={`mx-6 space-y-10 ${
          animate ? "transition-all duration-500 ease-in-out" : ""
        } ${showRelated ? "w-[90%]" : "w-full"}`}
      >
        {blog && (
          <h1 className="text-3xl font-bold text-center mb-10">
            {blog.title}
          </h1>
        )}
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

      {/* Related Blogs */}
      <div
        className="overflow-hidden w-[25%] opacity-100"
      >
          <div className="flex flex-col gap-8 mt-20">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Related Blogs</h1>
            </div>

            {featuredBlogs.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{a.desc.slice(0,30)}...</p>
                <button className="text-sm text-gray-900 font-medium hover:underline">
                  Read more →
                </button>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
