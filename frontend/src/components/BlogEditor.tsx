"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { blogService } from "@/services/blogService";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/editor.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogEditor() {
  const quillRef = useRef<any>(null);
  const previousImagesRef = useRef<Set<string>>(new Set());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

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

        previousImagesRef.current.add(publicId);

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

  // 🧹 Save blog and delete unused images
  const handleSave = async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const html = quill.root.innerHTML;
    setSaving(true);

    // Collect used publicIds
    const usedPublicIds = new Set<string>();
    const imgs = quill.root.querySelectorAll("img");
    imgs.forEach((img: any) => {
      const pid = img.getAttribute("data-public-id");
      if (pid) usedPublicIds.add(pid);
    });

    // Delete unused images
    const unused = Array.from(previousImagesRef.current).filter(
      (pid) => !usedPublicIds.has(pid)
    );

    for (const pid of unused) {
      try {
        await blogService.deleteImage(pid);
        previousImagesRef.current.delete(pid);
      } catch (err) {
        console.error("Failed to delete image:", pid, err);
      }
    }

    try {
      await blogService.saveBlog({
        title,
        content: html,
      });

      previousImagesRef.current = new Set(usedPublicIds);
      alert("✅ Blog saved successfully!");
    } catch (err) {
      console.error("Blog save failed:", err);
      alert("Failed to save blog.");
    } finally {
      setSaving(false);
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
        disabled={saving}
        className={`mt-6 bg-blue-600 text-white px-5 py-2 rounded-md font-medium ${
          saving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {saving ? "Saving..." : "Publish Post"}
      </button>
    </div>
  );
}
