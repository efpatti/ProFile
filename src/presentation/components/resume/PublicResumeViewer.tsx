"use client";

import React from "react";
import { Resume } from "@/core/entities/Resume";
import { motion } from "framer-motion";
import {
 FiMail,
 FiPhone,
 FiMapPin,
 FiLinkedin,
 FiGithub,
 FiGlobe,
} from "react-icons/fi";

interface PublicResumeViewerProps {
 resume: Resume;
}

export const PublicResumeViewer: React.FC<PublicResumeViewerProps> = ({
 resume,
}) => {
 return (
  <div className="min-h-screen bg-gray-50 py-12 px-4">
   <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden"
   >
    {/* LinkedIn Banner */}
    {resume.linkedInBannerUrl && (
     <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600">
      <img
       src={resume.linkedInBannerUrl}
       alt="Banner"
       className="w-full h-full object-cover"
      />
     </div>
    )}

    {/* Header */}
    <div
     className="p-8 border-b"
     style={{ borderColor: resume.colorScheme.primary }}
    >
     <h1
      className="text-4xl font-bold mb-2"
      style={{ color: resume.colorScheme.primary }}
     >
      {resume.fullName}
     </h1>
     <p className="text-xl text-gray-600 mb-4">{resume.headline}</p>

     {/* Contact Info */}
     <div className="flex flex-wrap gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">
       <FiMail />
       <span>{resume.email}</span>
      </div>
      {resume.phone && (
       <div className="flex items-center gap-2">
        <FiPhone />
        <span>{resume.phone}</span>
       </div>
      )}
      {resume.location && (
       <div className="flex items-center gap-2">
        <FiMapPin />
        <span>{resume.location}</span>
       </div>
      )}
     </div>

     {/* Social Links */}
     <div className="flex gap-4 mt-4">
      {resume.linkedIn && (
       <a
        href={resume.linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-blue-600 transition-colors"
       >
        <FiLinkedin size={20} />
       </a>
      )}
      {resume.github && (
       <a
        href={resume.github}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-900 transition-colors"
       >
        <FiGithub size={20} />
       </a>
      )}
      {resume.website && (
       <a
        href={resume.website}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-blue-600 transition-colors"
       >
        <FiGlobe size={20} />
       </a>
      )}
     </div>
    </div>

    {/* Summary */}
    <div className="p-8 border-b">
     <h2
      className="text-2xl font-bold mb-4"
      style={{ color: resume.colorScheme.primary }}
     >
      Resumo Profissional
     </h2>
     <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
    </div>

    {/* Experience */}
    <div className="p-8 border-b">
     <h2
      className="text-2xl font-bold mb-6"
      style={{ color: resume.colorScheme.primary }}
     >
      Experiência Profissional
     </h2>
     <div className="space-y-6">
      {resume.experiences.map((exp) => (
       <div key={exp.id}>
        <h3 className="text-xl font-semibold">{exp.role}</h3>
        <p className="text-gray-600">{exp.company}</p>
        <p className="text-sm text-gray-500 italic mb-2">
         {exp.startDate} - {exp.endDate || "Atual"}
        </p>
        {exp.description && (
         <p className="text-gray-700 mt-2">{exp.description}</p>
        )}
        {exp.technologies.length > 0 && (
         <div className="flex flex-wrap gap-2 mt-3">
          {exp.technologies.map((tech) => (
           <span
            key={tech}
            className="px-3 py-1 text-sm rounded-full"
            style={{
             backgroundColor: `${resume.colorScheme.accent}20`,
             color: resume.colorScheme.primary,
            }}
           >
            {tech}
           </span>
          ))}
         </div>
        )}
       </div>
      ))}
     </div>
    </div>

    {/* Education */}
    <div className="p-8 border-b">
     <h2
      className="text-2xl font-bold mb-6"
      style={{ color: resume.colorScheme.primary }}
     >
      Formação Acadêmica
     </h2>
     <div className="space-y-4">
      {resume.education.map((edu) => (
       <div key={edu.id}>
        <h3 className="text-xl font-semibold">
         {edu.degree} em {edu.field}
        </h3>
        <p className="text-gray-600">{edu.institution}</p>
        <p className="text-sm text-gray-500 italic">
         {edu.startDate} - {edu.endDate || "Atual"}
        </p>
       </div>
      ))}
     </div>
    </div>

    {/* Skills */}
    {resume.skills.length > 0 && (
     <div className="p-8 border-b">
      <h2
       className="text-2xl font-bold mb-6"
       style={{ color: resume.colorScheme.primary }}
      >
       Habilidades
      </h2>
      <div className="space-y-4">
       {resume.skills.map((category) => (
        <div key={category.id}>
         <h3 className="font-semibold mb-2">{category.name}</h3>
         <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
           <span
            key={skill}
            className="px-3 py-1 text-sm rounded-full"
            style={{
             backgroundColor: `${resume.colorScheme.primary}20`,
             color: resume.colorScheme.secondary,
            }}
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

    {/* Footer */}
    <div className="p-8 bg-gray-50 text-center text-sm text-gray-600">
     <p>
      Criado com{" "}
      <a
       href="https://profile.app"
       className="font-semibold hover:underline"
       style={{ color: resume.colorScheme.primary }}
      >
       ProFile
      </a>
     </p>
    </div>
   </motion.div>
  </div>
 );
};
