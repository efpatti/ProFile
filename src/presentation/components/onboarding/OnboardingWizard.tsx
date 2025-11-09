"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ONBOARDING_STEPS, canSkipStep } from "@/types/onboarding";
import type {
 PersonalInfo,
 ProfessionalProfile,
 SkillsStep,
 ExperiencesStep,
 EducationStep as EducationStepType,
 Language,
 Project,
 Certification,
 Award,
 Interest,
 TemplateSelection,
 OnboardingData,
} from "@/types/onboarding";

import { PersonalInfoStep } from "./PersonalInfoStep";
import { ProfessionalProfileStep } from "./ProfessionalProfileStep";
import { SkillsStep as SkillsStepComponent } from "./SkillsStep";
import { ExperienceStep } from "./ExperienceStep";
import { EducationStep } from "./EducationStep";
import { LanguagesStep } from "./LanguagesStep";
import { TemplateSelectionStep } from "./TemplateSelectionStep";

interface OnboardingState {
 personalInfo?: PersonalInfo;
 professionalProfile?: ProfessionalProfile;
 skillsStep?: SkillsStep;
 experiencesStep?: ExperiencesStep;
 educationStep?: EducationStepType;
 languages?: Language[];
 projects?: Project[];
 certifications?: Certification[];
 awards?: Award[];
 interests?: Interest[];
 templateSelection?: TemplateSelection;
}

export function OnboardingWizard() {
 const [currentStep, setCurrentStep] = useState(0);
 const [onboardingData, setOnboardingData] = useState<OnboardingState>({});
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const router = useRouter();

 const currentStepConfig = ONBOARDING_STEPS[currentStep];

 const handlePersonalInfoNext = (data: PersonalInfo) => {
  setOnboardingData((prev) => ({ ...prev, personalInfo: data }));
  setCurrentStep((prev) => prev + 1);
 };

 const handleProfessionalProfileNext = (data: ProfessionalProfile) => {
  setOnboardingData((prev) => ({ ...prev, professionalProfile: data }));
  setCurrentStep((prev) => prev + 1);
 };

 const handleSkillsNext = (data: SkillsStep) => {
  setOnboardingData((prev) => ({ ...prev, skillsStep: data }));
  setCurrentStep((prev) => prev + 1);
 };

 const handleExperienceNext = (data: ExperiencesStep) => {
  setOnboardingData((prev) => ({ ...prev, experiencesStep: data }));
  setCurrentStep((prev) => prev + 1);
 };

 const handleEducationNext = (data: EducationStepType) => {
  setOnboardingData((prev) => ({ ...prev, educationStep: data }));
  setCurrentStep((prev) => prev + 1);
 };

 const handleLanguagesNext = (data: Language[]) => {
  setOnboardingData((prev) => ({ ...prev, languages: data }));
  setCurrentStep((prev) => prev + 1);
 };

 const handleTemplateSelectionNext = async (data: TemplateSelection) => {
  setOnboardingData((prev) => ({ ...prev, templateSelection: data }));
  await handleComplete({ ...onboardingData, templateSelection: data });
 };

 const handleBack = () => {
  setCurrentStep((prev) => Math.max(0, prev - 1));
 };

 const handleSkip = () => {
  if (canSkipStep(currentStepConfig.id)) {
   setCurrentStep((prev) => prev + 1);
  }
 };

 const handleComplete = async (finalData: Partial<OnboardingData>) => {
  console.log("🟢 [ONBOARDING] Starting submission...");
  console.log("🟢 [ONBOARDING] Data to submit:", {
   personalInfo: finalData.personalInfo,
   professionalProfile: finalData.professionalProfile,
   skillsStep: finalData.skillsStep,
   experiencesCount: finalData.experiencesStep?.experiences?.length || 0,
   educationCount: finalData.educationStep?.education?.length || 0,
   languagesCount: finalData.languages?.length || 0,
   template: finalData.templateSelection?.template,
   palette: finalData.templateSelection?.palette,
  });

  setIsSubmitting(true);
  setError(null);

  try {
   const response = await fetch("/api/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalData),
   });

   console.log("🟢 [ONBOARDING] Response status:", response.status);
   console.log(
    "🟢 [ONBOARDING] Response headers:",
    Object.fromEntries(response.headers.entries())
   );

   if (!response.ok) {
    // Robust error parsing: handle non-JSON bodies like "Method Not Allowed"
    const contentType = response.headers.get("content-type") || "";
    let message = `Erro ao salvar onboarding (HTTP ${response.status})`;
    try {
     if (contentType.includes("application/json")) {
      const json = await response.json();
      console.error("🔴 [ONBOARDING] Error JSON:", json);
      message = json?.error || message;
     } else {
      const text = await response.text();
      console.error("🔴 [ONBOARDING] Error text:", text);
      message = text || message;
     }
    } catch (parseErr) {
     console.error("🔴 [ONBOARDING] Parse error:", parseErr);
     // ignore parse errors and use default message
    }
    throw new Error(message);
   }

   const data = await response.json();
   console.log("🟢 [ONBOARDING] Success response:", data);
   console.log("🟢 [ONBOARDING] Redirecting to /protected/resume...");

   router.push("/protected/resume");
  } catch (err) {
   console.error("🔴 [ONBOARDING] Catch error:", err);
   setError(err instanceof Error ? err.message : "Erro desconhecido");
   setIsSubmitting(false);
  }
 };

 return (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-4">
   <motion.div
    aria-hidden
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.6 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="pointer-events-none absolute inset-0"
   >
    <motion.div
     className="absolute -inset-40 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.28),transparent_60%),_radial-gradient(circle_at_bottom,_rgba(236,72,153,0.2),transparent_55%)] blur-3xl"
     animate={{
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
     }}
     transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
   </motion.div>

   <div className="relative w-full max-w-4xl">
    <div className="mb-8">
     <div className="flex justify-between mb-2">
      {ONBOARDING_STEPS.map((step, index) => (
       <div
        key={step.id}
        className={`flex-1 h-2 rounded-full mx-1 transition-all ${
         index <= currentStep
          ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
          : "bg-slate-700"
        }`}
       />
      ))}
     </div>
     <div className="text-center">
      <p className="text-sm text-slate-300">
       Passo {currentStep + 1} de {ONBOARDING_STEPS.length}
      </p>
     </div>
    </div>

    <AnimatePresence mode="wait">
     <motion.div
      key={currentStep}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl shadow-2xl p-8 bg-slate-900/70 backdrop-blur border border-slate-700"
     >
      <h2 className="text-3xl font-bold text-slate-100 mb-2">
       {currentStepConfig.title}
      </h2>
      <p className="text-slate-300 mb-8">{currentStepConfig.description}</p>

      {error && (
       <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
        <p className="text-red-300 text-sm">{error}</p>
       </div>
      )}

      <div className="min-h-[300px]">
       {currentStep === 0 && (
        <PersonalInfoStep
         initialData={onboardingData.personalInfo}
         onNext={handlePersonalInfoNext}
        />
       )}
       {currentStep === 1 && (
        <ProfessionalProfileStep
         initialData={onboardingData.professionalProfile}
         onNext={handleProfessionalProfileNext}
         onBack={handleBack}
        />
       )}
       {currentStep === 2 && (
        <SkillsStepComponent
         initialData={onboardingData.skillsStep}
         onNext={handleSkillsNext}
         onBack={handleBack}
        />
       )}
       {currentStep === 3 && (
        <ExperienceStep
         initialData={onboardingData.experiencesStep}
         onNext={handleExperienceNext}
         onBack={handleBack}
         onSkip={handleSkip}
        />
       )}
       {currentStep === 4 && (
        <EducationStep
         initialData={onboardingData.educationStep}
         onNext={handleEducationNext}
         onBack={handleBack}
         onSkip={handleSkip}
        />
       )}
       {currentStep === 5 && (
        <LanguagesStep
         initialData={onboardingData.languages}
         onNext={handleLanguagesNext}
         onBack={handleBack}
         onSkip={handleSkip}
        />
       )}
       {currentStep === 6 && (
        <TemplateSelectionStep
         initialData={onboardingData.templateSelection}
         onNext={handleTemplateSelectionNext}
         onBack={handleBack}
        />
       )}
      </div>

      <AnimatePresence>
       {isSubmitting && (
        <motion.div
         key="submitting-overlay"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.2 }}
         className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-950/75 backdrop-blur-sm"
        >
         <motion.div
          className="h-16 w-16 rounded-full border-2 border-slate-700 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
         />
         <div className="w-full max-w-xs">
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
           <motion.div
            className="h-full bg-gradient-to-r from-indigo-400 via-sky-400 to-fuchsia-500"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
           />
          </div>
          <p className="mt-3 text-center text-sm text-slate-300">
           Salvando seu onboarding...
          </p>
         </div>
        </motion.div>
       )}
      </AnimatePresence>
     </motion.div>
    </AnimatePresence>
   </div>
  </div>
 );
}
