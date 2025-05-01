import { axiosClients } from "../../apis/axiosClients";

export const chatAI = async (message, exercise_id) => {
  try {
    const response = await axiosClients.post("/chats", {
      message,
      exercise_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error while chatting with AI: ", error);
    throw error;
  }
};
