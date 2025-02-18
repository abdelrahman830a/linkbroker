"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import fetchImages from "@/lib/actions/fetschimages";
import { PixabayImage } from "@/lib/types/imgeType";
import Background from "@/public/background.jpg";
import SignIn from "@/components/signIn";

interface ImagesProps {
  searchParams: { q?: string };
}

const ImagesWithNavbarAndBackground = ({ searchParams }: ImagesProps) => {
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
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <Image
        src={Background}
        alt="hero"
        className="object-cover w-full h-full absolute top-0 left-0 z-[-1]"
        layout="fill"
      />

      {/* Navbar */}
      <div
        className="rounded-lg bg-[rgba(217,217,217,0.12)] shadow-lg backdrop-blur-lg w-[1217.484px] h-[67.688px] flex-shrink-0 py-0 mx-auto"
        style={{
          boxShadow:
            "inset 3.943px -3.943px 3.943px rgba(182, 182, 182, 0.43), inset -3.943px 3.943px 3.943px rgba(255, 255, 255, 0.43)",
        }}>
        <nav className="flex flex-row justify-between items-center p-3 bg-transparent text-white w-full h-full">
          <div className="flex">HomePage</div>
          <SignIn />
        </nav>
      </div>

      {/* Searchbar Section */}
      <div className="flex flex-col items-center justify-center py-10 space-y-5 text-white relative z-10">
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
          {searchValue ? `Searching for: ${searchValue}` : "No search query"}
        </p>
      </div>

      {/* Image Gallery Section */}
      <div className="grid grid-cols-2 gap-4 max-w-screen-xl mx-auto pb-10 relative z-10">
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

export default ImagesWithNavbarAndBackground;
