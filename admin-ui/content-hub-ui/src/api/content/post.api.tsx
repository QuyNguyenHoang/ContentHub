import axiosClient from "../../config/axios";

export interface PostResponse {
  id: string;
  name: string;
  slug: string;
  content?: string;
  source?: string;
  tags?: string;
  description?: string;
  dateCreated: string;
  categoryName: string;
  authorName: string;
  authorAvatar?: string;
  commentCount: number;
  listTag?: Tag[];
}
export interface PostDetailResponse {
  id: string;
  name: string;
  slug: string;
  description: string;

  content: string;
  source: string;
  tags: string;

  seoKeywords?: string | null;
  seoDescription?: string | null;

  thumbnail?: string | null;

  viewCount: number;
  royaltyAmount: number;

  status: number;
  isPaid: boolean;

  categorySlug?: string | null;
  categoryName?: string | null;

  listTag: Tag[];

  authorName?: string | null;
  authorAvatar?: string | null;

  dateCreated: string;
  dateModified?: string | null;
  paidDate?: string | null;
}
export interface Tag {
  id: string;
  name: string;
  slug: string;
}
export interface Series {
  id: string;
  name: string;
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
  status: number;
  authorUserId: string;
}

export const postApi = {
  postByUser: (userId: string) =>
    axiosClient.get("/admin/api/posts/post-by-user", {
      params: { userId },
    }),
  getSeriesDropdown: () => axiosClient.get<Series[]>("/api/series/dropdown"),
  getPost: (
    keyword: string = "",
    filter: string = "",
    page: number,
    pageSize: number,
  ) =>
    axiosClient.get<PagedResponse<PostResponse[]>>("/admin/api/posts", {
      params: { keyword, filter, pageNumber: page, pageSize },
    }),
  getPostByAdmin: (
    keyword: string = "",
    filter: string = "",
    page: number,
    pageSize: number,
    isAdmin: boolean,
  ) =>
    axiosClient.get<PagedResponse<PostResponse[]>>("/admin/api/posts", {
      params: { keyword, filter, page, pageSize, isAdmin},
    }),
  getById: (id: string) =>
    axiosClient.get<PostDetailResponse>(`/admin/api/posts/${id}`),

  create: (data: CreatePostRequest) =>
    axiosClient.post("/admin/api/posts/new", data),

  update: (id: string, data: CreatePostRequest) =>
    axiosClient.put(`/admin/api/posts/${id}`, data),

  delete: (id: string) => axiosClient.delete(`/admin/api/posts/${id}`),
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
