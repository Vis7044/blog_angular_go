import apiClient from "@/utils/axiosInstance";

export interface Blog {
  _id?: string; // Unique identifier for the blog post
  userId: string; // ID of the user who created the blog
  title: string; // Blog title
  content: string; // HTML content from Quill editor
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[]; // Array of comments (define Comment interface below)
  status: number; // 1 = published, 0 = draft (or however your logic defines)
  tags: string[]; // Tags related to the post
  createdAt?: string;
  coverPhoto?: string;
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
  baseUrl = "/blogs";

  uploadImage = async (
    file: File
  ): Promise<{ secureUrl: string; publicId: string }> => {
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
  };

  saveBlog = async (blogData: {
    id: string;
    title: string;
    content: string;
    status: Status;
    coverPhoto: string;
    tags: string[];
  }): Promise<void> => {
    await apiClient.post(`${this.baseUrl}?id=${blogData.id}`, blogData);
  };

  getBlogs = async (): Promise<Blog[]> => {
    const response = await apiClient.get(`${this.baseUrl}`);
    return response.data.data;
  };

  getBlogsByUser = async (): Promise<Blog[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Blog[]>>(
        "/auth/allblogs"
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching user blogs:", error);
      throw error.response?.data?.data || "Failed to fetch user blogs";
    }
  };

  getBlogById = async (blogId: string): Promise<Blog> => {
    const response = await apiClient.get(`${this.baseUrl}/${blogId}`);
    return response.data.data;
  };

  searchTags = async (
    q: string
  ): Promise<{ label: string; value: string }[]> => {
    const response = await apiClient.get(`/tags/search?q=${q}`);

    return response.data.data.map((tag: { id: string; name: string }) => ({
      label: tag.name,
      value: tag.name,
    }));
  };
}

export const blogService = new BlogService();
