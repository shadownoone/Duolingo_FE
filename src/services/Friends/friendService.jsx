import { axiosClients } from "../../apis/axiosClients";

export const getFriend = async () => {
  return await axiosClients.get("/friends/getFriend").then((res) => {
    return res.data;
  });
};

export const getFollwer = async () => {
  return await axiosClients.get("/friends/getFollower").then((res) => {
    return res.data;
  });
};

export const unFollowing = async (followedUserId) => {
  return await axiosClients
    .post(`/friends/unFollow/${followedUserId}`)
    .then((res) => {
      return res.data;
    });
};

export const autoFollowing = async (friendId) => {
  return await axiosClients.post(`/friends/follow/${friendId}`).then((res) => {
    return res.data;
  });
};
