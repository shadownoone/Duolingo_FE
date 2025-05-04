import { axiosClients } from "../../apis/axiosClients";

export const getFriend = async () => {
  return await axiosClients.get("/friends/getFriend").then((res) => {
    return res.data;
  });
};
