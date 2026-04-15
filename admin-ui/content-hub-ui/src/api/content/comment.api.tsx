import axiosClient from "../../config/axios";

export interface CommentRequest {
  content: string
  authId: string
  postId: string
}
export interface CommentReply{
   content: string;
  authId: string;
  postId: string;
  depth:number;
  parentId:string;

}
export interface CommentResponse {
  id:string;
  content: string;
  dateCreated: Date;
  depth:number;
  likeCount:number;
  parentId:string;
  avatar?:string;
  author: string;
  children?:CommentResponse[];
}
export interface PagedResult<T> {
  results: T[]
  currentPage: number
  pageSize: number
  rowCount: number
  pageCount:number
}
export const commentApi = {
  createComment: (data: CommentRequest) => {
    return axiosClient.post<CommentResponse>("/api/comments", data);
  },
  createReply:(data:CommentReply)=>{
    return axiosClient.post<CommentResponse>("/api/comments", data);
  },
  getCommentPaged: (params: {
    postId: string,
    filter:string;
    pageNumber: number;
    pageSize: number;
  }) =>
    axiosClient.get<PagedResult<CommentResponse>>("/api/comments", { params }),
};
