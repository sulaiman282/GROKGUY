import React from "react";
import SocialIconsGroup from "@/components/molecules/SocialIconsGroup";
import socialLinksData from "@/socialLinks.json";
import toast from 'react-hot-toast';

const Home = () => {


  const handleCopy = () => {
    navigator.clipboard.writeText(socialLinksData.contractAddress);
    toast.success('Contract Address Copied!', {
      duration: 2000,
      position: 'bottom-center',
      style: {
        background: '#333',
        color: '#fff',
        borderRadius: '10px',
        padding: '16px',
      },
    });
  };
  return (
    <section
      id="home"
      className="min-h-screen h-screen flex flex-col space-y-10 items-center justify-center  p-4 "
    >
      {/* Left side: Text */}
      <div className="lg:w-[1000px] flex lg:flex-row flex-col items-center justify-between">
        <h1 className="glowing tracking-wider text-[96px] md:text-[115.2px] lg:text-[153.6px] font-bold text-white-1 font-bangers uppercase text-center w-full">
          Peace Guy
        </h1>

        {/* Right side: Image */}

        <img
          src="/home.png"
          alt="Peace Guy Logo"
          className="w-[230px] h-[230px] md:w-[307px] md:h-[307px] lg:w-[461px] lg:h-[461px] object-contain"
        />
      </div>
      <div className="flex items-center bg-white-1 rounded-full p-2 shadow-lg w-full lg:w-[1000px] ">
        <span className="bg-[#FF8C00] text-[#FFFFFF] font-bold px-4 py-2 rounded-full mr-2">
          CA:
        </span>
        <p className="flex-grow text-black-2 text-sm md:text-base break-all pr-2 truncate">
          {socialLinksData.contractAddress}
        </p>
        <button
          onClick={handleCopy}
          className="ml-2 p-2 rounded-full hover:bg-gray-2 hover:cursor-pointer  transition-colors duration-200"
        >
          <svg
            className="w-6 h-6 text-black-2"
            fill="none"
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 0h-2M10 12h.01M14 12h.01M18 12h.01"
            ></path>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Home;
