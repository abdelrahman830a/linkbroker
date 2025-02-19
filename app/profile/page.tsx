"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getFavorites, removeFavorite } from "@/lib/actions/favoriteactions";
import Link from "next/link";
import Image from "next/image";
import { logout } from "../(auth)/login/actions";

const ProfilePage = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<
    { image_id: string; image_url: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email ?? null);
        const userFavorites = await getFavorites(user.id);
        setFavorites(userFavorites);
      }
    };

    fetchUserData();
  }, []);

  // Handle Unfavorite
  const handleUnfavorite = async (imageId: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await removeFavorite(imageId, user.id);
    setFavorites((prev) => prev.filter((fav) => fav.image_id !== imageId));
  };

  // Handle Download
  const handleDownload = (imageUrl: string, imageName: string) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", imageName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      });
  };
  const handleSignOut = async () => {
    setLoading(true); // Set loading to true when starting the logout process
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false); // Set loading to false when the process is complete
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <Link
        href="/"
        className="absolute top-4 left-4 bg-gray-800 p-3 rounded-full shadow-md hover:bg-gray-700 transition"
        title="Go to Home">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6 text-white">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10l9-7 9 7M4 10v10h16V10"
          />
        </svg>
      </Link>
      {/* Signout Button */}
      <button
        onClick={handleSignOut}
        className="bg-red-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-auto sm:w-auto absolute top-7 md:top-4 right-4 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-lg"
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

      <h1 className="text-4xl font-bold mb-6">Profile</h1>

      {userEmail && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <p className="text-lg">
            Logged in as: <span className="font-semibold">{userEmail}</span>
          </p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-8 mb-4">Favorited Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl">
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <div
              key={fav.image_id}
              className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={fav.image_url}
                alt="Favorited Image"
                width={300}
                height={200}
                className="object-cover"
              />

              {/* Download Button */}
              <button
                onClick={() =>
                  handleDownload(fav.image_url, `image_${fav.image_id}.jpg`)
                }
                className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition"
                title="Download Image">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6 text-white">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v12m0 0l-3-3m3 3l3-3m-9 3h12M5 19h14"
                  />
                </svg>
              </button>

              <button
                onClick={() => handleUnfavorite(fav.image_id)}
                className="absolute top-2 left-2 bg-yellow-500 text-white p-2 rounded-full shadow-md hover:bg-yellow-600 transition"
                title="Remove from Favorites">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No favorites yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
