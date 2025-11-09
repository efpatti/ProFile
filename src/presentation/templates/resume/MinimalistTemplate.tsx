import React from "react";
import type { Resume } from "@/core/entities/Resume";

interface MinimalistTemplateProps {
 data: Resume;
 className?: string;
}

export const MinimalistTemplate: React.FC<MinimalistTemplateProps> = ({
 data,
 className = "",
}) => {
 const primaryColor = data.colorScheme?.primary || "#000000";
 const secondaryColor = data.colorScheme?.secondary || "#666666";

 return (
  <div
   className={`w-full max-w-[210mm] mx-auto bg-white px-16 py-20 print:p-0 ${className}`}
   style={{
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: "10pt",
    lineHeight: "1.6",
    color: "#333333",
   }}
  >
   {/* Header - Minimalist Centered */}
   <header className="text-center mb-16">
    <h1
     className="text-5xl mb-4"
     style={{
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 400,
      letterSpacing: "-0.5px",
      color: primaryColor,
     }}
    >
     {data.fullName}
    </h1>

    {data.headline && (
     <p
      className="text-base mb-6"
      style={{
       color: secondaryColor,
       letterSpacing: "0.5px",
      }}
     >
      {data.headline}
     </p>
    )}

    <div
     className="flex flex-wrap justify-center gap-x-3 text-sm"
     style={{ color: secondaryColor }}
    >
     <span>{data.email}</span>
     {data.phone && (
      <>
       <span>·</span>
       <span>{data.phone}</span>
      </>
     )}
     {data.location && (
      <>
       <span>·</span>
       <span>{data.location}</span>
      </>
     )}
     {data.linkedIn && (
      <>
       <span>·</span>
       <span className="text-xs">LinkedIn</span>
      </>
     )}
     {data.github && (
      <>
       <span>·</span>
       <span className="text-xs">GitHub</span>
      </>
     )}
     {data.website && (
      <>
       <span>·</span>
       <span className="text-xs">Portfolio</span>
      </>
     )}
    </div>
   </header>

   {/* Professional Summary - Centered Quote Style */}
   {data.summary && (
    <section className="mb-16">
     <p
      className="text-center italic text-base leading-relaxed max-w-2xl mx-auto"
      style={{ color: secondaryColor }}
     >
      "{data.summary}"
     </p>
    </section>
   )}

   {/* Professional Experience - Clean Timeline */}
   {data.experiences && data.experiences.length > 0 && (
    <section className="mb-16">
     <h2
      className="text-3xl mb-8 text-center"
      style={{
       fontFamily: 'Georgia, "Times New Roman", serif',
       fontWeight: 400,
       letterSpacing: "-0.3px",
       color: primaryColor,
      }}
     >
      Experience
     </h2>

     <div className="space-y-10">
      {data.experiences.map((exp) => (
       <div key={exp.id}>
        <div className="mb-3">
         <h3
          className="text-xl mb-1"
          style={{
           fontFamily: 'Georgia, "Times New Roman", serif',
           fontWeight: 600,
           color: primaryColor,
          }}
         >
          {exp.role}
         </h3>

         <div className="flex justify-between items-baseline flex-wrap gap-2">
          <p
           className="text-base font-medium"
           style={{ color: secondaryColor }}
          >
           {exp.company}
          </p>
          <p
           className="text-sm"
           style={{
            color: secondaryColor,
            letterSpacing: "0.3px",
           }}
          >
           {exp.startDate} –{" "}
           {exp.endDate || (exp.isCurrentJob ? "Present" : "")}
          </p>
         </div>
        </div>

        {exp.description && (
         <p className="mb-3 text-justify leading-relaxed">{exp.description}</p>
        )}

        {exp.technologies && exp.technologies.length > 0 && (
         <p className="text-sm" style={{ color: secondaryColor }}>
          <span className="italic">Technologies: </span>
          {exp.technologies.join(" · ")}
         </p>
        )}
       </div>
      ))}
     </div>
    </section>
   )}

   {/* Education - Simple & Clean */}
   {data.education && data.education.length > 0 && (
    <section className="mb-16">
     <h2
      className="text-3xl mb-8 text-center"
      style={{
       fontFamily: 'Georgia, "Times New Roman", serif',
       fontWeight: 400,
       letterSpacing: "-0.3px",
       color: primaryColor,
      }}
     >
      Education
     </h2>

     <div className="space-y-6">
      {data.education.map((edu) => (
       <div key={edu.id}>
        <h3
         className="text-lg mb-1"
         style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: 600,
          color: primaryColor,
         }}
        >
         {edu.degree} in {edu.field}
        </h3>

        <div className="flex justify-between items-baseline flex-wrap gap-2">
         <p className="text-base" style={{ color: secondaryColor }}>
          {edu.institution}
         </p>
         <p
          className="text-sm"
          style={{
           color: secondaryColor,
           letterSpacing: "0.3px",
          }}
         >
          {edu.startDate} – {edu.endDate || (edu.isOngoing ? "Present" : "")}
         </p>
        </div>
       </div>
      ))}
     </div>
    </section>
   )}

   {/* Skills - Minimalist Grid */}
   {data.skills && data.skills.length > 0 && (
    <section className="mb-16">
     <h2
      className="text-3xl mb-8 text-center"
      style={{
       fontFamily: 'Georgia, "Times New Roman", serif',
       fontWeight: 400,
       letterSpacing: "-0.3px",
       color: primaryColor,
      }}
     >
      Skills
     </h2>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.skills.map((category) => (
       <div key={category.id}>
        <h3
         className="text-sm font-semibold mb-2 uppercase tracking-wider"
         style={{ color: secondaryColor }}
        >
         {category.name}
        </h3>
        <p className="text-base leading-relaxed">
         {category.skills.join(" · ")}
        </p>
       </div>
      ))}
     </div>
    </section>
   )}

   {/* Languages - Inline Simple */}
   {data.languages && data.languages.length > 0 && (
    <section className="text-center">
     <h2
      className="text-3xl mb-6"
      style={{
       fontFamily: 'Georgia, "Times New Roman", serif',
       fontWeight: 400,
       letterSpacing: "-0.3px",
       color: primaryColor,
      }}
     >
      Languages
     </h2>

     <p className="text-base" style={{ color: secondaryColor }}>
      {data.languages.map((lang) => (
       <span key={lang.id}>
        {lang.language}{" "}
        <span className="text-sm italic">({lang.proficiency})</span>
        {lang.id !== data.languages[data.languages.length - 1].id && " · "}
       </span>
      ))}
     </p>
    </section>
   )}
  </div>
 );
};
