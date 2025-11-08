"use client";
import BlogEditor from "@/components/BlogEditor";
import { blogService } from "@/services/blogService";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<string>("");
  const [loading, setLoading] = useState(true)
  const [blogid, setBlogId] = useState<string>("")

  const { id } = useParams();
  useEffect(() => {
    blogService.getBlogById(id as string).then((blog) => {
      setTitle(blog?.title);
      setContent(blog?.content);
      setCoverPhoto(blog.coverPhoto || "");
      setTags(blog.tags);
      setBlogId(blog._id || "");
    }).catch((err) => console.error(err)).finally(() => setLoading(false));
  }, []);
  if(loading){
    return <div><Loader className=""/></div>
  }
  return (
    <BlogEditor
      id={blogid}
      InitialcoverPhoto={coverPhoto}
      Intialtags={tags}
      IntialTitle={title}
      IntitialContent={content}
    />
  );
};

export default EditBlog;
