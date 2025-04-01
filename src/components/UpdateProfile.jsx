import React, { useState } from "react";
import { getCurrentUser, updateUser } from "../services/Users/userService";
import { useDispatch } from "react-redux";
import { addCurrentUser } from "../features/user/userSlice";

const UpdateProfile = ({ currentUser, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    first_name: currentUser?.first_name || "",
    last_name: currentUser?.last_name || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
  });
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || "");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username)
      newErrors.username = "Username không được để trống.";
    if (!formData.first_name)
      newErrors.first_name = "First name không được để trống.";
    if (!formData.last_name)
      newErrors.last_name = "Last name không được để trống.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateUser(formData);

      // Gọi API lấy user mới nhất
      const updatedUser = await getCurrentUser();
      console.log("Updated user:", updatedUser);
      // ✅ Dispatch reducer có sẵn để cập nhật state
      dispatch(addCurrentUser(updatedUser.data));

      alert("Cập nhật thành công!");
      onClose();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <h2 className="mb-5 text-center text-2xl font-bold text-gray-800">
        Update Profile
      </h2>

      {/* Avatar Preview */}
      <div className="mb-4 flex flex-col items-center">
        <div className="h-36 w-36 overflow-hidden rounded-full border-2 border-dashed border-gray-400 text-3xl font-bold text-gray-400">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              {formData.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <button
          type="button"
          className="mt-2 cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          Change Avatar
        </button>
        <input type="file" accept="image/*" style={{ display: "none" }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        {/* First/Last Name */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">
              First Name
            </label>
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your first name"
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">
              Last Name
            </label>
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your last name"
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
            )}
          </div>
        </div>

        {/* Email */}
        {/* (Nếu bạn muốn hiển thị trường Email, thêm logic kiểm tra v.v.) */}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-600 transition hover:bg-gray-100 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-blue-500 px-5 py-2 font-bold text-white transition hover:bg-blue-600 focus:outline-none"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
