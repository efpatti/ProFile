/**
 * Professional Resume Template (ATS-Friendly)
 *
 * Design Philosophy:
 * - Single column layout for maximum ATS compatibility
 * - High contrast for readability
 * - Sans-serif fonts (system fonts)
 * - Clean sections with clear hierarchy
 * - No graphics/icons to ensure ATS parsing
 *
 * Uncle Bob: "Simplicity is the ultimate sophistication"
 */

import React from "react";
import type { Resume } from "@/core/entities/Resume";

interface ProfessionalTemplateProps {
 data: Resume;
 className?: string;
}

export const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({
 data,
 className = "",
}) => {
 const primaryColor = data.colorScheme?.primary || "#1f2937"; // gray-800
 const secondaryColor = data.colorScheme?.secondary || "#4b5563"; // gray-600

 return (
  <div
   className={`w-full max-w-[210mm] mx-auto bg-white p-12 print:p-0 ${className}`}
   style={{
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: "11pt",
    lineHeight: "1.5",
    color: "#1f2937",
   }}
  >
   {/* Header - Contact Information */}
   <header
    className="mb-6 pb-4 border-b-2"
    style={{ borderColor: primaryColor }}
   >
    <h1 className="text-4xl font-bold mb-2" style={{ color: primaryColor }}>
     {data.fullName}
    </h1>

    {data.headline && (
     <p className="text-lg mb-3" style={{ color: secondaryColor }}>
      {data.headline}
     </p>
    )}

    <div
     className="flex flex-wrap gap-x-4 gap-y-1 text-sm"
     style={{ color: secondaryColor }}
    >
     <span>{data.email}</span>
     {data.phone && <span>• {data.phone}</span>}
     {data.location && <span>• {data.location}</span>}
     {data.linkedIn && <span>• LinkedIn</span>}
     {data.github && <span>• GitHub</span>}
     {data.website && <span>• Portfolio</span>}
    </div>
   </header>

   {/* Professional Summary */}
   {data.summary && (
    <section className="mb-6">
     <h2
      className="text-xl font-bold mb-3 pb-1 border-b"
      style={{ color: primaryColor, borderColor: secondaryColor }}
     >
      PROFESSIONAL SUMMARY
     </h2>
     <p className="text-justify">{data.summary}</p>
    </section>
   )}

   {/* Professional Experience */}
   {data.experiences && data.experiences.length > 0 && (
    <section className="mb-6">
     <h2
      className="text-xl font-bold mb-3 pb-1 border-b"
      style={{ color: primaryColor, borderColor: secondaryColor }}
     >
      PROFESSIONAL EXPERIENCE
     </h2>

     {data.experiences.map((exp) => (
      <div key={exp.id} className="mb-4 last:mb-0">
       <div className="flex justify-between items-baseline mb-1">
        <h3 className="font-bold text-base">{exp.role}</h3>
        <span className="text-sm" style={{ color: secondaryColor }}>
         {exp.startDate} - {exp.endDate || (exp.isCurrentJob ? "Present" : "")}
        </span>
       </div>

       <p className="font-semibold mb-2" style={{ color: secondaryColor }}>
        {exp.company}
       </p>

       {exp.description && (
        <p className="mb-2 text-justify">{exp.description}</p>
       )}

       {exp.technologies && exp.technologies.length > 0 && (
        <p className="text-sm">
         <span className="font-semibold">Technologies:</span>{" "}
         {exp.technologies.join(", ")}
        </p>
       )}
      </div>
     ))}
    </section>
   )}

   {/* Education */}
   {data.education && data.education.length > 0 && (
    <section className="mb-6">
     <h2
      className="text-xl font-bold mb-3 pb-1 border-b"
      style={{ color: primaryColor, borderColor: secondaryColor }}
     >
      EDUCATION
     </h2>

     {data.education.map((edu) => (
      <div key={edu.id} className="mb-3 last:mb-0">
       <div className="flex justify-between items-baseline mb-1">
        <h3 className="font-bold text-base">
         {edu.degree} in {edu.field}
        </h3>
        <span className="text-sm" style={{ color: secondaryColor }}>
         {edu.startDate} - {edu.endDate || (edu.isOngoing ? "Present" : "")}
        </span>
       </div>

       <p className="font-semibold" style={{ color: secondaryColor }}>
        {edu.institution}
       </p>
      </div>
     ))}
    </section>
   )}

   {/* Skills */}
   {data.skills && data.skills.length > 0 && (
    <section className="mb-6">
     <h2
      className="text-xl font-bold mb-3 pb-1 border-b"
      style={{ color: primaryColor, borderColor: secondaryColor }}
     >
      TECHNICAL SKILLS
     </h2>

     <div className="space-y-2">
      {data.skills.map((category) => (
       <div key={category.id}>
        <span className="font-semibold">{category.name}:</span>{" "}
        {category.skills.join(", ")}
       </div>
      ))}
     </div>
    </section>
   )}

   {/* Languages */}
   {data.languages && data.languages.length > 0 && (
    <section className="mb-6">
     <h2
      className="text-xl font-bold mb-3 pb-1 border-b"
      style={{ color: primaryColor, borderColor: secondaryColor }}
     >
      LANGUAGES
     </h2>

     <p>
      {data.languages
       .map((lang) => `${lang.language} (${lang.proficiency})`)
       .join(" • ")}
     </p>
    </section>
   )}
  </div>
 );
};
