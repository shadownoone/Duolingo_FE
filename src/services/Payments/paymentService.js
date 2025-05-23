import { axiosClients } from "../../apis/axiosClients";

export const createPaymentLink = async () => {
  try {
    const response = await axiosClients.post("/payment-link", {
      amount: 10000,
    });

    window.location.href = response.data.checkoutUrl;
  } catch (error) {
    console.error("Lỗi khi tạo liên kết thanh toán:", error);
    alert("Có lỗi xảy ra khi tạo liên kết thanh toán. Vui lòng thử lại.");
  }
};
