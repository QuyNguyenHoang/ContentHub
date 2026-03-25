import axiosClient from "../../config/axios";

export interface PostResponse {
  id: string;
  name: string;
  content?: string;
  source?: string;
  tags?: string;
  description?: string;
  dateCreated: string;
  categoryName: string;
}

export interface PagedResponse<T> {
  results: T;
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreatePostRequest {
  name: string;
  description?: string;
  content?: string;
  source?: string;
  tags?: string;
  isPaid: boolean;
  royaltyAmount: number;
  categoryId: string;
  status: number;
  authorUserId: string;
}

export const postApi = {
  getPost: (page: number, pageSize: number) =>
    axiosClient.get<PagedResponse<PostResponse[]>>("/admin/api/posts", {
      params: { pageNumber: page, pageSize },
    }),

  getById: (id: string) =>
    axiosClient.get<PostResponse>(`/admin/api/posts/${id}`),

  create: (data: CreatePostRequest) =>
    axiosClient.post("/admin/api/posts/new", data),

  update: (id: string, data: CreatePostRequest) =>
    axiosClient.put(`/admin/api/posts/${id}`, data),

  delete: (id: string) =>
    axiosClient.delete(`/admin/api/posts/${id}`),
    uploadMedia: (file: File, type: string) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosClient.post<{ path: string }>(
      `/api/media?type=${type}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};