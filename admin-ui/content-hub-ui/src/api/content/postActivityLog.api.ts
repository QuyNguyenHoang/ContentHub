import axiosClient from "../../config/axios";

export interface PostActivityLogResponse {
  id: string;
  fromStatus: string;
  toStatus: string;
  dateCreated: string;
  note: string;
  adminName: string;
}

export const postActivityLogApi = {
  getPostActivityLog: (postId: string) =>
    axiosClient.get<PostActivityLogResponse[]>(
      "/admin/api/post_activity_logs",
      {
        params: { postId },
      },
    ),
};
