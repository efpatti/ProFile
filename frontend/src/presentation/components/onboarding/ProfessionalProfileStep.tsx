"use client";

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

 const inputClass =
  "w-full px-4 py-3 rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:border-transparent transition";
 const textAreaClass =
  "w-full px-4 py-3 rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:border-transparent transition resize-none";
 const labelClass = "block text-sm font-medium text-slate-200 mb-2";

 return (
  <form onSubmit={handleSubmit(onNext)} className="space-y-6 text-slate-100">
   <div>
    <label htmlFor="jobTitle" className={labelClass}>
     Cargo Atual <span className="text-red-500">*</span>
    </label>
    <input
     id="jobTitle"
     type="text"
     {...register("jobTitle")}
     className={inputClass}
     placeholder="Senior Full Stack Developer"
    />
    {errors.jobTitle && (
     <p className="mt-1 text-sm text-red-400">{errors.jobTitle.message}</p>
    )}
   </div>

   <div>
    <label htmlFor="summary" className={labelClass}>
     Resumo Profissional <span className="text-red-500">*</span>
    </label>
    <textarea
     id="summary"
     rows={5}
     {...register("summary")}
     className={textAreaClass}
     placeholder="Conte sua história profissional, habilidades principais e o que você busca..."
    />
    {errors.summary && (
     <p className="mt-1 text-sm text-red-400">{errors.summary.message}</p>
    )}
    <p className="mt-1 text-sm text-slate-400">
     Mínimo 50 caracteres. Seja específico sobre suas conquistas.
    </p>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
     <label htmlFor="linkedin" className={labelClass}>
      LinkedIn <span className="text-slate-400">(opcional)</span>
     </label>
     <input
      id="linkedin"
      type="url"
      {...register("linkedin")}
      className={inputClass}
      placeholder="https://linkedin.com/in/seu-perfil"
     />
     {errors.linkedin && (
      <p className="mt-1 text-sm text-red-400">{errors.linkedin.message}</p>
     )}
    </div>

    <div>
     <label htmlFor="github" className={labelClass}>
      GitHub <span className="text-slate-400">(opcional)</span>
     </label>
     <input
      id="github"
      type="url"
      {...register("github")}
      className={inputClass}
      placeholder="https://github.com/seu-usuario"
     />
     {errors.github && (
      <p className="mt-1 text-sm text-red-400">{errors.github.message}</p>
     )}
    </div>
   </div>

   <div>
    <label htmlFor="website" className={labelClass}>
     Website / Portfolio <span className="text-slate-400">(opcional)</span>
    </label>
    <input
     id="website"
     type="url"
     {...register("website")}
     className={inputClass}
     placeholder="https://seuportfolio.com"
    />
    {errors.website && (
     <p className="mt-1 text-sm text-red-400">{errors.website.message}</p>
    )}
   </div>

   <div className="flex gap-4">
    <button
     type="button"
     onClick={onBack}
     className="flex-1 px-6 py-3 border border-slate-700 text-slate-200 font-medium rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
    >
     Voltar
    </button>
    <button
     type="submit"
     disabled={isSubmitting}
     className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
    >
     {isSubmitting ? "Salvando..." : "Próximo"}
    </button>
   </div>
  </form>
 );
}
