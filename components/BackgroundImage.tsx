import React from "react";
import Image from "next/image";
import Background from "@/public/background.jpg";
import SignIn from "./signIn";

const NavbarWithBackground = () => {
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
    </div>
  );
};

export default NavbarWithBackground;
