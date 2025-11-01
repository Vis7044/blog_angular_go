'use client';
import { useEffect, useState } from "react";
import { blogService } from "@/services/blogService";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  const getAllBlogs = async () => {
    try {
      const blogList = await blogService.getBlogs();
      setBlogs(blogList);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  const cleanHTML = (html: string) => {
    if (!html) return "";
    return html
      .replaceAll("\\\"", '"')
      .replaceAll("\\\\", "\\")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&amp;", "&");
  };

  // 🧩 Attach one copy button per full code block container
  useEffect(() => {
    const containers = document.querySelectorAll(".ql-code-block-container");

    containers.forEach((container) => {
      // Avoid duplicates
      if (container.querySelector(".copy-btn")) return;

      const copyBtn = document.createElement("button");
      copyBtn.innerText = "Copy";
      copyBtn.classList.add("copy-btn");

      copyBtn.addEventListener("click", async () => {
        const codeText = Array.from(
          container.querySelectorAll(".ql-code-block")
        )
          .map((el) => el.textContent)
          .join("\n");

        await navigator.clipboard.writeText(codeText);
        copyBtn.innerText = "Copied!";
        setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
      });

      // Position inside container
      container.appendChild(copyBtn);
      container.classList.add("relative");
    });
  }, [blogs]);

  return (
    <div className="min-h-screen bg-gray-50">
        {blogs.length > 0 && (  
            <h1 className="text-3xl font-bold text-center mb-10">{blogs[2].title}</h1>
        )
        }
      
      <div className="w-auto mx-8 space-y-10">
        {blogs.length > 0 && (
          <div
            key={blogs[2]._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-semibold mb-4">{(blogs[2].title) ? "" : "Loading..."} </h2>

            <div
              className="blog-content text-gray-800 leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: cleanHTML(blogs[2].content) }}
            />

            <p className="text-sm text-gray-500 mt-4">Author: {blogs[2].userID}</p>
          </div>
        )}
      </div>
    </div>
  );
}
