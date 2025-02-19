"use client";
import { toggleFavorite } from "@/lib/actions/favoriteactions";
import fetchImages from "@/lib/actions/fetschimages";
import { SearchProps, PixabayImage, tabs } from "@/lib/types/imgeType";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchImages = ({ searchParams }: SearchProps) => {
  const router = useRouter();
  const queryParam = searchParams?.q || "horse"; // Default query if none is provided
  const [searchValue, setSearchValue] = useState(queryParam);
  const [imagesData, setImagesData] = useState<PixabayImage[] | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({}); // Store favorite status
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null); // Track logged-in user

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchValue.trim() === "") return; // Prevent empty requests

      const data = await fetchImages(searchValue);
      setImagesData(data?.hits || []);
    }, 500); // Adjust delay as needed

    return () => clearTimeout(delayDebounce); // Cleanup function
  }, [searchValue]);

  useEffect(() => {
    // Fetch user session from Supabase
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user); // Set user state
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("favorites")
        .select("image_id")
        .eq("user_id", user.id);

      if (!error) {
        const favoriteMap = data.reduce(
          (acc, fav) => ({
            ...acc,
            [fav.image_id]: true,
          }),
          {}
        );
        setFavorites(favoriteMap);
      }
    };

    fetchFavorites();
  }, [user]); // Re-run when user changes

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?q=${encodeURIComponent(searchValue)}`);
  };

  const handleTabClick = (tabName: string) => {
    setSearchValue(tabName); // Update search value when a tab is clicked
  };

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

  const handleToggleFavorite = async (image: PixabayImage) => {
    if (!user) return;

    // Optimistically update UI
    setFavorites((prev) => ({
      ...prev,
      [image.id]: !prev[image.id],
    }));

    // Sync with database
    const { error } = await toggleFavorite({
      id: image.id.toString(),
      webformatURL: image.webformatURL,
    });

    // Revert if there's an error
    if (error) {
      setFavorites((prev) => ({
        ...prev,
        [image.id]: !prev[image.id],
      }));
    }
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative py-6">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center py-8 space-y-4 md:space-y-8 text-white relative px-4">
        <h1 className="text-center text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-[87.638px] md:max-w-4xl">
          Discover over 2,000,000 free Stock Images
        </h1>
        <form
          onSubmit={handleFormSubmit}
          className="w-full flex justify-center">
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search images..."
            className="w-full max-w-[757.031px] h-[50px] sm:h-[67.688px] flex-shrink-0 rounded-[8.906px] bg-[rgba(217,217,217,0.12)] shadow-[inset_3.943px_-3.943px_3.943px_rgba(182,182,182,0.43),inset_-3.943px_3.943px_3.943px_rgba(255,255,255,0.43)] backdrop-blur-[25.0349px] px-6 text-white outline-none placeholder-gray-300 focus:ring-2 focus:ring-opacity-50 focus:ring-white transition-all"
          />
        </form>
        <p className="text-center text-white text-base sm:text-lg md:text-xl font-semibold rounded-[8.906px] bg-[rgba(217,217,217,0.12)] shadow-[inset_3.943px_-3.943px_3.943px_rgba(182,182,182,0.43),inset_-3.943px_3.943px_3.943px_rgba(255,255,255,0.43)] backdrop-blur-[25.0349px] px-6 py-3 sm:py-4 inline-block">
          {searchValue ? `Searching for: ${searchValue}` : "No Search Query"}
        </p>
      </div>

      {/* Tabs Section */}
      <div className="flex gap-2 flex-wrap bg-gray-800 p-4 justify-center mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 sm:px-8 py-2 sm:py-4 mx-auto rounded-xs bg-gray-400 border-gray-500 text-black hover:bg-gray-500 transition-all ${
              searchValue.toLowerCase() === tab.toLowerCase()
                ? "ring-2 ring-white ring-opacity-50"
                : ""
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Image Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-screen-xl mx-auto pb-10 relative mt-8 pt-5 px-4 sm:px-0">
        {imagesData?.map((image) => (
          <div
            key={image.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105 relative">
            <div
              className="cursor-pointer relative aspect-w-16 aspect-h-9"
              onClick={() => setSelectedImage(image.largeImageURL)}>
              <Image
                src={image.webformatURL}
                alt={image.tags}
                className="object-cover"
                width={image.imageWidth}
                height={image.imageHeight}
                layout="responsive"
              />
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-300">By: {image.user}</p>
              <h1 className="text-lg font-semibold text-white mt-2">
                {image.tags.split(",").slice(0, 4).join(", ")}
              </h1>

              {/* Favorite Image */}
              {user && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(image);
                  }}
                  className="mt-2 p-2 absolute top-2 left-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                  {favorites[image.id] ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Enlarged Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
          onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-screen-lg">
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

            <Image
              src={selectedImage}
              alt="Enlarged Image"
              width={800}
              height={600}
              className="rounded-lg max-w-full max-h-screen"
            />

            {/* Download Button */}
            <button
              className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 text-white p-3 rounded-full hover:bg-opacity-100 transition duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(selectedImage, "downloaded_image.jpg");
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
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchImages;
