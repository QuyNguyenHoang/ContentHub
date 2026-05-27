import axiosClient from "../../config/axios";
import type { UserDto } from "../system/user.api";
const analyticApi = {
  getTopUserByPost: () => {
    return axiosClient.get<UserDto[]>("/api/admin/analytic/users/top-user-by-post");
  },
};
export default analyticApi;
