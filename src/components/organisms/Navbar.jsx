import React, { useState, useEffect } from "react";
import NavbarMenu from "@/components/molecules/NavbarMenu";
import SocialIconsGroup from "@/components/molecules/SocialIconsGroup";
import BuyButton from "@/components/atoms/BuyButton";
import HamburgerIcon from "@/components/atoms/HamburgerIcon";
import SideDrawer from "@/components/molecules/SideDrawer";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollPosition, setScrollPosition] = useState(0);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    if (isDrawerOpen) {
      setScrollPosition(window.scrollY);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
    }
    return () => {
      // Clean up in case component unmounts while drawer is open
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isDrawerOpen, scrollPosition]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            console.log("Active Section:", entry.target.id);
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: "0px", // Trigger when 70% of the section is visible
        threshold: 0.7,
      }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <header className="fixed top-0 w-full flex justify-center py-4 z-50 bg-transparent">
      <div className="relative flex items-center justify-between bg-white-1 rounded-full px-6 py-1.5 shadow-lg min-w-[90vw] lg:min-w-[1000px] mx-4">
        {/* Desktop Navbar */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8" />
            <span className="text-xl font-bold text-black-1">GROKGUY</span>
          </div>

          {/* Center: Navbar Menu and Social Links */}

    

          {/* Right: Buy Button */}
          <div className="flex items-center space-x-3">
            <SocialIconsGroup />
            <BuyButton />
          </div>
        </div>

        {/* Mobile Navbar - Hamburger Icon */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <HamburgerIcon onClick={toggleDrawer} isOpen={isDrawerOpen} />
          <BuyButton />
        </div>
      </div>

      {/* Side Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        activeSection={activeSection}
      />
    </header>
  );
};

export default Navbar;
