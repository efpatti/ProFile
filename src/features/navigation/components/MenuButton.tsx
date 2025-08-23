"use client";
export const MenuButton = ({
 onClick,
 isOpen,
}: {
 onClick: () => void;
 isOpen: boolean;
}) => (
 <button
  onClick={onClick}
  className="md:hidden p-2 text-gray-400 hover:text-white"
  aria-label="Menu"
  aria-expanded={isOpen}
 >
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
   <path
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth={2}
    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
   />
  </svg>
 </button>
);
