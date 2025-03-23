import { axiosClients } from "../../apis/axiosClients";

export const getCurrentUser = async () => {
  return await axiosClients.get("/auth/current-user").then((res) => {
    return res.data;
  });
};
