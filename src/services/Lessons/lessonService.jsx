import { axiosClients } from "../../apis/axiosClients";

export const getLessonDetail = async (courseId) => {
  return await axiosClients.get(`/lessons/${courseId}`).then((res) => {
    return res.data;
  });
};

export const voiceRequest = async (audioBlob, expectedText) => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.mp3");
    formData.append("expectedText", expectedText);

    const response = await axiosClients.post("/assess-speech", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu giọng nói:", error);
    alert("Có lỗi xảy ra khi gửi yêu cầu giọng nói. Vui lòng thử lại.");
  }
};
