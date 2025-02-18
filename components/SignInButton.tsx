"use client";

import { logout } from "@/app/(auth)/login/actions";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js"; // Import the User type
import Link from "next/link";

export default function SignInButton() {
  const [user, setUser] = useState<User | null>(null); // Explicitly type the user state
  const [error, setError] = useState<string | null>(null); // State for error handling

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

  return (
    <div className="flex items-center justify-center space-x-4">
      {user ? (
        <>
          {user.email && (
            <p className="text-gray-700 font-medium">
              {user.email.split("@")[0]}
            </p>
          )}
          <button
            onClick={async () => {
              try {
                await logout();
                setUser(null);
              } catch (error) {
                console.error("Logout failed:", error);
                setError("Logout failed. Please try again.");
              }
            }}
            className="bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-900 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg">
            Sign Out
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
