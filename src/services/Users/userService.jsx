import { axiosClients } from "../../apis/axiosClients";

export const getCurrentUser = async () => {
  return await axiosClients.get("/auth/current-user").then((res) => {
    return res.data;
  });
};

export const updateUser = async (data) => {
  return await axiosClients.put("/users/update", data).then((res) => {
    return res.data;
  });
};

export const createUser = async (data) => {
  return await axiosClients.post("/users/create", data).then((res) => {
    return res.data;
  });
};

export const enrollLanguage = async (data) => {
  return await axiosClients.post("/users/userLanguage", data).then((res) => {
    return res.data;
  });
};

export const getUserLanguages = async () => {
  return await axiosClients.get("/users/getLanguage").then((res) => {
    return res.data;
  });
};
