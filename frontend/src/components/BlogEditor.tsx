"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { blogService } from "@/services/blogService";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/editor.css";
import { title } from "process";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogEditor() {
  const quillRef = useRef<any>(null);
  const previousImagesRef = useRef<Set<string>>(new Set());
  const [title, setTitle] = useState('')
  const [content, setContent] = useState("");

  // 🖼️ Handle image upload
  const imageHandler = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const range = quill.getSelection(true);

      try {
        const data = await blogService.uploadImage(file);
        const { secureUrl, publicId } = data;

        quill.insertEmbed(range.index, "image", secureUrl);
        quill.setSelection(range.index + 1);

        // Add to tracking immediately
        previousImagesRef.current.add(publicId);

        // Set data attribute after DOM render
        setTimeout(() => {
          const img = quill.root.querySelector(`img[src="${secureUrl}"]`);
          if (img) img.setAttribute("data-public-id", publicId);
        }, 300);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Image upload failed. Please try again.");
      }
    };
  };

  // 🧰 Quill Modules
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],
      ],
      handlers: { image: imageHandler },
    },
  };

  // 🧹 Save blog (and delete unused images)
  const handleSave = async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const html = quill.root.innerHTML;

    // 1️⃣ Extract all currently used publicIds from the DOM
    const usedPublicIds = new Set<string>();
    const imgs = quill.root.querySelectorAll("img");
    imgs.forEach((img: any) => {
      const pid = img.getAttribute("data-public-id");
      if (pid) usedPublicIds.add(pid);
    });

    // 2️⃣ Find unused images (uploaded but not present anymore)
    const unused = Array.from(previousImagesRef.current).filter(
      (pid) => !usedPublicIds.has(pid)
    );

    // 3️⃣ Call delete API for unused images
    for (const pid of unused) {
      try {
        await blogService.deleteImage(pid);
        previousImagesRef.current.delete(pid);
        console.log("🗑️ Deleted unused image:", pid);
      } catch (err) {
        console.error("Failed to delete image:", pid, err);
      }
    }

    // 4️⃣ Prepare payload for saving
    const usedImages = Array.from(usedPublicIds).map((pid) => ({
      publicId: pid,
      url: quill.root.querySelector(`img[data-public-id="${pid}"]`)?.src || "",
    }));

    // 5️⃣ Save blog
    try {
      await blogService.saveBlog({title, content});
      alert("✅ Blog saved successfully!");
    } catch (err) {
      console.error("Blog save failed:", err);
      alert("Failed to save blog.");
    }
  };

  return (
    <div className="editor-page p-4">
      <input
        type="text"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md mb-4 text-lg focus:outline-none"
      />
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        placeholder="Write something awesome..."
      />
      <button
        onClick={handleSave}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium"
      >
        Publish Post
      </button>
    </div>
  );
}
