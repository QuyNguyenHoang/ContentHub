import axiosClient from "../../config/axios";

const followApi = {
  follow: (followingId: string) => {
    return axiosClient.post(`/api/follow/${followingId}`);
  },

  unfollow: (followingId: string) => {
    return axiosClient.delete(`/api/follow/${followingId}`);
  },

  isFollowing: (followingId: string) => {
    return axiosClient.get(`/api/follow/is-following/${followingId}`);
  },

  getFollowersCount: (userId: string) => {
    return axiosClient.get(`/api/follow/${userId}/followers/count`);
  },

  getFollowingCount: (userId: string) => {
    return axiosClient.get(`/api/follow/${userId}/following/count`);
  },

  getFollowers: (userId: string) => {
    return axiosClient.get(`/api/follow/${userId}/followers`);
  },

  getFollowing: (userId: string) => {
    return axiosClient.get(`/api/follow/${userId}/following`);
  },
};

export default followApi;