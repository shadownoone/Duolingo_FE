import { axiosClients } from "../../apis/axiosClients";

export const completeLesson = async (lessonId) => {
  return await axiosClients
    .post(`/userProgress/complete`, { lesson_id: lessonId })
    .then((res) => {
      return res.data;
    });
};

export const getUserProgress = async () => {
  return await axiosClients.get(`/userProgress/getByUser`).then((res) => {
    return res.data;
  });
};

export const leaderBoard = async () => {
  return await axiosClients.get(`/userProgress/leaderboard`).then((res) => {
    return res.data;
  });
};
