import NavbarLink from "@/components/atoms/NavbarLink";

const NavbarMenu = ({ activeSection, isDrawer, toggleDrawer }) => {
  const links = [
    { href: "/#home", label: "HOME" },
    { href: "/#generate-meme", label: "GENERATE MEME" },
  ];

  return (
    <nav className={isDrawer ? "flex flex-col space-y-4" : "flex space-x-1.5"}>
      {links.map((link) => (
        <NavbarLink
          key={link.href}
          href={link.href}
          activeSection={activeSection}
          isDrawer={isDrawer}
          toggleDrawer={toggleDrawer}
        >
          {link.label}
        </NavbarLink>
      ))}
    </nav>
  );
};

export default NavbarMenu; 