/**
 * Modern Resume Template (Two-Column Creative)
 *
 * Design Philosophy:
 * - Two-column layout: left sidebar + right main content
 * - Accent colors from user's color scheme
 * - Icons for visual hierarchy (lucide-react)
 * - Tech-forward aesthetic
 * - Prominently display technologies/tools
 *
 * Uncle Bob: "Clean code is simple and direct"
 */

import React from "react";
import type { Resume } from "@/core/entities/Resume";
import {
 Mail,
 Phone,
 MapPin,
 Linkedin,
 Github,
 Globe,
 Briefcase,
 GraduationCap,
 Code,
 Languages as LanguagesIcon,
} from "lucide-react";

interface ModernTemplateProps {
 data: Resume;
 className?: string;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({
 data,
 className = "",
}) => {
 const primaryColor = data.colorScheme?.primary || "#3b82f6"; // blue-500
 const secondaryColor = data.colorScheme?.secondary || "#64748b"; // slate-500
 const accentColor = data.colorScheme?.accent || "#8b5cf6"; // violet-500

 return (
  <div
   className={`w-full max-w-[210mm] mx-auto bg-white print:p-0 ${className}`}
   style={{
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: "10.5pt",
    lineHeight: "1.4",
    color: "#1f2937",
   }}
  >
   <div className="flex flex-col md:flex-row">
    {/* LEFT SIDEBAR - 35% */}
    <aside
     className="w-full md:w-[35%] p-8 text-white print:text-white"
     style={{ backgroundColor: primaryColor }}
    >
     {/* Profile Section */}
     <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2 break-words">{data.fullName}</h1>
      {data.headline && (
       <p className="text-sm opacity-90 font-medium">{data.headline}</p>
      )}
     </div>

     {/* Contact Information */}
     <div className="mb-8">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-white/30">
       CONTACT
      </h2>

      <div className="space-y-3 text-sm">
       <div className="flex items-start gap-2">
        <Mail size={16} className="mt-0.5 flex-shrink-0" />
        <span className="break-all">{data.email}</span>
       </div>

       {data.phone && (
        <div className="flex items-center gap-2">
         <Phone size={16} className="flex-shrink-0" />
         <span>{data.phone}</span>
        </div>
       )}

       {data.location && (
        <div className="flex items-start gap-2">
         <MapPin size={16} className="mt-0.5 flex-shrink-0" />
         <span>{data.location}</span>
        </div>
       )}

       {data.linkedIn && (
        <div className="flex items-center gap-2">
         <Linkedin size={16} className="flex-shrink-0" />
         <span className="text-xs break-all">{data.linkedIn}</span>
        </div>
       )}

       {data.github && (
        <div className="flex items-center gap-2">
         <Github size={16} className="flex-shrink-0" />
         <span className="text-xs break-all">{data.github}</span>
        </div>
       )}

       {data.website && (
        <div className="flex items-center gap-2">
         <Globe size={16} className="flex-shrink-0" />
         <span className="text-xs break-all">{data.website}</span>
        </div>
       )}
      </div>
     </div>

     {/* Skills Section */}
     {data.skills && data.skills.length > 0 && (
      <div className="mb-8">
       <h2 className="text-lg font-bold mb-4 pb-2 border-b border-white/30 flex items-center gap-2">
        <Code size={18} />
        SKILLS
       </h2>

       <div className="space-y-4">
        {data.skills.map((category) => (
         <div key={category.id}>
          <h3 className="font-bold text-sm mb-2 opacity-90">{category.name}</h3>
          <div className="flex flex-wrap gap-1.5">
           {category.skills.map((skill, idx) => (
            <span
             key={idx}
             className="px-2 py-1 text-xs rounded bg-white/20 font-medium"
            >
             {skill}
            </span>
           ))}
          </div>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Languages Section */}
     {data.languages && data.languages.length > 0 && (
      <div>
       <h2 className="text-lg font-bold mb-4 pb-2 border-b border-white/30 flex items-center gap-2">
        <LanguagesIcon size={18} />
        LANGUAGES
       </h2>

       <div className="space-y-2 text-sm">
        {data.languages.map((lang) => (
         <div key={lang.id} className="flex justify-between items-center">
          <span className="font-medium">{lang.language}</span>
          <span className="text-xs opacity-80 capitalize">
           {lang.proficiency}
          </span>
         </div>
        ))}
       </div>
      </div>
     )}
    </aside>

    {/* RIGHT MAIN CONTENT - 65% */}
    <main className="w-full md:w-[65%] p-8">
     {/* Professional Summary */}
     {data.summary && (
      <section className="mb-8">
       <h2
        className="text-2xl font-bold mb-4 flex items-center gap-2"
        style={{ color: primaryColor }}
       >
        Profile
       </h2>
       <p className="text-justify leading-relaxed">{data.summary}</p>
      </section>
     )}

     {/* Professional Experience */}
     {data.experiences && data.experiences.length > 0 && (
      <section className="mb-8">
       <h2
        className="text-2xl font-bold mb-4 flex items-center gap-2"
        style={{ color: primaryColor }}
       >
        <Briefcase size={24} />
        Experience
       </h2>

       {data.experiences.map((exp) => (
        <div
         key={exp.id}
         className="mb-6 last:mb-0 relative pl-4 border-l-2"
         style={{ borderColor: accentColor }}
        >
         <div className="mb-2">
          <h3 className="text-lg font-bold" style={{ color: accentColor }}>
           {exp.role}
          </h3>
          <p className="font-semibold" style={{ color: secondaryColor }}>
           {exp.company}
          </p>
          <p className="text-sm text-gray-500">
           {exp.startDate} -{" "}
           {exp.endDate || (exp.isCurrentJob ? "Present" : "")}
          </p>
         </div>

         {exp.description && (
          <p className="mb-3 text-justify">{exp.description}</p>
         )}

         {exp.technologies && exp.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
           {exp.technologies.map((tech, idx) => (
            <span
             key={idx}
             className="px-2 py-1 text-xs rounded font-medium"
             style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
             }}
            >
             {tech}
            </span>
           ))}
          </div>
         )}
        </div>
       ))}
      </section>
     )}

     {/* Education */}
     {data.education && data.education.length > 0 && (
      <section>
       <h2
        className="text-2xl font-bold mb-4 flex items-center gap-2"
        style={{ color: primaryColor }}
       >
        <GraduationCap size={24} />
        Education
       </h2>

       {data.education.map((edu) => (
        <div
         key={edu.id}
         className="mb-4 last:mb-0 relative pl-4 border-l-2"
         style={{ borderColor: accentColor }}
        >
         <h3 className="font-bold text-base" style={{ color: accentColor }}>
          {edu.degree} in {edu.field}
         </h3>
         <p className="font-semibold" style={{ color: secondaryColor }}>
          {edu.institution}
         </p>
         <p className="text-sm text-gray-500">
          {edu.startDate} - {edu.endDate || (edu.isOngoing ? "Present" : "")}
         </p>
        </div>
       ))}
      </section>
     )}
    </main>
   </div>
  </div>
 );
};
