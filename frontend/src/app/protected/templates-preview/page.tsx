"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
 ProfessionalTemplate,
 ModernTemplate,
 MinimalistTemplate,
 type TemplateId,
 TEMPLATE_METADATA,
} from "@/presentation/templates/resume";
import type { Resume } from "@/core/entities/Resume";

// Mock data para preview
const mockResume: Resume = {
 id: "preview-1",
 userId: "user-1",
 username: "johndoe",
 fullName: "John Doe",
 email: "john.doe@example.com",
 phone: "+1 (555) 123-4567",
 location: "San Francisco, CA",
 website: "johndoe.dev",
 linkedIn: "linkedin.com/in/johndoe",
 github: "github.com/johndoe",
 headline: "Senior Full Stack Developer",
 summary:
  "Passionate software engineer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Led teams of 5-10 developers in agile environments. Strong focus on clean code, testing, and continuous improvement.",
 experiences: [
  {
   id: "exp-1",
   company: "Tech Startup Inc.",
   role: "Senior Full Stack Developer",
   startDate: "Jan 2021",
   endDate: null,
   isCurrentJob: true,
   description:
    "Led development of microservices architecture serving 500K+ users. Implemented CI/CD pipelines reducing deployment time by 70%. Mentored junior developers and conducted code reviews.",
   technologies: [
    "React",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Kubernetes",
   ],
  },
  {
   id: "exp-2",
   company: "Digital Agency Co.",
   role: "Full Stack Developer",
   startDate: "Jun 2018",
   endDate: "Dec 2020",
   isCurrentJob: false,
   description:
    "Developed 15+ client projects from scratch. Optimized application performance achieving 40% faster load times. Collaborated with designers to implement pixel-perfect interfaces.",
   technologies: [
    "React",
    "Next.js",
    "MongoDB",
    "Express",
    "Redux",
    "Tailwind CSS",
   ],
  },
  {
   id: "exp-3",
   company: "Software Corp",
   role: "Junior Developer",
   startDate: "Mar 2016",
   endDate: "May 2018",
   isCurrentJob: false,
   description:
    "Maintained legacy systems while learning modern web development practices. Fixed 100+ bugs and implemented 20+ features. Participated in agile ceremonies and pair programming sessions.",
   technologies: ["JavaScript", "jQuery", "PHP", "MySQL", "Bootstrap"],
  },
 ],
 education: [
  {
   id: "edu-1",
   institution: "Stanford University",
   degree: "Bachelor of Science",
   field: "Computer Science",
   startDate: "2012",
   endDate: "2016",
   isOngoing: false,
  },
 ],
 skills: [
  {
   id: "skill-1",
   name: "Frontend",
   skills: ["React", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
  },
  {
   id: "skill-2",
   name: "Backend",
   skills: ["Node.js", "Express", "Prisma", "PostgreSQL", "Redis"],
  },
  {
   id: "skill-3",
   name: "DevOps",
   skills: ["Docker", "Kubernetes", "AWS", "GitHub Actions", "Terraform"],
  },
 ],
 languages: [
  {
   id: "lang-1",
   language: "English",
   proficiency: "nativo",
  },
  {
   id: "lang-2",
   language: "Spanish",
   proficiency: "fluente",
  },
  {
   id: "lang-3",
   language: "Portuguese",
   proficiency: "intermediário",
  },
 ],
 template: "classic" as const,
 colorScheme: {
  primary: "#1f2937",
  secondary: "#4b5563",
  accent: "#3b82f6",
 },
 isPublic: true,
 isOnboardingComplete: true,
 createdAt: new Date(),
 updatedAt: new Date(),
};

export default function TemplatesPreviewPage() {
 const [selectedTemplate, setSelectedTemplate] =
  useState<TemplateId>("professional");

 const templates = [
  { id: "professional" as TemplateId, Component: ProfessionalTemplate },
  { id: "modern" as TemplateId, Component: ModernTemplate },
  { id: "minimalist" as TemplateId, Component: MinimalistTemplate },
 ];

 const currentTemplate = templates.find((t) => t.id === selectedTemplate)!;

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
   <div className="max-w-7xl mx-auto px-4">
    {/* Header */}
    <div className="text-center mb-12">
     <h1 className="text-5xl font-bold text-gray-900 mb-4">Resume Templates</h1>
     <p className="text-xl text-gray-600">
      Preview all 3 professional resume templates
     </p>
    </div>

    {/* Template Selector */}
    <div className="flex flex-wrap justify-center gap-4 mb-12">
     {templates.map(({ id }) => {
      const metadata = TEMPLATE_METADATA[id];
      return (
       <motion.button
        key={id}
        onClick={() => setSelectedTemplate(id)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
                  relative px-6 py-4 rounded-xl text-left transition-all
                  ${
                   selectedTemplate === id
                    ? "bg-blue-600 text-white shadow-xl"
                    : "bg-white text-gray-700 hover:shadow-lg"
                  }
                `}
       >
        <div className="font-bold text-lg mb-1">{metadata.name}</div>
        <div
         className={`text-sm ${
          selectedTemplate === id ? "text-blue-100" : "text-gray-500"
         }`}
        >
         {metadata.category}
        </div>
        {metadata.recommended && (
         <div
          className={`
                    absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold
                    ${
                     selectedTemplate === id
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-blue-100 text-blue-700"
                    }
                  `}
         >
          ⭐ Recommended
         </div>
        )}
       </motion.button>
      );
     })}
    </div>

    {/* Template Info */}
    <motion.div
     key={selectedTemplate}
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     className="bg-white rounded-2xl shadow-xl p-8 mb-8"
    >
     <div className="flex justify-between items-start mb-6">
      <div>
       <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {TEMPLATE_METADATA[selectedTemplate].name}
       </h2>
       <p className="text-gray-600 text-lg">
        {TEMPLATE_METADATA[selectedTemplate].description}
       </p>
      </div>
      <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
       {TEMPLATE_METADATA[selectedTemplate].category}
      </div>
     </div>

     <div>
      <h3 className="font-bold text-gray-700 mb-3">Key Features:</h3>
      <ul className="grid grid-cols-2 gap-3">
       {TEMPLATE_METADATA[selectedTemplate].features.map((feature, idx) => (
        <li key={idx} className="flex items-center gap-2 text-gray-600">
         <span className="text-green-500">✓</span>
         {feature}
        </li>
       ))}
      </ul>
     </div>
    </motion.div>

    {/* Template Preview */}
    <motion.div
     key={selectedTemplate}
     initial={{ opacity: 0, scale: 0.95 }}
     animate={{ opacity: 1, scale: 1 }}
     transition={{ duration: 0.3 }}
     className="bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
     <div className="p-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-2">
       <div className="w-3 h-3 rounded-full bg-red-500"></div>
       <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
       <div className="w-3 h-3 rounded-full bg-green-500"></div>
       <div className="ml-4 text-sm text-gray-500 font-mono">
        {TEMPLATE_METADATA[selectedTemplate].name} Template
       </div>
      </div>
     </div>

     <div className="overflow-auto max-h-[800px]">
      <currentTemplate.Component data={mockResume} />
     </div>
    </motion.div>

    {/* Footer Actions */}
    <div className="flex justify-center gap-4 mt-12">
     <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
      Use This Template
     </button>
     <button className="px-8 py-4 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg">
      Download PDF
     </button>
    </div>
   </div>
  </div>
 );
}
