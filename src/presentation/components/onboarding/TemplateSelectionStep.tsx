"use client";

/**
 * Template Selection Step
 * Uncle Bob: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
 templateSelectionSchema,
 type TemplateSelection,
} from "@/types/onboarding";
import { Check } from "lucide-react";
import { useState } from "react";

interface TemplateSelectionStepProps {
 initialData?: Partial<TemplateSelection>;
 onNext: (data: TemplateSelection) => void;
 onBack: () => void;
}

const TEMPLATES = [
 {
  id: "professional",
  name: "Profissional",
  description: "Limpo e tradicional para ambientes corporativos",
  preview: "/templates/professional.png",
 },
 {
  id: "modern",
  name: "Moderno",
  description: "Design contemporâneo com toques criativos",
  preview: "/templates/modern.png",
 },
 {
  id: "creative",
  name: "Criativo",
  description: "Ousado para áreas criativas e inovadoras",
  preview: "/templates/creative.png",
 },
 {
  id: "minimal",
  name: "Minimalista",
  description: "Simplicidade e elegância em primeiro lugar",
  preview: "/templates/minimal.png",
 },
] as const;

const PALETTES = [
 { id: "ocean", name: "Oceano", colors: ["#0891B2", "#06B6D4", "#22D3EE"] },
 { id: "forest", name: "Floresta", colors: ["#059669", "#10B981", "#34D399"] },
 {
  id: "sunset",
  name: "Pôr do Sol",
  colors: ["#DC2626", "#F59E0B", "#FBBF24"],
 },
 { id: "lavender", name: "Lavanda", colors: ["#7C3AED", "#A78BFA", "#C4B5FD"] },
 { id: "slate", name: "Ardósia", colors: ["#475569", "#64748B", "#94A3B8"] },
 {
  id: "emerald",
  name: "Esmeralda",
  colors: ["#047857", "#059669", "#10B981"],
 },
];

export function TemplateSelectionStep({
 initialData,
 onNext,
 onBack,
}: TemplateSelectionStepProps) {
 const [selectedTemplate, setSelectedTemplate] = useState(
  initialData?.template || ""
 );
 const [selectedPalette, setSelectedPalette] = useState(
  initialData?.palette || ""
 );

 const {
  handleSubmit,
  setValue,
  formState: { errors, isSubmitting },
 } = useForm<TemplateSelection>({
  resolver: zodResolver(templateSelectionSchema),
  defaultValues: initialData,
 });

 const handleTemplateSelect = (templateId: string) => {
  setSelectedTemplate(templateId);
  setValue("template", templateId as TemplateSelection["template"], {
   shouldValidate: true,
  });
 };

 const handlePaletteSelect = (paletteId: string) => {
  setSelectedPalette(paletteId);
  setValue("palette", paletteId, { shouldValidate: true });
 };

 return (
  <form onSubmit={handleSubmit(onNext)} className="space-y-8">
   {/* Template Selection */}
   <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
     Escolha um Template <span className="text-red-500">*</span>
    </h3>
    <p className="text-sm text-gray-600 mb-6">
     Selecione o estilo que melhor representa você
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     {TEMPLATES.map((template) => (
      <button
       key={template.id}
       type="button"
       onClick={() => handleTemplateSelect(template.id)}
       className={`
                relative p-4 border-2 rounded-lg text-left transition-all
                ${
                 selectedTemplate === template.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
                }
              `}
      >
       {selectedTemplate === template.id && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-1">
         <Check size={16} />
        </div>
       )}

       <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">
        {/* Preview placeholder - you can add actual template previews later */}
        <span className="text-sm">Preview</span>
       </div>

       <h4 className="font-semibold text-gray-900">{template.name}</h4>
       <p className="text-sm text-gray-600 mt-1">{template.description}</p>
      </button>
     ))}
    </div>

    {errors.template && (
     <p className="mt-2 text-sm text-red-600">{errors.template.message}</p>
    )}
   </div>

   {/* Palette Selection */}
   <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
     Escolha uma Paleta de Cores <span className="text-red-500">*</span>
    </h3>
    <p className="text-sm text-gray-600 mb-6">
     Cores que vão dar vida ao seu currículo
    </p>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
     {PALETTES.map((palette) => (
      <button
       key={palette.id}
       type="button"
       onClick={() => handlePaletteSelect(palette.id)}
       className={`
                relative p-4 border-2 rounded-lg transition-all
                ${
                 selectedPalette === palette.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
                }
              `}
      >
       {selectedPalette === palette.id && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
         <Check size={14} />
        </div>
       )}

       <div className="flex gap-2 mb-3">
        {palette.colors.map((color, index) => (
         <div
          key={index}
          className="flex-1 h-12 rounded"
          style={{ backgroundColor: color }}
         />
        ))}
       </div>

       <p className="text-sm font-medium text-gray-900 text-center">
        {palette.name}
       </p>
      </button>
     ))}
    </div>

    {errors.palette && (
     <p className="mt-2 text-sm text-red-600">{errors.palette.message}</p>
    )}
   </div>

   <div className="flex gap-4">
    <button
     type="button"
     onClick={onBack}
     className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
    >
     Voltar
    </button>
    <button
     type="submit"
     disabled={isSubmitting}
     className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
     {isSubmitting ? "Finalizando..." : "Concluir Onboarding"}
    </button>
   </div>
  </form>
 );
}
