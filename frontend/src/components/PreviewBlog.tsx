import { useEffect } from "react";


export const PreviewBlog = ({title, content}:{title:string,content:string}) => {
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
      }, [title, content]);
    
  return (
    <div
            
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <div
              className="blog-content text-gray-800 leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: cleanHTML(content) }}
            />
          </div>
  )
}
