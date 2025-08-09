import React from "react";

interface SectionProps {
 title: string;
 children: React.ReactNode;
 accent?: string;
}

const Section: React.FC<SectionProps> = ({ title, children /* , accent */ }) => (
 <section className="p-4">
  <h3 className="text-xl font-semibold pb-2 mb-4 flex items-center p-1 text-[var(--accent)] border-b-2 border-current">
   {title}
  </h3>
  {children}
 </section>
);

export default Section;
