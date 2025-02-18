"use client";
import fetchImages from "@/lib/actions/fetschimages";
import { SearchProps, PixabayImage } from "@/lib/types/imgeType";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchImages = ({ searchParams }: SearchProps) => {
  const router = useRouter();
  const queryParam = searchParams?.q || ""; // Default query if none is provided
  const [searchValue, setSearchValue] = useState(queryParam);
  const [imagesData, setImagesData] = useState<PixabayImage[] | null>(null);

  useEffect(() => {
    const fetchImagesData = async () => {
      const data = await fetchImages(searchValue);
      setImagesData(data?.hits || []);
    };
    fetchImagesData();
  }, [searchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?q=${encodeURIComponent(searchValue)}`);
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
          {searchValue ? `Searching for: ${searchValue}` : "No search query"}
        </p>
      </div>

      {/* Image Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto px-4 pb-10 relative">
        {imagesData?.map((image) => (
          <div
            key={image.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
            <Link href={image.pageURL}>
              <div className="relative aspect-w-16 aspect-h-9">
                <Image
                  src={image.webformatURL}
                  alt={image.tags}
                  className="w-full h-full object-cover"
                  width={400}
                  height={300}
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-300">By: {image.user}</p>
                <h1 className="text-lg font-semibold text-white mt-2">
                  {image.tags.split(",").slice(0, 4).join(", ")}
                </h1>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchImages;
