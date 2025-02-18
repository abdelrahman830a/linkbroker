import React from "react";
import SignIn from "./signIn";

const Navbar = () => {
  return (
    <div
      className="rounded-lg bg-[rgba(217,217,217,0.12)] shadow-lg backdrop-blur-lg w-[1217.484px] h-[67.688px] flex-shrink-0 py-0"
      style={{
        boxShadow:
          "inset 3.943px -3.943px 3.943px rgba(182, 182, 182, 0.43), inset -3.943px 3.943px 3.943px rgba(255, 255, 255, 0.43)",
      }}>
      <nav className="flex flex-row justify-between items-center p-3 bg-transparent text-white w-full h-full">
        <div className="flex">HomePage</div>
        <SignIn />
      </nav>
    </div>
  );
};

export default Navbar;
