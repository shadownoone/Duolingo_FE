import { axiosClients } from "../../apis/axiosClients";

export const getBadge = async () => {
  return await axiosClients.get(`/badges`).then((res) => {
    return res.data;
  });
};
