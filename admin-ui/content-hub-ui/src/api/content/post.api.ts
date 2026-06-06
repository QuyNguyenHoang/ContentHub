import axiosClient from "../../config/axios";

export interface PostResponse {
  id: string;
  name: string;
  status: string;
  slug: string;
  isPaid: boolean;
  isDeleted: boolean;
  content?: string;
  source?: string;
  tags?: string;
  description?: string;
  dateCreated: string;
  dateModified?: string;
  categoryName: string;
  authorName: string;
  authorAvatar?: string;
  coverImage?: string;
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

  status: string | null;
  isPaid: boolean;

  categorySlug?: string | null;
  categoryName?: string | null;

  listTag: Tag[];
  coverImage?: string;
  authorName: string;
  authorAvatar?: string | null;

  dateCreated: string;
  dateModified?: string | null;
  paidDate?: string | null;
  isDeleted: boolean;
  commentCount: number;
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
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  pageCount: number;
}

export interface CreatePostRequest {
  coverImageId?: string;
  coverImageUrl?: string;
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
  //Get list post deleted
  listPostDeleted: (params?: {
    keyword: string | null;
    filter: string | null;
    pageNumber: number;
    pageSize: number;
  }) => {
    return axiosClient.get<PagedResponse<PostResponse[]>>(
      "/admin/api/posts/list-posts-deleted",
      { params },
    );
  },
  //Restore deleted post
  restoreDeletedPost: (ids: string[]) => {
    axiosClient.patch("/admin/api/posts/restore-deleted-post", ids);
  },
  //Total posts
  totalPosts: () => {
    return axiosClient.get<number>("/admin/api/posts/total-posts");
  },
  // Approve post
  approvePost: (postId: string) => {
    axiosClient.post(`/admin/api/posts/${postId}/approve`);
  },
  //Reaject Post
  rejectPost: (postId: string) => {
    axiosClient.post(`/admin/api/posts/${postId}/reject`);
  },

  postByUser: (userId: string) =>
    axiosClient.get("/admin/api/posts/post-by-user", {
      params: { userId },
    }),
  getSeriesDropdown: () => axiosClient.get<Series[]>("/api/series/dropdown"),
  getPost: (
    keyword: string,
    filter: string,
    pageNumber: number,
    pageSize: number,
    isAdmin: boolean,
  ) =>
    axiosClient.get<PagedResponse<PostResponse[]>>("/admin/api/posts", {
      params: { keyword, filter, pageNumber, pageSize, isAdmin },
    }),
  getPostByAdmin: (
    keyword: string,
    filter: string,
    pageNumber: number,
    pageSize: number,
    isAdmin: boolean,
  ) =>
    axiosClient.get<PagedResponse<PostResponse[]>>("/admin/api/posts", {
      params: { keyword, filter, pageNumber, pageSize, isAdmin },
    }),
  getById: (id: string) =>
    axiosClient.get<PostDetailResponse>(`/admin/api/posts/${id}`),

  create: (data: CreatePostRequest) =>
    axiosClient.post("/admin/api/posts/new", data),

  update: (id: string, data: CreatePostRequest) =>
    axiosClient.put(`/admin/api/posts/${id}`, data),

  delete: (id: string) => axiosClient.delete(`/admin/api/posts/${id}`),
  //Delete permanently
  deletePosts: (ids: string[], isSoftDelete: boolean) =>
    axiosClient.delete("/admin/api/posts", {
      data: ids,
      params: { isSoftDelete },
    }),
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
