"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getFavorites, removeFavorite } from "@/lib/actions/favoriteactions";
import Link from "next/link";
import Image from "next/image";
import { logout } from "../login/actions";
import Masonry from "react-masonry-css";
import { fetchImageById } from "@/lib/actions/fetschimages";

const ProfilePage = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  // Your favorites data from Supabase only includes image_id and image_url.
  const [favorites, setFavorites] = useState<
    { image_id: string; image_url: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  // For the modal, we now store the full image details from Pixabay.
  const [selectedImage, setSelectedImage] = useState<any>(null);

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
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Define breakpoint columns for Masonry
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    768: 2,
    500: 1,
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center py-10 relative">
      {/* Home Link */}
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

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="bg-red-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg flex items-center gap-2 absolute top-7 md:top-4 right-4 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-lg"
        disabled={loading}>
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
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <p className="text-lg">
            Logged in as: <span className="font-semibold">{userEmail}</span>
          </p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-8 mb-4">Favorited Images</h2>

      {/* Masonry Layout for Favorites */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid mx-auto px-4"
        columnClassName="my-masonry-grid_column">
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <div
              key={fav.image_id}
              className="relative rounded-lg overflow-hidden shadow-lg">
              <div
                className="cursor-pointer"
                onClick={async () => {
                  // Fetch additional details for this image from Pixabay.
                  const details = await fetchImageById(fav.image_id);
                  setSelectedImage(details);
                }}>
                <Image
                  src={fav.image_url}
                  alt="Favorited Image"
                  width={300}
                  height={200}
                  className="object-cover"
                />
              </div>

              {/* Remove Favorite Button */}
              <button
                onClick={() => handleUnfavorite(fav.image_id)}
                className="absolute top-2 left-2 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-900 transition"
                title="Remove from Favorites">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-red-500"
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
      </Masonry>

      {/* Image Modal with Details */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 overflow-auto"
          onClick={() => setSelectedImage(null)}>
          <div
            className="relative max-w-5xl mx-auto p-4 bg-gray-800 rounded-lg flex flex-col md:flex-row gap-4"
            onClick={(e) => e.stopPropagation()}>
            {/* Download Button */}
            <button
              className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 text-white p-3 rounded-full hover:bg-opacity-100 transition duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(
                  selectedImage.webformatURL,
                  `image_${selectedImage.id}.jpg`
                );
              }}
              title="Download">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a3 3 0 003 3h10a3 3 0 003-3v-2m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 text-white p-3 rounded-full hover:bg-opacity-100 transition duration-300"
              onClick={() => setSelectedImage(null)}
              title="Close">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Left Column: Enlarged Image */}
            <div className="w-full md:w-1/2 flex-shrink-0">
              <Image
                src={selectedImage.largeImageURL || selectedImage.webformatURL}
                alt={selectedImage.tags}
                width={800}
                height={600}
                className="rounded-lg object-contain"
              />
            </div>

            {/* Right Column: Additional Details */}
            <div className="w-full md:w-1/2 text-white flex flex-col gap-3 overflow-auto">
              <p>
                <strong>ID:</strong> {selectedImage.id}
              </p>
              <p>
                <strong>User:</strong>{" "}
                {selectedImage.user ? selectedImage.user : "Not available"}
              </p>
              <p>
                <strong>Tags:</strong>{" "}
                {selectedImage.tags ? selectedImage.tags : "None"}
              </p>
              <p>
                <strong>Downloads:</strong>{" "}
                {selectedImage.downloads ? selectedImage.downloads : "0"}
              </p>
              <p>
                <strong>Views:</strong>{" "}
                {selectedImage.views ? selectedImage.views : "0"}
              </p>
              <p>
                <strong>Likes:</strong>{" "}
                {selectedImage.likes ? selectedImage.likes : "0"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles for Masonry */}
      <style jsx global>{`
        .my-masonry-grid {
          display: flex;
          margin-left: -16px; /* gutter size offset */
          width: 100%; /* fill the available space */
        }
        .my-masonry-grid_column {
          padding-left: 16px; /* gutter size */
          background-clip: padding-box;
        }
        .my-masonry-grid_column > div {
          margin-bottom: 16px; /* gap between items */
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
