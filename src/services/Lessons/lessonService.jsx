import { axiosClients } from "../../apis/axiosClients";

export const getLessonDetail = async (courseId) => {
  return await axiosClients.get(`/lessons/${courseId}`).then((res) => {
    return res.data;
  });
};
