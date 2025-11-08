"use client";

/**
 * Onboarding Wizard
 * Uncle Bob: "Functions should do one thing"
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ONBOARDING_STEPS, canSkipStep } from "@/types/onboarding";
import type {
 PersonalInfo,
 ProfessionalProfile,
 Experience,
 Education,
 TemplateSelection,
 OnboardingData,
} from "@/types/onboarding";

import { PersonalInfoStep } from "./PersonalInfoStep";
import { ProfessionalProfileStep } from "./ProfessionalProfileStep";
import { ExperienceStep } from "./ExperienceStep";
import { EducationStep } from "./EducationStep";
import { TemplateSelectionStep } from "./TemplateSelectionStep";

interface OnboardingState {
 personalInfo?: PersonalInfo;
 professionalProfile?: ProfessionalProfile;
 experiences?: Experience[];
 education?: Education[];
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

 const handleExperienceNext = (data: Experience[]) => {
  setOnboardingData((prev) => ({ ...prev, experiences: data }));
  setCurrentStep((prev) => prev + 1);
 };

 const handleEducationNext = (data: Education[]) => {
  setOnboardingData((prev) => ({ ...prev, education: data }));
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
  setIsSubmitting(true);
  setError(null);

  try {
   const response = await fetch("/api/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalData),
   });

   if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro ao salvar onboarding");
   }

   router.push("/protected/resume");
  } catch (err) {
   setError(err instanceof Error ? err.message : "Erro desconhecido");
   setIsSubmitting(false);
  }
 };

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
   <div className="w-full max-w-3xl">
    <div className="mb-8">
     <div className="flex justify-between mb-2">
      {ONBOARDING_STEPS.map((step, index) => (
       <div
        key={step.id}
        className={`flex-1 h-2 rounded-full mx-1 transition-all ${
         index <= currentStep ? "bg-blue-600" : "bg-gray-200"
        }`}
       />
      ))}
     </div>
     <div className="text-center">
      <p className="text-sm text-gray-600">
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
      className="bg-white rounded-2xl shadow-xl p-8"
     >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
       {currentStepConfig.title}
      </h2>
      <p className="text-gray-600 mb-8">{currentStepConfig.description}</p>

      {error && (
       <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">{error}</p>
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
        <ExperienceStep
         initialData={onboardingData.experiences}
         onNext={handleExperienceNext}
         onBack={handleBack}
         onSkip={handleSkip}
        />
       )}
       {currentStep === 3 && (
        <EducationStep
         initialData={onboardingData.education}
         onNext={handleEducationNext}
         onBack={handleBack}
         onSkip={handleSkip}
        />
       )}
       {currentStep === 4 && (
        <TemplateSelectionStep
         initialData={onboardingData.templateSelection}
         onNext={handleTemplateSelectionNext}
         onBack={handleBack}
        />
       )}
      </div>

      {isSubmitting && (
       <div className="mt-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
       </div>
      )}
     </motion.div>
    </AnimatePresence>
   </div>
  </div>
 );
}
