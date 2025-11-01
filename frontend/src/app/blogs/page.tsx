'use client';
import { blogService } from "@/services/blogService";
import { useEffect, useState } from "react"



function Blogs() {
  const [blogs, setBlogs] = useState([])  
  const getAllBlogs = async () => {
    const blog = await blogService.getBlogs();
    setBlogs(blog);
  }
  
useEffect(() => {
  getAllBlogs();
},[])
  return (
    <div>
      Blogs
      <ul>
        {blogs.map((blog) => (
          <div key={blog._id}>
            <h2>{blog.title}</h2>
            <p dangerouslySetInnerHTML={{__html: blog.content}}></p>
          </div>
        ))}
      </ul>
    </div>

  )
}

export default Blogs