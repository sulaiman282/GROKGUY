import NavbarMenu from "@/components/molecules/NavbarMenu";
import SocialIconsGroup from "@/components/molecules/SocialIconsGroup";
import BuyButton from "@/components/atoms/BuyButton";

const SideDrawer = ({ isOpen, toggleDrawer, activeSection }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black-2 opacity-50 z-40 lg:hidden"
          onClick={toggleDrawer}
        ></div>
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-sky-2 shadow-xl transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
      >
        <div className="flex flex-col items-center py-8 space-y-6 relative h-[100vh]">
          {/* Close Button */}
          <button
            onClick={toggleDrawer}
            className="absolute top-4 right-4 text-black-2 hover:text-gray-4 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 mb-4 ">
            <img src="/logo.png" alt="Logo" className="h-8" />
            <span className="text-xl font-bold text-[#1A1A1A]">GROKGUY</span>
          </div>
         <div className="mt-40 space-y-4">
         {/* <NavbarMenu activeSection={activeSection} isDrawer={true} toggleDrawer={toggleDrawer} /> */}
         <BuyButton />
         </div>
          <div className="flex flex-col items-center space-y-3 mt-5">
            <SocialIconsGroup />
        
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer; 