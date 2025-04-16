import { axiosClients } from "../../apis/axiosClients";

export const getAllLanguages = async () => {
  return await axiosClients.get("/languages/all").then((res) => {
    return res.data;
  });
};

export const getCourseByLanguage = async (languageId) => {
  return await axiosClients.get(`/languages/${languageId}`).then((res) => {
    return res.data;
  });
};
