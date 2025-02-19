"use client";
import { useState } from "react";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);

  const handleLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setLoadingLogin(true);
    const form = (event.target as HTMLButtonElement).form;
    if (form) {
      await login(new FormData(form));
    }
    setLoadingLogin(false);
  };

  const handleSignup = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setLoadingSignup(true);
    const form = (event.target as HTMLButtonElement).form;
    if (form) {
      await signup(new FormData(form));
    }
    setLoadingSignup(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center mb-4">Welcome</h2>

        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700">
          Email:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label
          htmlFor="password"
          className="block mt-3 text-sm font-medium text-gray-700">
          Password:
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mt-4 flex justify-between">
          <button
            className="w-[48%] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center"
            disabled={loadingLogin}
            onClick={handleLogin}>
            {loadingLogin ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"></path>
              </svg>
            ) : (
              "Log in"
            )}
          </button>

          <button
            className="w-[48%] bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition flex items-center justify-center"
            disabled={loadingSignup}
            onClick={handleSignup}>
            {loadingSignup ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"></path>
              </svg>
            ) : (
              "Sign up"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
