/**
 * Resume Settings Page - Template Selection
 *
 * Allows users to change their resume template and color palette
 * after completing onboarding.
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Save, Loader2 } from "lucide-react";
import {
 ProfessionalTemplate,
 ModernTemplate,
 MinimalistTemplate,
 TEMPLATE_METADATA,
} from "@/presentation/templates/resume";
import type { Resume } from "@/core/entities/Resume";
import { showToast } from "@/shared/utils/toast";

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

export default function TemplateSettingsPage() {
 const [selectedTemplate, setSelectedTemplate] =
  useState<string>("professional");
 const [selectedPalette, setSelectedPalette] = useState<string>("ocean");
 const [showPreview, setShowPreview] = useState(true);
 const [isSaving, setIsSaving] = useState(false);
 const [resumeData, setResumeData] = useState<Resume | null>(null);
 const [isLoading, setIsLoading] = useState(true);

 // Load current resume data
 useEffect(() => {
  const loadResume = async () => {
   try {
    const response = await fetch("/api/resume");
    if (response.ok) {
     const data = await response.json();
     setResumeData(data.resume);
     setSelectedTemplate(data.resume.template || "professional");
     // Extract palette from colorScheme if stored
     setSelectedPalette("ocean"); // Default for now
    }
   } catch (error) {
    console.error("Failed to load resume:", error);
    showToast.error("Failed to load your resume");
   } finally {
    setIsLoading(false);
   }
  };

  loadResume();
 }, []);

 const handleSave = async () => {
  setIsSaving(true);
  try {
   const response = await fetch("/api/resume", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     template: selectedTemplate,
     colorScheme: getPaletteColors(selectedPalette),
    }),
   });

   if (response.ok) {
    showToast.success("Template updated successfully!");
    // Update local state
    if (resumeData) {
     setResumeData({
      ...resumeData,
      template: selectedTemplate as any,
      colorScheme: getPaletteColors(selectedPalette),
     });
    }
   } else {
    throw new Error("Failed to update template");
   }
  } catch (error) {
   console.error("Failed to save:", error);
   showToast.error("Failed to update template");
  } finally {
   setIsSaving(false);
  }
 };

 const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate);
 const previewData = resumeData || {
  id: "preview",
  userId: "user",
  username: "preview",
  fullName: "Loading...",
  email: "loading@example.com",
  headline: "Loading your data...",
  summary: "Please wait while we load your resume information.",
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  template: selectedTemplate as any,
  colorScheme: getPaletteColors(selectedPalette),
  isPublic: false,
  isOnboardingComplete: true,
  createdAt: new Date(),
  updatedAt: new Date(),
 };

 if (isLoading) {
  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="text-center">
     <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
     <p className="text-gray-600">Loading your resume...</p>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
   <div className="max-w-7xl mx-auto px-4">
    {/* Header */}
    <div className="mb-8">
     <h1 className="text-4xl font-bold text-gray-900 mb-2">
      Template & Style Settings
     </h1>
     <p className="text-lg text-gray-600">Customize your resume's appearance</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
     {/* Left Column - Selection */}
     <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
       <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Resume Template</h2>
        <button
         onClick={() => setShowPreview(!showPreview)}
         className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
         <Sparkles size={16} />
         {showPreview ? "Hide" : "Show"} Preview
        </button>
       </div>

       <div className="space-y-3">
        {TEMPLATES.map((template) => (
         <motion.button
          key={template.id}
          type="button"
          onClick={() => setSelectedTemplate(template.id)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`
                      w-full p-4 border-2 rounded-xl text-left transition-all
                      ${
                       selectedTemplate === template.id
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }
                    `}
         >
          <div className="flex items-start justify-between">
           <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
             <h3 className="font-bold text-gray-900">{template.name}</h3>
             {template.metadata.recommended && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
               ⭐ Recommended
              </span>
             )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
            <div className="flex flex-wrap gap-1">
             {template.metadata.features.slice(0, 3).map((feature, idx) => (
              <span
               key={idx}
               className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
              >
               {feature}
              </span>
             ))}
            </div>
           </div>

           {selectedTemplate === template.id && (
            <div className="ml-3 bg-blue-600 text-white rounded-full p-1.5 flex-shrink-0">
             <Check size={16} />
            </div>
           )}
          </div>
         </motion.button>
        ))}
       </div>
      </div>

      {/* Palette Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
       <h2 className="text-xl font-bold text-gray-900 mb-4">Color Palette</h2>

       <div className="grid grid-cols-2 gap-3">
        {PALETTES.map((palette) => (
         <motion.button
          key={palette.id}
          type="button"
          onClick={() => setSelectedPalette(palette.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
                      relative p-3 border-2 rounded-lg transition-all
                      ${
                       selectedPalette === palette.id
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                      }
                    `}
         >
          {selectedPalette === palette.id && (
           <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
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
           )) || <div className="text-gray-400 text-xs">No colors</div>}
          </div>

          <p className="text-xs font-medium text-gray-900 text-center">
           {palette.name}
          </p>
         </motion.button>
        ))}
       </div>
      </div>

      {/* Save Button */}
      <button
       onClick={handleSave}
       disabled={isSaving}
       className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
      >
       {isSaving ? (
        <>
         <Loader2 size={20} className="animate-spin" />
         Saving...
        </>
       ) : (
        <>
         <Save size={20} />
         Save Changes
        </>
       )}
      </button>
     </div>

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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
         <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
           <div className="w-3 h-3 rounded-full bg-red-500"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
           <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm text-gray-300 ml-2">Live Preview</span>
         </div>

         <div className="bg-gray-50 p-4 overflow-auto max-h-[700px]">
          <div className="transform scale-50 origin-top-left w-[200%]">
           <currentTemplate.component
            data={{
             ...previewData,
             colorScheme: getPaletteColors(selectedPalette),
            }}
           />
          </div>
         </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
         <p className="text-sm text-blue-800">
          <strong>Live Preview:</strong> See how your resume looks with the
          selected template and colors in real-time.
         </p>
        </div>
       </motion.div>
      )}
     </AnimatePresence>
    </div>
   </div>
  </div>
 );
}
