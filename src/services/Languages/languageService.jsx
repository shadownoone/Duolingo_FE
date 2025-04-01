import { axiosClients } from "../../apis/axiosClients";

export const getAllLanguages = async () => {
  return await axiosClients.get("/languages/all").then((res) => {
    return res.data;
  });
};
