import axiosClient from "../../config/axios";

export interface PostResponse {
  id: string;
  name: string;
  content?: string;
}

export interface ApiResponse<T> {
  results: T;
}

export const postApi = {
  getPost: (page: number, pageSize: number) =>
    axiosClient.get<ApiResponse<PostResponse[]>>(
      `/admin/api/posts?pageNumber=${page}&pageSize=${pageSize}`
    ),
};