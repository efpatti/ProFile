"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { experienceSchema, type Experience } from "@/types/onboarding";
import { Trash2, Plus } from "lucide-react";

const experiencesFormSchema = z.object({
 experiences: z.array(experienceSchema),
});

type ExperiencesForm = z.infer<typeof experiencesFormSchema>;

interface ExperienceStepProps {
 initialData?: Experience[];
 onNext: (data: Experience[]) => void;
 onBack: () => void;
 onSkip: () => void;
}

export function ExperienceStep({
 initialData = [],
 onNext,
 onBack,
 onSkip,
}: ExperienceStepProps) {
 const {
  register,
  control,
  handleSubmit,
  watch,
  formState: { errors, isSubmitting },
 } = useForm<ExperiencesForm>({
  resolver: zodResolver(experiencesFormSchema),
  defaultValues: {
   experiences: initialData.length > 0 ? initialData : [getEmptyExperience()],
  },
 });

 const { fields, append, remove } = useFieldArray({
  control,
  name: "experiences",
 });

 const inputClass =
  "w-full px-4 py-3 rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:border-transparent transition";
 const textAreaClass =
  "w-full px-4 py-3 rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:border-transparent transition resize-none";
 const checkboxClass =
  "h-5 w-5 rounded border-slate-600 bg-slate-900 text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition";
 const labelClass = "block text-sm font-medium text-slate-200 mb-2";
 const cardClass =
  "p-6 border border-slate-700/70 bg-slate-900/60 rounded-xl space-y-4 relative shadow-sm";
 const neutralButtonClass =
  "flex-1 px-6 py-3 border border-slate-700 text-slate-200 font-medium rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

 const onSubmit = (data: ExperiencesForm) => {
  onNext(data.experiences);
 };

 return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-slate-100">
   <div className="mb-4">
    <h3 className="text-lg font-semibold text-slate-100">
     Experiência Profissional
    </h3>
    <p className="text-sm text-slate-300 mt-1">
     Adicione suas experiências mais relevantes. Você pode pular esta etapa e
     adicionar depois.
    </p>
   </div>

   {fields.map((field, index) => {
    const isCurrent = watch(`experiences.${index}.isCurrent`);

    return (
     <div key={field.id} className={cardClass}>
      {fields.length > 1 && (
       <button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-4 right-4 text-rose-400 hover:text-rose-300 transition-colors"
        aria-label="Remover experiência"
       >
        <Trash2 size={20} />
       </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div>
        <label htmlFor={`experiences.${index}.company`} className={labelClass}>
         Empresa <span className="text-red-500">*</span>
        </label>
        <input
         id={`experiences.${index}.company`}
         type="text"
         {...register(`experiences.${index}.company`)}
         className={inputClass}
         placeholder="Nome da Empresa"
        />
        {errors.experiences?.[index]?.company && (
         <p className="mt-1 text-sm text-red-400">
          {errors.experiences[index]?.company?.message}
         </p>
        )}
       </div>

       <div>
        <label htmlFor={`experiences.${index}.position`} className={labelClass}>
         Cargo <span className="text-red-500">*</span>
        </label>
        <input
         id={`experiences.${index}.position`}
         type="text"
         {...register(`experiences.${index}.position`)}
         className={inputClass}
         placeholder="Senior Developer"
        />
        {errors.experiences?.[index]?.position && (
         <p className="mt-1 text-sm text-red-400">
          {errors.experiences[index]?.position?.message}
         </p>
        )}
       </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       <div>
        <label
         htmlFor={`experiences.${index}.startDate`}
         className={labelClass}
        >
         Data Início <span className="text-red-500">*</span>
        </label>
        <input
         id={`experiences.${index}.startDate`}
         type="date"
         {...register(`experiences.${index}.startDate`)}
         className={inputClass}
        />
        {errors.experiences?.[index]?.startDate && (
         <p className="mt-1 text-sm text-red-400">
          {errors.experiences[index]?.startDate?.message}
         </p>
        )}
       </div>

       <div>
        <label htmlFor={`experiences.${index}.endDate`} className={labelClass}>
         Data Fim {isCurrent && "(Atual)"}
        </label>
        <input
         id={`experiences.${index}.endDate`}
         type="date"
         {...register(`experiences.${index}.endDate`)}
         disabled={isCurrent}
         className={`${inputClass} disabled:bg-slate-800/60 disabled:text-slate-500 disabled:cursor-not-allowed`}
        />
        {errors.experiences?.[index]?.endDate && (
         <p className="mt-1 text-sm text-red-400">
          {errors.experiences[index]?.endDate?.message}
         </p>
        )}
       </div>

       <div className="flex items-center pt-8">
        <label className="flex items-center space-x-2 cursor-pointer text-slate-200">
         <input
          type="checkbox"
          {...register(`experiences.${index}.isCurrent`)}
          className={checkboxClass}
         />
         <span className="text-sm">Trabalho atual</span>
        </label>
       </div>
      </div>

      <div>
       <label htmlFor={`experiences.${index}.location`} className={labelClass}>
        Localização <span className="text-slate-400">(opcional)</span>
       </label>
       <input
        id={`experiences.${index}.location`}
        type="text"
        {...register(`experiences.${index}.location`)}
        className={inputClass}
        placeholder="São Paulo, SP"
       />
      </div>

      <div>
       <label
        htmlFor={`experiences.${index}.description`}
        className={labelClass}
       >
        Descrição <span className="text-slate-400">(opcional)</span>
       </label>
       <textarea
        id={`experiences.${index}.description`}
        rows={3}
        {...register(`experiences.${index}.description`)}
        className={textAreaClass}
        placeholder="Suas responsabilidades e conquistas..."
       />
      </div>
     </div>
    );
   })}

   <button
    type="button"
    onClick={() => append(getEmptyExperience())}
    className="w-full px-4 py-3 border-2 border-dashed border-slate-600 text-slate-300 font-medium rounded-lg hover:border-indigo-500 hover:text-indigo-300 transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
   >
    <Plus size={20} />
    Adicionar Outra Experiência
   </button>

   <div className="flex gap-4">
    <button type="button" onClick={onBack} className={neutralButtonClass}>
     Voltar
    </button>
    <button type="button" onClick={onSkip} className={neutralButtonClass}>
     Pular por Agora
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

function getEmptyExperience(): Experience {
 return {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  location: "",
 };
}
