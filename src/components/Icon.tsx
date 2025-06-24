import React from "react";
import { IconType } from "react-icons";

interface IconProps {
 icon: IconType;
 size?: number; // tamanho em pixels
 color?: string;
 className?: string;
}

export const Icon: React.FC<IconProps> = ({
 icon: IconComponent,
 size = 15, // default 24px
 color = "var(--accent)",
 className = "",
}) => {
 return (
  <IconComponent
   size={size}
   color={color}
   className={`w-[${size}px] h-[${size}px] ${className}`}
  />
 );
};
