import { axiosClients } from "../../apis/axiosClients";

export const getLessonByCourse = async (courseId) => {
  return await axiosClients.get(`/courses/${courseId}`).then((res) => {
    return res.data;
  });
};
