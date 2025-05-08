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

export const userStreak = async (data) => {
  return await axiosClients.post("/users/practice", data).then((res) => {
    return res.data;
  });
};

export const updateHeart = async (data) => {
  return await axiosClients.post("/users/updateHeart", data).then((res) => {
    return res.data;
  });
};

export const buyHeart = async (data) => {
  return await axiosClients.post("/users/buyHeart", data).then((res) => {
    return res.data;
  });
};

export const uploadSingleImage = async (base64) => {
  try {
    const response = await axiosClients.post(`/users/uploadImage`, {
      image: base64,
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Ném lỗi ra để xử lý bên ngoài nếu cần
  }
};
