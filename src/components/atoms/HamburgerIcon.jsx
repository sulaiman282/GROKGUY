const HamburgerIcon = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col justify-around w-6 h-6 bg-transparent border-none cursor-pointer focus:outline-none"
    >
      <div
        className={`w-6 h-1 bg-black-2 rounded-full transition-all duration-300 transform ${isOpen ? 'rotate-45 translate-y-2' : 'rotate-0'}`}
      />
      <div
        className={`w-6 h-1 bg-black-2 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
      />
      <div
        className={`w-6 h-1 bg-black-2 rounded-full transition-all duration-300 transform ${isOpen ? '-rotate-45 -translate-y-2' : 'rotate-0'}`}
      />
    </button>
  );
};

export default HamburgerIcon; 