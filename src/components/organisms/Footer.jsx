import React from 'react';
import socialLinksData from "@/socialLinks.json";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 !bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {currentYear} Peace Guy. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {socialLinksData.socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  src={link.icon}
                  alt={`${link.name} icon`}
                  className="w-6 h-6 object-cover object-center rounded-full bg-white" // Smaller size than the original w-8 h-8
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;