import axiosClient from "../../config/axios";
import type { UserDto } from "../system/user.api";

export const TimeRange = {
  All: "AllTime",
  Today: "Today",
  Last7Days: "Last7Days",
  Last30Days: "Last30Days",
  Last90Days: "Last90Days",
  ThisMonth: "ThisMonth",
  LastMonth: "LastMonth",
  ThisYear: "ThisYear",
  LastYear: "LastYear",
} as const;

// optional type
export type TimeRange = (typeof TimeRange)[keyof typeof TimeRange];

export type TotalPostResponse = {
  totalPost: number;
  previousTotalPost: number;
  growth: number;
};
export type TotalUserResponse = {
  totalUser: number;
  previousTotalUser: number;
  growth: number;
};
const analyticApi = {
  getTopUserByPost: () => {
    return axiosClient.get<UserDto[]>(
      "/api/admin/analytic/users/top-user-by-post",
    );
  },

  getTotalPosts: (timeRange: TimeRange) => {
    return axiosClient.get<TotalPostResponse>(
      "/api/admin/analytic/users/total-posts-count",
      {
        params: { timeRange },
      },
    );
  },
  getTotalUsers: (timeRange: TimeRange) => {
    return axiosClient.get<TotalUserResponse>(
      "/api/admin/analytic/users/total-users-count",
      {
        params: { timeRange },
      },
    );
  },
};

export default analyticApi;
