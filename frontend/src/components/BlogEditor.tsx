"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { blogService, Status } from "@/services/blogService";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/editor.css";
import { PreviewBlog } from "./PreviewBlog";
import { Edit3, Play, Upload } from "lucide-react";
import SaveBlogModal from "./SaveBlogModal";
import Quill from "react-quill-new";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogEditor() {
  const quillRef = useRef<any>(null);
  const previousImagesRef = useRef<Set<string>>(new Set());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Image handler
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

  // Handle preview
  const handlePreview = async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const html = quill.root.innerHTML;
    setContent(html);

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

  const handleSave = async (
    title: string,
    content: string,
    status: Status,
    coverPhoto: string,
    tags: string[]
  ) => {
    try {
      await blogService.saveBlog({ title, content, status, coverPhoto, tags });
    } catch (err) {
      console.error("Blog save failed:", err);
    }
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

  return (
    <div>
      {!previewMode ? (
        <div className="flex flex-col mx-auto p-6 w-full">
          <div className="flex justify-between items-center w-[80%] mx-auto mb-4">
            <h1 className="text-3xl font-semibold mb-2 text-gray-800">
              What&apos;s in your mind today!
            </h1>

            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Play className="w-4 h-4" />
              Preview
            </button>
          </div>

          <div className="max-w-6xl flex flex-col mx-auto p-6 w-full">
            <textarea
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 max-h-20 border border-gray-300 font-semibold text-gray-700 rounded-md mb-4 text-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <Quill
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
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 hover:shadow-sm active:scale-[0.98] transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Back to Edit
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white font-medium shadow-sm hover:bg-purple-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Upload className="w-4 h-4" />
              Continue
            </button>
          </div>

          <div className="bg-white p-6 mt-3 rounded-lg shadow-md">
            <PreviewBlog title={title} content={content} />
          </div>
        </div>
      )}

      <SaveBlogModal
        open={showModal}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        title={title}
        content={content}
        saveBlog={handleSave}
      />
    </div>
  );
}
