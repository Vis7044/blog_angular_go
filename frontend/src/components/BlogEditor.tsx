"use client";
import { useEffect, useRef, useState } from "react";
import { blogService, Status } from "@/services/blogService";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/editor.css";
import { Edit3, Play, Upload } from "lucide-react";
import Quill from "react-quill-new";
import SaveBlogModal from "@/components/SaveBlogModal";
import { PreviewBlog } from "@/components/PreviewBlog";
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";

export default function BlogEditor({
  id,
  Intialtags,
  InitialcoverPhoto,
  IntialTitle,
  IntitialContent,
}: { 
  id: string;
  Intialtags: string[];
  InitialcoverPhoto: string;
  IntialTitle: string;
  IntitialContent: string;
}) {
  const quillRef = useRef<any>(null);
  const uploadedImagesRef = useRef<Set<string>>(new Set()); 
  const initialImagesRef = useRef<Set<string>>(new Set()); 
  const [title, setTitle] = useState(IntialTitle);
  const [content, setContent] = useState(IntitialContent);
  const [previewMode, setPreviewMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tags] = useState<string[]>(Intialtags);
  const [coverPhoto] = useState<string>(InitialcoverPhoto);
  const [hasChanges, setHasChanges] = useState(false);
  const { setHasUnsavedChanges } = useUnsavedChanges();

  // Extract initial images on mount
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(IntitialContent, "text/html");
    const imgs = doc.querySelectorAll("img");
    
    imgs.forEach((img) => {
      const publicId = img.getAttribute("data-public-id");
      if (publicId) {
        initialImagesRef.current.add(publicId);
        uploadedImagesRef.current.add(publicId);
      }
    });
  }, [IntitialContent]);

  useEffect(() => {
    setHasUnsavedChanges(hasChanges);
  }, [hasChanges, setHasUnsavedChanges]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    setHasChanges(true);
  };

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
        uploadedImagesRef.current.add(publicId);

        setTimeout(() => {
          const img = quill.root.querySelector(`img[src="${secureUrl}"]`);
          if (img) img.setAttribute("data-public-id", publicId);
        }, 300);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    };
  };

  // Get currently used images from content
  const getCurrentImages = (): Set<string> => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return new Set();

    const usedPublicIds = new Set<string>();
    const imgs = quill.root.querySelectorAll("img");
    
    imgs.forEach((img: any) => {
      const pid = img.getAttribute("data-public-id");
      if (pid) usedPublicIds.add(pid);
    });

    return usedPublicIds;
  };

  // Delete unused images
  const cleanupUnusedImages = async () => {
    const currentImages = getCurrentImages();
    const toDelete: string[] = [];

    // Find images that were uploaded but removed from content
    uploadedImagesRef.current.forEach((publicId) => {
      if (!currentImages.has(publicId)) {
        toDelete.push(publicId);
      }
    });

    // Delete each unused image
    for (const publicId of toDelete) {
      try {
        await blogService.deleteImage(publicId);
        uploadedImagesRef.current.delete(publicId);
        console.log(`Deleted unused image: ${publicId}`);
      } catch (err) {
        console.error(`Failed to delete image ${publicId}:`, err);
      }
    }

    return toDelete.length;
  };

  // Cleanup on unmount (when leaving page without saving)
  useEffect(() => {
    return () => {
      if (hasChanges) {
        // User left without saving - delete all newly uploaded images
        const newImages = Array.from(uploadedImagesRef.current).filter(
          (id) => !initialImagesRef.current.has(id)
        );

        newImages.forEach(async (publicId) => {
          try {
            await blogService.deleteImage(publicId);
            console.log(`Cleanup on unmount: ${publicId}`);
          } catch (err) {
            console.error(`Cleanup failed for ${publicId}:`, err);
          }
        });
      }
    };
  }, [hasChanges]);

  const handlePreview = async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const html = quill.root.innerHTML;
    setContent(html);

    // Cleanup unused images before preview
    await cleanupUnusedImages();

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
      // Cleanup unused images before saving
      const deletedCount = await cleanupUnusedImages();
      console.log(`Deleted ${deletedCount} unused images before save`);

      // Save the blog
      await blogService.saveBlog({id, title, content, status, coverPhoto, tags });
      
      // Update refs - current images are now the "initial" images
      const currentImages = getCurrentImages();
      initialImagesRef.current = new Set(currentImages);
      uploadedImagesRef.current = new Set(currentImages);
      
      // Clear unsaved changes
      setHasUnsavedChanges(false);
      setHasChanges(false);
      
      console.log("Blog saved successfully");
    } catch (err) {
      console.error("Blog save failed:", err);
      throw err; 
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
              onChange={(e) => handleTitleChange(e)}
              className="w-full p-3 max-h-20 border border-gray-300 font-semibold text-gray-700 rounded-md mb-4 text-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <Quill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={handleContentChange}
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
        Edittags={tags}
        EditcoverPhoto={coverPhoto}
        content={content}
        saveBlog={handleSave}
      />
    </div>
  );
}