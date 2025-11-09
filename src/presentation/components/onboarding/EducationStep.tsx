"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { educationSchema, type Education } from "@/types/onboarding";
import { Trash2, Plus } from "lucide-react";

const educationFormSchema = z.object({
 education: z.array(educationSchema),
});

type EducationForm = z.infer<typeof educationFormSchema>;

interface EducationStepProps {
 initialData?: Education[];
 onNext: (data: Education[]) => void;
 onBack: () => void;
 onSkip: () => void;
}

export function EducationStep({
 initialData = [],
 onNext,
 onBack,
 onSkip,
}: EducationStepProps) {
 const {
  register,
  control,
  handleSubmit,
  watch,
  formState: { errors, isSubmitting },
 } = useForm<EducationForm>({
  resolver: zodResolver(educationFormSchema),
  defaultValues: {
   education: initialData.length > 0 ? initialData : [getEmptyEducation()],
  },
 });

 const { fields, append, remove } = useFieldArray({
  control,
  name: "education",
 });

 const inputClass =
  "w-full px-4 py-3 rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:border-transparent transition";
 const selectClass =
  "w-full px-4 py-3 rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:border-transparent transition";
 const labelClass = "block text-sm font-medium text-slate-200 mb-2";
 const checkboxClass =
  "h-5 w-5 rounded border-slate-600 bg-slate-900 text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition";
 const cardClass =
  "p-6 border border-slate-700/70 bg-slate-900/60 rounded-xl space-y-4 relative shadow-sm";
 const neutralButtonClass =
  "flex-1 px-6 py-3 border border-slate-700 text-slate-200 font-medium rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

 const onSubmit = (data: EducationForm) => {
  onNext(data.education);
 };

 return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-slate-100">
   <div className="mb-4">
    <h3 className="text-lg font-semibold text-slate-100">Formação Acadêmica</h3>
    <p className="text-sm text-slate-300 mt-1">
     Adicione sua formação acadêmica. Você pode pular esta etapa e adicionar
     depois.
    </p>
   </div>

   {fields.map((field, index) => {
    const isCurrent = watch(`education.${index}.isCurrent`);

    return (
     <div key={field.id} className={cardClass}>
      {fields.length > 1 && (
       <button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-4 right-4 text-rose-400 hover:text-rose-300 transition-colors"
        aria-label="Remover formação"
       >
        <Trash2 size={20} />
       </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div>
        <label
         htmlFor={`education.${index}.institution`}
         className={labelClass}
        >
         Instituição <span className="text-red-500">*</span>
        </label>
        <input
         id={`education.${index}.institution`}
         type="text"
         {...register(`education.${index}.institution`)}
         className={inputClass}
         placeholder="Universidade de São Paulo"
        />
        {errors.education?.[index]?.institution && (
         <p className="mt-1 text-sm text-red-400">
          {errors.education[index]?.institution?.message}
         </p>
        )}
       </div>

       <div>
        <label htmlFor={`education.${index}.degree`} className={labelClass}>
         Grau <span className="text-red-500">*</span>
        </label>
        <select
         id={`education.${index}.degree`}
         {...register(`education.${index}.degree`)}
         className={selectClass}
        >
         <option value="">Selecione...</option>
         <option value="Bacharelado">Bacharelado</option>
         <option value="Licenciatura">Licenciatura</option>
         <option value="Tecnólogo">Tecnólogo</option>
         <option value="Mestrado">Mestrado</option>
         <option value="Doutorado">Doutorado</option>
         <option value="Pós-Doutorado">Pós-Doutorado</option>
         <option value="MBA">MBA</option>
         <option value="Especialização">Especialização</option>
        </select>
        {errors.education?.[index]?.degree && (
         <p className="mt-1 text-sm text-red-400">
          {errors.education[index]?.degree?.message}
         </p>
        )}
       </div>
      </div>

      <div>
       <label htmlFor={`education.${index}.field`} className={labelClass}>
        Área de Estudo <span className="text-red-500">*</span>
       </label>
       <input
        id={`education.${index}.field`}
        type="text"
        {...register(`education.${index}.field`)}
        className={inputClass}
        placeholder="Ciência da Computação"
       />
       {errors.education?.[index]?.field && (
        <p className="mt-1 text-sm text-red-400">
         {errors.education[index]?.field?.message}
        </p>
       )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       <div>
        <label htmlFor={`education.${index}.startDate`} className={labelClass}>
         Data Início <span className="text-red-500">*</span>
        </label>
        <input
         id={`education.${index}.startDate`}
         type="date"
         {...register(`education.${index}.startDate`)}
         className={inputClass}
        />
        {errors.education?.[index]?.startDate && (
         <p className="mt-1 text-sm text-red-400">
          {errors.education[index]?.startDate?.message}
         </p>
        )}
       </div>

       <div>
        <label htmlFor={`education.${index}.endDate`} className={labelClass}>
         Data Conclusão {isCurrent && "(Em andamento)"}
        </label>
        <input
         id={`education.${index}.endDate`}
         type="date"
         {...register(`education.${index}.endDate`)}
         disabled={isCurrent}
         className={`${inputClass} disabled:bg-slate-800/60 disabled:text-slate-500 disabled:border-slate-700/60 disabled:cursor-not-allowed`}
        />
        {errors.education?.[index]?.endDate && (
         <p className="mt-1 text-sm text-red-400">
          {errors.education[index]?.endDate?.message}
         </p>
        )}
       </div>

       <div className="flex items-center pt-8">
        <label className="flex items-center space-x-2 cursor-pointer">
         <input
          type="checkbox"
          {...register(`education.${index}.isCurrent`)}
          className={checkboxClass}
         />
         <span className="text-sm text-slate-300">Em andamento</span>
        </label>
       </div>
      </div>
     </div>
    );
   })}

   <button
    type="button"
    onClick={() => append(getEmptyEducation())}
    className="w-full px-4 py-3 border-2 border-dashed border-slate-600 text-slate-300 font-medium rounded-lg hover:border-indigo-500 hover:text-indigo-300 transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
   >
    <Plus size={20} />
    Adicionar Outra Formação
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

function getEmptyEducation(): Education {
 return {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
 };
}
