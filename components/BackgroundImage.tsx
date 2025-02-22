import React from "react";
import Image from "next/image";
import Background from "@/public/background.jpg";
import SignInButton from "./SignInButton";
import SearchImages from "./SearchImages";

const NavbarWithBackground = () => {
  return (
    <div className="relative w-full h-screen p-10">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={Background}
          alt="hero"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Navbar */}
      <div
        className="rounded-lg bg-[rgba(217,217,217,0.12)] shadow-lg backdrop-blur-lg w-full max-w-screen-xl h-16 md:h-[67.688px] flex-shrink-0 py-0 mx-auto px-4 md:px-6 flex items-center justify-between"
        style={{
          boxShadow:
            "inset 3.943px -3.943px 3.943px rgba(182, 182, 182, 0.43), inset -3.943px 3.943px 3.943px rgba(255,255,255,0.43)",
        }}>
        <nav className="flex flex-row flex-wrap md:flex-nowrap justify-between items-center w-full h-full">
          <div className="flex text-white">HomePage</div>
          <SignInButton />
        </nav>
      </div>

      {/* SearchImages */}
      <SearchImages
        searchParams={{
          q: undefined,
        }}
      />
    </div>
  );
};

export default NavbarWithBackground;
