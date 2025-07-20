import Link from "next/link";
import smoothScroll from "@/utils/smoothScroll";

const NavbarLink = ({ href, children, activeSection, isDrawer, toggleDrawer }) => {
  const isActive = activeSection === href.substring(href.indexOf('#') + 1);

  const handleClick = (e) => {
    if (href.startsWith('/') && href.length > 1) { // Only handle internal section links
      e.preventDefault();
      const targetId = href.substring(href.indexOf('#') + 1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        smoothScroll(targetElement.offsetTop, 250, 80); // 250ms duration, 80px offset for fixed header
        if (isDrawer) {
          toggleDrawer();
        }
      }
    } else if (isDrawer) {
      toggleDrawer();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200
        ${isActive ? 'bg-[#7D9FAC] text-[#FFFFFF]' : 'hover:bg-[#E0E0E0]'}
        ${isDrawer ? 'w-full text-center py-3' : ''}
      `}
    >
      {children}
    </Link>
  );
};

export default NavbarLink; 