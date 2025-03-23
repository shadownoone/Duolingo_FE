// import { handleLogin } from '@/services/Login/handleLogin'
// import PATH from '@/utils/path'
import React, { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { handleLogin } from "../services/Log/loginService";
// import { toast } from 'react-toastify's

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLocalLogin = async (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    if (!email || !password) {
      toast.warning("Please enter both email and password.");
      return;
    }

    try {
      // Gọi hàm login từ service
      await handleLogin(email, password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleGoogleLogin = () => {
    // const apiUrl = import.meta.env.VITE_API_URL
    // if (!apiUrl) {
    //   console.error('API URL is not defined')
    //   return
    // }
    // window.open(`${apiUrl}/auth/google`, '_self')
  };

  const handleFacebookLogin = () => {
    // const apiUrl = import.meta.env.VITE_API_URL
    // if (!apiUrl) {
    //   console.error('API URL is not defined')
    //   return
    // }
    // window.open(`${apiUrl}/auth/facebook`, '_self')
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Sign In
        </h2>
        <form onSubmit={handleLocalLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-gray-500">or</span>
          <hr className="w-full border-gray-300" />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-1/2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <FaGoogle className="mr-2" /> Google
          </button>
          <button
            onClick={handleFacebookLogin}
            className="flex items-center justify-center w-1/2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
          >
            <FaFacebook className="mr-2" /> Facebook
          </button>
        </div>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
