"use client";

import { logout } from "@/app/login/actions";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js"; // Import the User type

export default function SignInButton() {
  const [user, setUser] = useState<User | null>(null); // Explicitly type the user state

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
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {user ? <p>Hello {user.email?.split("@")[0]}</p> : <p>Not logged in</p>}
      <button
        onClick={logout}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </div>
  );
}
