import apiClient from "@/utils/axiosInstance";

export interface Blog {
  _id?: string;               // Unique identifier for the blog post
  userId: string;              // ID of the user who created the blog
  title: string;               // Blog title
  content: string;             // HTML content from Quill editor
  likes: string[];             // Array of user IDs who liked the post
  comments: Comment[];         // Array of comments (define Comment interface below)
  status: number;              // 1 = published, 0 = draft (or however your logic defines)
  tags: string[];              // Tags related to the post
  createdAt?: string;         
  updatedAt?: string;          
}

export enum Status {
  Draft = 0,
  Published = 1,
  Archived = 2,
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}


class BlogService {
  baseUrl = '/blogs';

  uploadImage = async (file: File): Promise<{ secureUrl: string; publicId: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post(`/images/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data; 
  };

  deleteImage = async (publicId: string): Promise<void> => {
      await apiClient.delete(`/images/delete`, {
      data: { publicId },
    });
  }

  saveBlog = async (blogData: {title: string; content: string, status:Status, coverPhoto: string, tags: string[]}): Promise<void> => {
    await apiClient.post(`${this.baseUrl}`, blogData);
  }

  getBlogs = async (): Promise<Blog[]> => {
    const response = await apiClient.get(`${this.baseUrl}`);
    console.log("Fetched blogs:", response.data.data);
    return response.data.data;
  }

  getBlogsByUser = async (): Promise<Blog[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Blog[]>>("/auth/allblogs");
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching user blogs:", error);
      throw error.response?.data?.data || "Failed to fetch user blogs";
    }
  }

}



export const blogService = new BlogService();
