import { axiosClients } from "../../apis/axiosClients";

export const handleLogin = async (email, password) => {
  try {
    const response = await axiosClients.post("/auth/login", {
      email,
      password,
    });

    // Kiểm tra code trong response.data.user
    if (response.data.user) {
      alert("Login successful!");

      if (response.data.user.role === 0) {
        window.location.href = "/";
      } else {
        window.location.href = "http://localhost:5174/";
      }
    } else {
      alert(response.data.user?.message || "Login failed!");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Login failed, please try again.");
  }
};

export const handleLogout = async () => {
  try {
    // Gọi API đăng xuất từ backend
    await axiosClients.get("/auth/logout");

    // Chuyển hướng người dùng về trang đăng nhập
    window.location.href = "/login";
  } catch (error) {
    console.error("Error during logout:", error);
    alert("Logout failed, please try again.");
  }
};
