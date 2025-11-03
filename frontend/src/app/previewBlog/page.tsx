'use client';
import { useEffect, useState } from "react";
import { Blog, blogService } from "@/services/blogService";

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const articles = [
    {
      id: 1,
      title: 'How Monitoring Glucose Levels Can Improve Skin Health',
      category: 'NUTRITION',
      desc: 'Real-time glucose monitoring provides insight into the physiology of weight gain and loss.',
      image: '/loginArt.jpg',
      featured: true,
    },
    {
      id: 2,
      title: 'The Power of Personalized Data: A Conversation With Todd Rose',
      category: 'NUTRITION',
      desc: 'Interview with Todd Rose, author and researcher exploring human individuality.',
      image: '/signupArt.jpg',
      featured: false,
    },
    {
      id: 3,
      title: 'Understanding Weight Loss: Why Tracking Glucose May Be More Insightful',
      category: 'WEIGHT LOSS',
      desc: 'Explore how glucose tracking may outperform calorie counting in long-term health goals.',
      image: '/loginArt.jpg',
      featured: false,
    },
    {
      id: 4,
      title: 'Do Alcohol and Metabolic Fitness Mix?',
      category: 'PHYSICAL FITNESS',
      desc: 'Discover how alcohol affects your metabolism and long-term health outcomes.',
      image: '/signupArt.jpg',
      featured: false,
    },
  ]

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
    <div className="p-6 flex flex-row bg-gray-50">
      
      <div className="w-[70%] mx-8 space-y-10">
      {blogs.length > 0 && (  
            <h1 className="text-3xl font-bold text-center mb-10">{blogs[2].title}</h1>
        )
        }
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

             
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 mt-20">
        <h1 className="text-3xl font-bold">Related Blog</h1>
          {articles.slice(1, 3).map((a) => (
            <div
              key={a.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
            >
              <h3 className="font-semibold mb-2">{a.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{a.desc}</p>
              <button className="text-sm text-gray-900 font-medium hover:underline">
                Read more →
              </button>
            </div>
          ))}
        </div>
    </div>
  );
}