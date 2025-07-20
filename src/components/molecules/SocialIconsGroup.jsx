import React from "react";
import SocialIcon from "@/components/atoms/SocialIcon";
import socialLinksData from "@/socialLinks.json";

const SocialIconsGroup = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {socialLinksData.socialLinks.map((link) => (
        <SocialIcon
          key={link.name}
          name={link.name}
          url={link.url}
          icon={link.icon}
        />
      ))}
    </div>
  );
};

export default SocialIconsGroup; 