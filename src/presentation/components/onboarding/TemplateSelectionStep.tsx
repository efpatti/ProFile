"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
 templateSelectionSchema,
 type TemplateSelection,
} from "@/types/onboarding";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
 ProfessionalTemplate,
 ModernTemplate,
 MinimalistTemplate,
 TEMPLATE_METADATA,
} from "@/presentation/templates/resume";
import type { Resume } from "@/core/entities/Resume";

interface TemplateSelectionStepProps {
 initialData?: Partial<TemplateSelection>;
 onNext: (data: TemplateSelection) => void;
 onBack: () => void;
}

// Mock resume data for preview
const createMockResume = (template: string, palette: string): Resume => ({
 id: "preview-1",
 userId: "user-1",
 username: "preview",
 fullName: "Your Name",
 email: "your.email@example.com",
 phone: "+1 (555) 000-0000",
 location: "Your City",
 headline: "Your Professional Title",
 summary:
  "This is a preview of your resume. Complete the onboarding to see your actual information here.",
 experiences: [
  {
   id: "exp-1",
   company: "Your Company",
   role: "Your Position",
   startDate: "2020",
   endDate: null,
   isCurrentJob: true,
   description: "Your key achievements and responsibilities will appear here.",
   technologies: ["Skill 1", "Skill 2", "Skill 3"],
  },
 ],
 education: [
  {
   id: "edu-1",
   institution: "Your University",
   degree: "Your Degree",
   field: "Your Field",
   startDate: "2016",
   endDate: "2020",
   isOngoing: false,
  },
 ],
 skills: [
  {
   id: "skill-1",
   name: "Your Skills",
   skills: ["Skill 1", "Skill 2", "Skill 3"],
  },
 ],
 languages: [
  {
   id: "lang-1",
   language: "English",
   proficiency: "fluente",
  },
 ],
 template: template as any,
 colorScheme: getPaletteColors(palette),
 isPublic: false,
 isOnboardingComplete: false,
 createdAt: new Date(),
 updatedAt: new Date(),
});

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

const TEMPLATES = [
 {
  id: "professional",
  name: "Professional",
  description: "ATS-friendly, single-column layout for job applications",
  component: ProfessionalTemplate,
  metadata: TEMPLATE_METADATA.professional,
 },
 {
  id: "modern",
  name: "Modern",
  description: "Two-column creative design with colored sidebar",
  component: ModernTemplate,
  metadata: TEMPLATE_METADATA.modern,
 },
 {
  id: "minimalist",
  name: "Minimalist",
  description: "Clean and elegant with generous whitespace",
  component: MinimalistTemplate,
  metadata: TEMPLATE_METADATA.minimalist,
 },
] as const;

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
 onNext,
 onBack,
}: TemplateSelectionStepProps) {
 const [selectedPalette, setSelectedPalette] = useState(
  initialData?.palette || "ocean"
 );
 const [showPreview, setShowPreview] = useState(true); // Show preview by default

 const {
  handleSubmit,
  setValue,
  formState: { errors, isSubmitting },
 } = useForm<TemplateSelection>({
  resolver: zodResolver(templateSelectionSchema),
  defaultValues: {
   template: "professional", // Always professional
   palette: initialData?.palette || "ocean",
  },
 });

 const handlePaletteSelect = (paletteId: string) => {
  setSelectedPalette(paletteId);
  setValue("palette", paletteId, { shouldValidate: true });
  setValue("template", "professional"); // Always set to professional
 };

 // Always use professional template
 const currentTemplate = TEMPLATES.find((t) => t.id === "professional");
 const mockResume = createMockResume("professional", selectedPalette);

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
     {showPreview && currentTemplate && (
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

        <div className="bg-slate-900 p-4 overflow-auto max-h-[600px]">
         <div className="transform scale-50 origin-top-left w-[200%]">
          <currentTemplate.component data={mockResume} />
         </div>
        </div>
       </div>

       <div className="bg-slate-800/60 border border-indigo-700/40 rounded-lg p-4">
        <p className="text-sm text-slate-200">
         <strong>Tip:</strong> This is a preview with sample data. Your actual
         resume will use your information from the previous steps.
        </p>
       </div>
      </motion.div>
     )}
    </AnimatePresence>
   </div>
  </div>
 );
}
