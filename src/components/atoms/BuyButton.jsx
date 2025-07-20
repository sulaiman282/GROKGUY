import socialLinksData from "@/socialLinks.json";

const BuyButton = ({ children, className }) => {
  const { buyButtonUrl } = socialLinksData;

  return (
    <a
      href={buyButtonUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-3 py-1.5 text-sm font-bold rounded-full bg-[#FF0000] text-white hover:bg-[#CC0000] transition-colors duration-200 flex items-center space-x-2 ${className}`}
    >
      <img src="/cart.png" alt="Cart Icon" className="w-5 h-5"  />
      <span>BUY $PEACEGUY</span>
    </a>
  );
};

export default BuyButton; 