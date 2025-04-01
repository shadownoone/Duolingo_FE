import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-2xl text-gray-600">
          Rất tiếc, trang bạn yêu cầu không tồn tại!
        </p>
        <p className="mt-2 text-lg text-gray-500">
          Có thể bạn đã nhập sai URL hoặc trang đã bị xóa.
        </p>
        <a
          href="/learn"
          className="mt-8 inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Quay lại trang chủ
        </a>
      </div>
    </div>
  );
};

export default NotFound;
