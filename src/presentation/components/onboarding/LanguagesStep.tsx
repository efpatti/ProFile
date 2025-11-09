"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { languageSchema, type Language } from "@/types/onboarding";
import { Trash2, Plus } from "lucide-react";

const languagesFormSchema = z.object({
 languages: z.array(languageSchema),
});

type LanguagesForm = z.infer<typeof languagesFormSchema>;

interface LanguagesStepProps {
 initialData?: Language[];
 onNext: (data: Language[]) => void;
 onBack: () => void;
 onSkip: () => void;
}

const PROFICIENCY_LEVELS = [
 { value: "básico", label: "Básico" },
 { value: "intermediário", label: "Intermediário" },
 { value: "avançado", label: "Avançado" },
 { value: "fluente", label: "Fluente" },
 { value: "nativo", label: "Nativo" },
] as const;

const getEmptyLanguage = (): Language => ({
 name: "",
 level: "intermediário",
});

export function LanguagesStep({
 initialData = [],
 onNext,
 onBack,
 onSkip,
}: LanguagesStepProps) {
 const {
  register,
  control,
  handleSubmit,
  formState: { errors, isSubmitting },
 } = useForm<LanguagesForm>({
  resolver: zodResolver(languagesFormSchema),
  defaultValues: {
   languages: initialData.length > 0 ? initialData : [getEmptyLanguage()],
  },
 });

 const { fields, append, remove } = useFieldArray({
  control,
  name: "languages",
 });

 const inputClass =
  "w-full px-4 py-3 rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:border-transparent transition";
 const labelClass = "block text-sm font-medium text-slate-200 mb-2";
 const cardClass =
  "p-6 border border-slate-700/70 bg-slate-900/60 rounded-xl space-y-4 relative shadow-sm";

 const onSubmit = (data: LanguagesForm) => {
  onNext(data.languages);
 };

 return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-slate-100">
   <div className="mb-4">
    <h3 className="text-lg font-semibold text-slate-100">
     Idiomas <span className="text-slate-400">(opcional)</span>
    </h3>
    <p className="text-sm text-slate-300 mt-1">
     Liste os idiomas que você domina e seu nível de proficiência.
    </p>
   </div>

   {fields.map((field, index) => (
    <div key={field.id} className={cardClass}>
     {fields.length > 1 && (
      <button
       type="button"
       onClick={() => remove(index)}
       className="absolute top-4 right-4 text-rose-400 hover:text-rose-300 transition-colors"
       aria-label="Remover idioma"
      >
       <Trash2 size={20} />
      </button>
     )}

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
       <label htmlFor={`languages.${index}.name`} className={labelClass}>
        Idioma <span className="text-red-500">*</span>
       </label>
       <input
        id={`languages.${index}.name`}
        type="text"
        {...register(`languages.${index}.name`)}
        className={inputClass}
        placeholder="Português, English, Español..."
       />
       {errors.languages?.[index]?.name && (
        <p className="mt-1 text-sm text-red-400">
         {errors.languages[index]?.name?.message}
        </p>
       )}
      </div>

      <div>
       <label htmlFor={`languages.${index}.level`} className={labelClass}>
        Nível <span className="text-red-500">*</span>
       </label>
       <select
        id={`languages.${index}.level`}
        {...register(`languages.${index}.level`)}
        className={inputClass}
       >
        {PROFICIENCY_LEVELS.map((level) => (
         <option key={level.value} value={level.value}>
          {level.label}
         </option>
        ))}
       </select>
       {errors.languages?.[index]?.level && (
        <p className="mt-1 text-sm text-red-400">
         {errors.languages[index]?.level?.message}
        </p>
       )}
      </div>
     </div>
    </div>
   ))}

   <button
    type="button"
    onClick={() => append(getEmptyLanguage())}
    className="w-full px-4 py-3 border-2 border-dashed border-slate-700 text-slate-300 font-medium rounded-lg hover:border-indigo-600 hover:text-indigo-400 hover:bg-indigo-600/5 transition-colors flex items-center justify-center gap-2"
   >
    <Plus size={20} />
    Adicionar Idioma
   </button>

   <div className="flex gap-4 pt-4">
    <button
     type="button"
     onClick={onBack}
     className="flex-1 px-6 py-3 border border-slate-700 text-slate-200 font-medium rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
    >
     Voltar
    </button>
    <button
     type="button"
     onClick={onSkip}
     className="flex-1 px-6 py-3 border border-slate-700 text-slate-400 font-medium rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
    >
     Pular
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
