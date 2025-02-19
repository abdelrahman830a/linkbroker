"use client";
import fetchImages from "@/lib/actions/fetschimages";
import { SearchProps, PixabayImage } from "@/lib/types/imgeType";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchImages = ({ searchParams }: SearchProps) => {
  const router = useRouter();
  const queryParam = searchParams?.q || "horse"; // Default query if none is provided
  const [searchValue, setSearchValue] = useState(queryParam);
  const [imagesData, setImagesData] = useState<PixabayImage[] | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchValue.trim() === "") return; // Prevent empty requests

      const data = await fetchImages(searchValue);
      setImagesData(data?.hits || []);
    }, 500); // Adjust delay as needed

    return () => clearTimeout(delayDebounce); // Cleanup function
  }, [searchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?q=${encodeURIComponent(searchValue)}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center py-10 space-y-4 md:space-y-5 text-white relative px-4">
        <h1 className="text-center text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-[87.638px] shadow-[0px_3.563px_3.563px_rgba(0,0,0,0.25)]">
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
            className="w-full max-w-lg h-12 md:h-[67.688px] flex-shrink-0 rounded-lg bg-[rgba(217,217,217,0.12)] shadow-[inset_3.943px_-3.943px_3.943px_rgba(182,182,182,0.43), inset_-3.943px_3.943px_3.943px_rgba(255,255,255,0.43)] backdrop-blur-[25.0349px] px-4 text-white outline-none placeholder-gray-300"
          />
        </form>
        <p className="text-center text-white text-lg md:text-xl font-semibold">
          {searchValue ? `Searching for: ${searchValue}` : ""}
        </p>
      </div>

      {/* /* Image Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto px-4 pb-10 relative">
        {imagesData?.map((image) => (
          <div
            key={image.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105 relative">
            <Link href={image.pageURL}>
              <div className="relative aspect-w-16 aspect-h-9">
                <Image
                  src={image.webformatURL}
                  alt={image.tags}
                  className="object-cover"
                  width={image.imageWidth}
                  height={image.imageHeight}
                />
              </div>
            </Link>

            <div className="p-4">
              <p className="text-sm text-gray-300">By: {image.user}</p>
              <h1 className="text-lg font-semibold text-white mt-2">
                {image.tags.split(",").slice(0, 4).join(", ")}
              </h1>
            </div>
            <button
              onClick={() =>
                handleDownload(image.webformatURL, `image_${image.id}.jpg`)
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
              className="absolute top-2 left-2 bg-gray-900 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition"
              title="Favorite Image">
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
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchImages;
