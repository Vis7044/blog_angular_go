"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { blogService } from "@/services/blogService";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/editor.css";
import { PreviewBlog } from "./PreviewBlog";
import { Edit3, Play, Upload } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogEditor() {
  const quillRef = useRef<any>(null);
  const previousImagesRef = useRef<Set<string>>(new Set());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Handle image upload
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
      }
    };
  };

  const handlePreview = async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const html = quill.root.innerHTML;
    setContent(html);

    // 🧹 delete unused images before showing preview
    const usedPublicIds = new Set<string>();
    const imgs = quill.root.querySelectorAll("img");
    imgs.forEach((img: any) => {
      const pid = img.getAttribute("data-public-id");
      if (pid) usedPublicIds.add(pid);
    });

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

    setPreviewMode(true);
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
    setSaving(true);

    if (title.trim() === "") {
      alert("Title cannot be empty.");
      setSaving(false);
      return;
    }
    if (content.trim() === "" || content === "<p><br></p>") {
      alert("Content cannot be empty.");
      setSaving(false);
      return;
    }

    try {
      await blogService.saveBlog({ title, content });
      alert("Blog saved successfully!");
    } catch (err) {
      console.error("Blog save failed:", err);
      alert("Failed to save blog.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {!previewMode ? (
        <div className="flex flex-col mx-auto p-6 w-full">
          <div className="flex justify-between items-center w-[80%] mx-auto mb-4">
            <h1 className="text-3xl font-semibold mb-2">
              What&apos;s in your mind today!
            </h1>

            <div>
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <Play className="w-4 h-4" />
                <span>Preview</span>
              </button>
            </div>
          </div>
          <div className="max-w-6xl flex flex-col mx-auto p-6 w-full">
            <textarea
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 max-h-20 border border-gray-300 font-semibold text-gray-700 rounded-md mb-4 text-2xl focus:outline-none"
            />
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Write something awesome..."
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setPreviewMode(false)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 shadow-sm hover:shadow transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
              <span>Back to Edit</span>
            </button>

            <button
              disabled={saving}
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white shadow-md transition-all cursor-pointer duration-200 ${
                saving
                  ? "bg-green-400 opacity-60 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Publish"}</span>
            </button>
          </div>

          <div className="bg-white p-6 mt-3 rounded-lg shadow-md">
            <PreviewBlog title={title} content={content} />
          </div>
        </div>
      )}
    </div>
  );
}
