import React from "react";

const SocialIcon = ({ name, url, icon }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-80 transition-opacity duration-200"
    >
      <img
        src={icon}
        alt={`${name} icon`}
        className="w-8 h-8"
      />
    </a>
  );
};

export default SocialIcon; 