"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "@/presentation/stores/resumeStore";
import { FiCheck, FiArrowRight, FiArrowLeft } from "react-icons/fi";

const STEPS = [
 {
  id: "personal",
  title: "Informações Pessoais",
  description: "Vamos começar com o básico",
 },
 {
  id: "professional",
  title: "Perfil Profissional",
  description: "Conte sua história",
 },
 {
  id: "experience",
  title: "Experiência",
  description: "Suas conquistas anteriores",
 },
 { id: "education", title: "Formação", description: "Sua jornada acadêmica" },
 {
  id: "template",
  title: "Escolha seu Estilo",
  description: "Qual design combina com você?",
 },
] as const;

export function OnboardingWizard() {
 const [currentStep, setCurrentStep] = useState(0);
 const router = useRouter();
 const { draft, updateDraft } = useResumeStore();

 const isLastStep = currentStep === STEPS.length - 1;
 const canGoNext = true; // TODO: Validar step atual

 const handleNext = () => {
  if (isLastStep) {
   handleComplete();
  } else {
   setCurrentStep((prev) => prev + 1);
  }
 };

 const handleBack = () => {
  setCurrentStep((prev) => Math.max(0, prev - 1));
 };

 const handleComplete = async () => {
  // TODO: Criar currículo via API
  router.push("/dashboard");
 };

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
   <div className="w-full max-w-3xl">
    {/* Progress Bar */}
    <div className="mb-8">
     <div className="flex justify-between mb-2">
      {STEPS.map((step, index) => (
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
       Passo {currentStep + 1} de {STEPS.length}
      </p>
     </div>
    </div>

    {/* Step Content */}
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
       {STEPS[currentStep].title}
      </h2>
      <p className="text-gray-600 mb-8">{STEPS[currentStep].description}</p>

      {/* Step Forms */}
      <div className="min-h-[300px]">
       {currentStep === 0 && <PersonalInfoStep />}
       {currentStep === 1 && <ProfessionalStep />}
       {currentStep === 2 && <ExperienceStep />}
       {currentStep === 3 && <EducationStep />}
       {currentStep === 4 && <TemplateSelectionStep />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
       <button
        onClick={handleBack}
        disabled={currentStep === 0}
        className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
       >
        <FiArrowLeft />
        Voltar
       </button>

       <button
        onClick={handleNext}
        disabled={!canGoNext}
        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
       >
        {isLastStep ? (
         <>
          <FiCheck />
          Finalizar
         </>
        ) : (
         <>
          Próximo
          <FiArrowRight />
         </>
        )}
       </button>
      </div>
     </motion.div>
    </AnimatePresence>
   </div>
  </div>
 );
}

// Step Components (simplificados - expandir depois)
const PersonalInfoStep = () => <div>Form de informações pessoais...</div>;
const ProfessionalStep = () => <div>Form de perfil profissional...</div>;
const ExperienceStep = () => <div>Form de experiências...</div>;
const EducationStep = () => <div>Form de formação...</div>;
const TemplateSelectionStep = () => <div>Seletor de templates...</div>;
