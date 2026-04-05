import axiosClient from "../../config/axios";

export interface CommentRequest {
  content: string;
  authId: string;
  postId: string;
}
export interface CommentResponse {
  content: string;
  dateCreated: Date;
  author: string;
}
export const commentApi = {
  createComment: (data: CommentRequest) => {
    return axiosClient.post<CommentResponse>("/api/comments", data);
  },
};
