"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import fetchImages from "@/lib/actions/fetschimages";
import { PixabayImage } from "@/lib/types/imgeType";

interface ImagesProps {
  searchParams: { q?: string };
}

const Images = ({ searchParams }: ImagesProps) => {
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
    <div className="border-4 rounded-lg border-purple-100 p-8 max-w-screen-xl">
      {/* Searchbar Section */}
      <div className="flex flex-col items-center justify-center py-10 space-y-5">
        <h1 className="text-center text-white text-[71.25px] font-bold leading-[87.638px] shadow-[0px_3.563px_3.563px_rgba(0,0,0,0.25)]">
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
            className="w-[757.031px] h-[67.688px] flex-shrink-0 rounded-[8.906px] bg-[rgba(217,217,217,0.12)] shadow-[inset_3.943px_-3.943px_3.943px_rgba(182,182,182,0.43), inset_-3.943px_3.943px_3.943px_rgba(255,255,255,0.43)] backdrop-blur-[25.0349px] px-4 text-white outline-none"
          />
        </form>
        <p className="text-center text-white text-[20.625px] font-semibold">
          Searching for: <span className="font-semibold">{searchValue}</span>
        </p>
      </div>

      {/* Image Gallery Section */}
      <div className="grid grid-cols-2 gap-4">
        {imagesData?.map((image) => (
          <div key={image.id} className="border-2 border-gray-500 rounded-lg">
            <Image
              src={image.webformatURL}
              alt={image.tags}
              className="w-full h-48 object-contain"
              width={240}
              height={160}
            />
            <div className="p-4">
              <p className="text-lg text-gray-600">By: {image.user}</p>
              <h1 className="text-xs font-semibold">
                {image.tags.split(",")[0]}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Images;
