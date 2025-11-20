"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
 templateSelectionSchema,
 type TemplateSelection,
 type OnboardingData,
} from "@/types/onboarding";
import { Check } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResumeHeader } from "@/app/protected/resume/components/ResumeHeader";
import { ResumeGrid } from "@/app/protected/resume/components/ResumeGrid";
import type { BgBannerColorName } from "@/styles/shared_style_constants";
import { bgBannerColor } from "@/styles/shared_style_constants";

interface TemplateSelectionStepProps {
 initialData?: Partial<TemplateSelection>;
 onboardingData?: Partial<OnboardingData>;
 onNext: (data: TemplateSelection) => void;
 onBack: () => void;
}

const getPaletteColors = (paletteId: string) => {
 const palette = PALETTES.find((p) => p.id === paletteId);
 if (!palette || !palette.colors || palette.colors.length < 3)
  return { primary: "#1f2937", secondary: "#4b5563", accent: "#3b82f6" };

 return {
  primary: palette.colors[0],
  secondary: palette.colors[1],
  accent: palette.colors[2],
 };
};

// For preview, we use a fixed banner color name since the actual colors come from CSS variables
const getPreviewBannerColor = (): BgBannerColorName => {
 return "midnightSlate"; // Fixed value, actual colors from CSS vars
};

const PALETTES = [
 { id: "ocean", name: "Ocean Blue", colors: ["#0891B2", "#06B6D4", "#22D3EE"] },
 {
  id: "forest",
  name: "Forest Green",
  colors: ["#059669", "#10B981", "#34D399"],
 },
 {
  id: "sunset",
  name: "Sunset Orange",
  colors: ["#DC2626", "#F59E0B", "#FBBF24"],
 },
 {
  id: "lavender",
  name: "Lavender Purple",
  colors: ["#7C3AED", "#A78BFA", "#C4B5FD"],
 },
 {
  id: "slate",
  name: "Professional Slate",
  colors: ["#475569", "#64748B", "#94A3B8"],
 },
 {
  id: "emerald",
  name: "Emerald Mint",
  colors: ["#047857", "#059669", "#10B981"],
 },
];

export function TemplateSelectionStep({
 initialData,
 onboardingData,
 onNext,
 onBack,
}: TemplateSelectionStepProps) {
 const [selectedPalette, setSelectedPalette] = useState(
  initialData?.palette || "ocean"
 );
 const [showPreview, setShowPreview] = useState(true);

 const {
  handleSubmit,
  setValue,
  formState: { errors, isSubmitting },
 } = useForm<TemplateSelection>({
  resolver: zodResolver(templateSelectionSchema),
  defaultValues: {
   template: "professional",
   palette: initialData?.palette || "ocean",
  },
 });

 const handlePaletteSelect = (paletteId: string) => {
  setSelectedPalette(paletteId);
  setValue("palette", paletteId, { shouldValidate: true });
  setValue("template", "professional");
 };

 // Convert onboarding data to resume format
 const resumeData = useMemo(() => {
  const personalInfo = onboardingData?.personalInfo;
  const professionalProfile = onboardingData?.professionalProfile;
  const skillsStep = onboardingData?.skillsStep;
  const experiencesStep = onboardingData?.experiencesStep;
  const educationStep = onboardingData?.educationStep;
  const languages = onboardingData?.languages || [];

  // Build header
  const header = {
   name: personalInfo?.fullName || "Your Name",
   title: professionalProfile?.jobTitle || "Your Professional Title",
   email: personalInfo?.email || "your.email@example.com",
  };

  // Build profile
  const profile = {
   bio: professionalProfile?.summary,
   location: personalInfo?.location,
   phone: personalInfo?.phone,
   website: professionalProfile?.website,
   linkedin: professionalProfile?.linkedin,
   github: professionalProfile?.github,
  };

  // Build contacts
  const contacts = [
   { text: header.email, href: `mailto:${header.email}` },
   personalInfo?.phone && { text: personalInfo.phone },
   personalInfo?.location && { text: personalInfo.location },
   professionalProfile?.linkedin && {
    text: "LinkedIn",
    href: professionalProfile.linkedin,
   },
   professionalProfile?.github && {
    text: "GitHub",
    href: professionalProfile.github,
   },
   professionalProfile?.website && {
    text: "Website",
    href: professionalProfile.website,
   },
  ].filter(Boolean) as { text: string; href?: string }[];

  // Build skills by group
  const skillsByGroup = skillsStep?.skills
   ? skillsStep.skills.reduce((acc: any[], skill) => {
      const existingGroup = acc.find((g) => g.title === skill.category);
      if (existingGroup) {
       existingGroup.items.push(skill.name);
      } else {
       acc.push({ title: skill.category, items: [skill.name] });
      }
      return acc;
     }, [])
   : [];

  // Build experiences
  const experiences =
   experiencesStep?.experiences?.map((exp, idx) => ({
    id: `exp-${idx}`,
    company: exp.company,
    role: exp.position,
    startDate: exp.startDate || "",
    endDate: exp.isCurrent ? null : exp.endDate || null,
    isCurrentJob: exp.isCurrent || false,
    technologies: [],
    description: exp.description,
   })) || [];

  // Build education
  const education =
   educationStep?.education?.map((edu, idx) => ({
    id: `edu-${idx}`,
    institution: edu.institution,
    degree: edu.degree,
    field: edu.field,
    startDate: edu.startDate || "",
    endDate: edu.isCurrent ? null : edu.endDate || null,
    description: undefined,
   })) || [];

  // Build languages list
  const languagesList = languages.map((lang) => lang.name);

  return {
   header,
   profile,
   contacts,
   skillsByGroup,
   experiences,
   education,
   languagesList,
   projects: [],
   certifications: [],
   interests: { items: [] },
   awards: [],
   recommendations: [],
  };
 }, [onboardingData]);

 const selectedBg = getPreviewBannerColor();

 return (
  <div className="space-y-8 text-slate-100">
   <div className="flex justify-between items-center">
    <div>
     <h2 className="text-2xl font-bold text-slate-100">Revise seu Currículo</h2>
     <p className="text-slate-300 mt-1">
      Visualize seu currículo profissional e escolha uma paleta de cores
     </p>
    </div>
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Left Column - Color Selection */}
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
     {/* Info Card */}
     <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-indigo-300 mb-1">
       Template Profissional
      </h3>
      <p className="text-xs text-slate-300">
       Seu currículo está no formato profissional, otimizado para ATS (sistemas de rastreamento de candidatos) e recrutadores.
      </p>
     </div>

     {/* Palette Selection */}
     <div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">
       Color Palette <span className="text-red-500">*</span>
      </h3>
      <p className="text-sm text-slate-300 mb-4">
       Pick colors that represent your personal brand
      </p>

      <div className="grid grid-cols-2 gap-3">
       {PALETTES.map((palette) => (
        <motion.button
         key={palette.id}
         type="button"
         onClick={() => handlePaletteSelect(palette.id)}
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         className={`
         relative p-3 border-2 rounded-lg transition-all
         ${
          selectedPalette === palette.id
           ? "border-indigo-500 bg-indigo-500/10 shadow-md"
           : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
         }
        `}
        >
         {selectedPalette === palette.id && (
          <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1">
           <Check size={12} />
          </div>
         )}

         <div className="flex gap-1.5 mb-2">
          {palette.colors?.map((color, index) => (
           <div
            key={index}
            className="flex-1 h-10 rounded shadow-sm"
            style={{ backgroundColor: color }}
           />
          )) || <div className="text-slate-400 text-xs">No colors</div>}
         </div>

         <p className="text-xs font-medium text-slate-100 text-center">
          {palette.name}
         </p>
        </motion.button>
       ))}
      </div>

      {errors.palette && (
       <p className="mt-2 text-sm text-red-400">{errors.palette.message}</p>
      )}
     </div>

     <div className="flex gap-4 pt-4">
      <button
       type="button"
       onClick={onBack}
       className="flex-1 px-6 py-3 border-2 border-slate-700 text-slate-200 font-medium rounded-lg hover:bg-slate-800 transition-colors"
      >
       Back
      </button>
      <button
       type="submit"
       disabled={isSubmitting}
       className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
      >
       {isSubmitting ? "Finishing..." : "Complete Onboarding"}
      </button>
     </div>
    </form>

    {/* Right Column - Live Preview */}
    <AnimatePresence mode="wait">
     {showPreview && (
      <motion.div
       initial={{ opacity: 0, x: 20 }}
       animate={{ opacity: 1, x: 0 }}
       exit={{ opacity: 0, x: 20 }}
       transition={{ duration: 0.3 }}
       className="lg:sticky lg:top-8 space-y-4"
      >
       <div className="rounded-xl shadow-lg overflow-hidden border border-slate-700 bg-slate-900/60">
        <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
         <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
         </div>
         <span className="text-sm text-slate-300 ml-2">Live Preview</span>
        </div>

        <div className="bg-white p-4 overflow-auto max-h-[600px]">
         <div className="transform scale-50 origin-top-left w-[200%]">
          <div
           className="bg-white shadow-xl"
           style={{
            "--accent": getPaletteColors(selectedPalette).primary,
            "--primary": getPaletteColors(selectedPalette).primary,
            "--secondary": getPaletteColors(selectedPalette).secondary,
           } as React.CSSProperties}
          >
           <ResumeHeader
            displayName={resumeData.header.name}
            userName={resumeData.header.name}
            subtitle={resumeData.header.title}
            contacts={resumeData.contacts}
           />
           <ResumeGrid
            profile={resumeData.profile}
            languagesList={resumeData.languagesList}
            education={resumeData.education}
            experiences={resumeData.experiences}
            recommendations={resumeData.recommendations}
            certifications={resumeData.certifications}
            skillsByGroup={resumeData.skillsByGroup}
            projects={resumeData.projects}
            interests={resumeData.interests}
            awards={resumeData.awards}
            language="pt-br"
            selectedBg={selectedBg}
           />
          </div>
         </div>
        </div>
       </div>

       <div className="bg-slate-800/60 border border-indigo-700/40 rounded-lg p-4">
        <p className="text-sm text-slate-200">
         <strong>Preview:</strong> Este é seu currículo com as informações que você forneceu. Escolha uma paleta de cores acima.
        </p>
       </div>
      </motion.div>
     )}
    </AnimatePresence>
   </div>
  </div>
 );
}
