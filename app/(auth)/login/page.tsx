"use client";
import { useState } from "react";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for error messages

  const handleLogin = async (formData: FormData) => {
    setIsLoggingIn(true);
    setError(null); // Clear any previous errors
    try {
      await login(formData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async (formData: FormData) => {
    setIsSigningUp(true);
    setError(null); // Clear any previous errors
    try {
      await signup(formData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during signup."
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    action: "login" | "signup"
  ) => {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(event.currentTarget); // Get form data

    if (action === "login") {
      await handleLogin(formData);
    } else if (action === "signup") {
      await handleSignup(formData);
    }
  };

  // Loading SVG Spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Welcome Back
        </h2>

        {/* Display error message if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => handleSubmit(e, "login")} // Handle login form submission
          className="flex flex-col space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600 font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center">
              {isLoggingIn ? <LoadingSpinner /> : "Log in"}
            </button>
          </div>
        </form>

        <form
          onSubmit={(e) => handleSubmit(e, "signup")} // Handle signup form submission
          className="mt-4">
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
            {isSigningUp ? <LoadingSpinner /> : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
