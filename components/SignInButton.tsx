"use client";

import { logout } from "@/app/(auth)/login/actions";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js"; // Import the User type
import Link from "next/link";

export default function SignInButton() {
  const [user, setUser] = useState<User | null>(null); // Explicitly type the user state
  const [error, setError] = useState<string | null>(null); // State for error handling
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();

      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.error(error);
      } else {
        setUser(data.user); // TypeScript now recognizes user as a User object
      }
    }
    getUser();
  }, []); // Empty dependency array to run only once

  const handleSignOut = async () => {
    setLoading(true); // Set loading to true when starting the logout process
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false); // Set loading to false when the process is complete
    }
  };

  return (
    <div className="md:flex items-center justify-center md:space-x-4">
      {user ? (
        <>
          {user.email && (
            <Link
              href="/profile"
              className="text-white font-medium bg-gray-800 py-2 px-4 sm:px-6 rounded-lg hover:bg-gray-900 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg flex items-center text-sm sm:text-base">
              Profile
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg items-center justify-center gap-2 w-full sm:w-auto hidden md:flex"
            disabled={loading} // Disable the button while loading
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z"
                />
              </svg>
            ) : (
              "Sign Out"
            )}
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-900 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg">
          Sign In
        </Link>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
