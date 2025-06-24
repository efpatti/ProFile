import React from "react";
import {
 SiTypescript,
 SiReact,
 SiNodedotjs,
 SiGit,
 SiPostgresql,
} from "react-icons/si";
import { FaTerminal, FaJava } from "react-icons/fa";
import { BiLogoTailwindCss } from "react-icons/bi";
import { Icon } from "./Icon";

export const TechIcons: React.FC = () => {
 return (
  <div className="flex gap-4 items-center justify-center w-fit mx-auto">
   <Icon icon={SiTypescript} />
   <Icon icon={SiReact} />
   <Icon icon={SiNodedotjs} />
   <Icon icon={FaJava} />
   <Icon icon={BiLogoTailwindCss} />
   <Icon icon={SiGit} />
   <Icon icon={SiPostgresql} />
   <Icon icon={FaTerminal} />
  </div>
 );
};
