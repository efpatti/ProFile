"use client";

/**
 * Professional Profile Step
 * Uncle Bob: "Clean code is simple and direct"
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
 professionalProfileSchema,
 type ProfessionalProfile,
} from "@/types/onboarding";

interface ProfessionalProfileStepProps {
 initialData?: Partial<ProfessionalProfile>;
 onNext: (data: ProfessionalProfile) => void;
 onBack: () => void;
}

export function ProfessionalProfileStep({
 initialData,
 onNext,
 onBack,
}: ProfessionalProfileStepProps) {
 const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
 } = useForm<ProfessionalProfile>({
  resolver: zodResolver(professionalProfileSchema),
  defaultValues: initialData,
 });

 return (
  <form onSubmit={handleSubmit(onNext)} className="space-y-6">
   <div>
    <label
     htmlFor="jobTitle"
     className="block text-sm font-medium text-gray-700 mb-2"
    >
     Cargo Atual <span className="text-red-500">*</span>
    </label>
    <input
     id="jobTitle"
     type="text"
     {...register("jobTitle")}
     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     placeholder="Senior Full Stack Developer"
    />
    {errors.jobTitle && (
     <p className="mt-1 text-sm text-red-600">{errors.jobTitle.message}</p>
    )}
   </div>

   <div>
    <label
     htmlFor="summary"
     className="block text-sm font-medium text-gray-700 mb-2"
    >
     Resumo Profissional <span className="text-red-500">*</span>
    </label>
    <textarea
     id="summary"
     rows={5}
     {...register("summary")}
     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
     placeholder="Conte sua história profissional, habilidades principais e o que você busca..."
    />
    {errors.summary && (
     <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
    )}
    <p className="mt-1 text-sm text-gray-500">
     Mínimo 50 caracteres. Seja específico sobre suas conquistas.
    </p>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
     <label
      htmlFor="linkedin"
      className="block text-sm font-medium text-gray-700 mb-2"
     >
      LinkedIn <span className="text-gray-400">(opcional)</span>
     </label>
     <input
      id="linkedin"
      type="url"
      {...register("linkedin")}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="https://linkedin.com/in/seu-perfil"
     />
     {errors.linkedin && (
      <p className="mt-1 text-sm text-red-600">{errors.linkedin.message}</p>
     )}
    </div>

    <div>
     <label
      htmlFor="github"
      className="block text-sm font-medium text-gray-700 mb-2"
     >
      GitHub <span className="text-gray-400">(opcional)</span>
     </label>
     <input
      id="github"
      type="url"
      {...register("github")}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="https://github.com/seu-usuario"
     />
     {errors.github && (
      <p className="mt-1 text-sm text-red-600">{errors.github.message}</p>
     )}
    </div>
   </div>

   <div>
    <label
     htmlFor="website"
     className="block text-sm font-medium text-gray-700 mb-2"
    >
     Website / Portfolio <span className="text-gray-400">(opcional)</span>
    </label>
    <input
     id="website"
     type="url"
     {...register("website")}
     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     placeholder="https://seuportfolio.com"
    />
    {errors.website && (
     <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
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
     {isSubmitting ? "Salvando..." : "Próximo"}
    </button>
   </div>
  </form>
 );
}
