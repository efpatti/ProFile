import React from "react";

interface SectionProps {
 title: string;
 children: React.ReactNode;
 accent?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, accent }) => (
 <section className="p-4">
  <h3
   className="text-xl font-semibold pb-2 mb-4 flex items-center relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:shadow-[0_1px_2px_0_var(--accent)] p-1 text-[var(--accent)]"
   style={accent ? { boxShadow: `0 1px 0 0 ${accent}` } : {}}
  >
   {title}
  </h3>
  {children}
 </section>
);

export default Section;
