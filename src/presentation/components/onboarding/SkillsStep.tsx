"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
 skillsStepSchema,
 type SkillsStep,
 type Skill,
} from "@/types/onboarding";
import { Trash2, Plus } from "lucide-react";

interface SkillsStepProps {
 initialData?: Partial<SkillsStep>;
 onNext: (data: SkillsStep) => void;
 onBack: () => void;
}

const SKILL_CATEGORIES = [
 "Linguagens de Programação",
 "Frameworks",
 "Ferramentas",
 "Soft Skills",
 "Banco de Dados",
 "Cloud",
 "DevOps",
 "Design",
 "Marketing",
 "Gestão",
 "Outro",
];

const getEmptySkill = (): Skill => ({
 name: "",
 category: "Linguagens de Programação",
 level: 3,
});

export function SkillsStep({ initialData, onNext, onBack }: SkillsStepProps) {
 const {
  register,
  control,
  handleSubmit,
  watch,
  setValue,
  clearErrors,
  formState: { errors, isSubmitting },
 } = useForm<SkillsStep>({
  resolver: zodResolver(skillsStepSchema),
  defaultValues: {
   skills:
    initialData?.skills && initialData.skills.length > 0
     ? initialData.skills
     : [getEmptySkill()],
   noSkills: initialData?.noSkills || false,
  },
 });

 const { fields, append, remove } = useFieldArray({
  control,
  name: "skills",
 });

 const noSkills = watch("noSkills");

 const handleNoSkillsChange = (checked: boolean) => {
  setValue("noSkills", checked, { shouldValidate: true });

  if (checked) {
   // When "no skills" is checked, clear all skills and errors
   // Remove in reverse order to avoid index shifting issues
   const length = fields.length;
   for (let i = length - 1; i >= 0; i--) {
    remove(i);
   }
   clearErrors("skills");
   clearErrors("noSkills");
  } else if (fields.length === 0) {
   // When unchecked and no skills exist, add an empty one
   append(getEmptySkill());
  }
 };

 const onSubmit = (data: SkillsStep) => {
  console.log("🔵 [SKILLS_STEP] Submitting data:", data);

  // If noSkills is true, ensure skills array is empty
  if (data.noSkills) {
   onNext({ ...data, skills: [] });
  } else {
   onNext(data);
  }
 };

 const inputClass =
  "w-full px-4 py-3 rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed";
 const labelClass = "block text-sm font-medium text-slate-200 mb-2";
 const cardClass =
  "p-6 border border-slate-700/70 bg-slate-900/60 rounded-xl space-y-4 relative shadow-sm";

 return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-slate-100">
   <div className="mb-4">
    <h3 className="text-lg font-semibold text-slate-100">
     Habilidades <span className="text-red-500">*</span>
    </h3>
    <p className="text-sm text-slate-300 mt-1">
     Liste suas principais habilidades técnicas e soft skills.
    </p>
   </div>

   {/* No Skills Option */}
   <div
    className={`border rounded-lg p-4 transition-all ${
     noSkills
      ? "bg-indigo-900/20 border-indigo-600/50 ring-2 ring-indigo-500/30"
      : "bg-slate-800/40 border-slate-700"
    }`}
   >
    <label className="flex items-start gap-3 cursor-pointer">
     <input
      type="checkbox"
      checked={noSkills}
      onChange={(e) => handleNoSkillsChange(e.target.checked)}
      className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-900 text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition"
     />
     <div className="flex-1">
      <span className="text-slate-200 font-medium">
       Ainda estou desenvolvendo minhas habilidades
      </span>
      <p className="text-sm text-slate-400 mt-1">
       Não tem problema! Você pode adicionar habilidades mais tarde no seu
       perfil.
      </p>
      {noSkills && (
       <p className="text-xs text-indigo-400 mt-2 flex items-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
         <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
         />
        </svg>
        Você pode prosseguir sem adicionar habilidades agora
       </p>
      )}
     </div>
    </label>
   </div>

   {!noSkills && (
    <>
     {fields.map((field, index) => (
      <div key={field.id} className={cardClass}>
       {fields.length > 1 && (
        <button
         type="button"
         onClick={() => remove(index)}
         className="absolute top-4 right-4 text-rose-400 hover:text-rose-300 transition-colors"
         aria-label="Remover habilidade"
        >
         <Trash2 size={20} />
        </button>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
         <label htmlFor={`skills.${index}.name`} className={labelClass}>
          Nome da Habilidade <span className="text-red-500">*</span>
         </label>
         <input
          id={`skills.${index}.name`}
          type="text"
          {...register(`skills.${index}.name`)}
          className={inputClass}
          placeholder="JavaScript, Liderança, etc."
         />
         {errors.skills?.[index]?.name && (
          <p className="mt-1 text-sm text-red-400">
           {errors.skills[index]?.name?.message}
          </p>
         )}
        </div>

        <div>
         <label htmlFor={`skills.${index}.category`} className={labelClass}>
          Categoria <span className="text-red-500">*</span>
         </label>
         <select
          id={`skills.${index}.category`}
          {...register(`skills.${index}.category`)}
          className={inputClass}
         >
          {SKILL_CATEGORIES.map((cat) => (
           <option key={cat} value={cat}>
            {cat}
           </option>
          ))}
         </select>
         {errors.skills?.[index]?.category && (
          <p className="mt-1 text-sm text-red-400">
           {errors.skills[index]?.category?.message}
          </p>
         )}
        </div>
       </div>

       <div>
        <label htmlFor={`skills.${index}.level`} className={labelClass}>
         Nível <span className="text-slate-400">(opcional)</span>
        </label>
        <div className="flex items-center gap-4">
         <input
          id={`skills.${index}.level`}
          type="range"
          min="1"
          max="5"
          {...register(`skills.${index}.level`, { valueAsNumber: true })}
          className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
         />
         <span className="text-sm font-medium text-slate-300 w-20">
          {watch(`skills.${index}.level`) || 3} / 5
         </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
         1 = Básico, 5 = Especialista
        </p>
       </div>
      </div>
     ))}

     <button
      type="button"
      onClick={() => append(getEmptySkill())}
      className="w-full px-4 py-3 border-2 border-dashed border-slate-700 text-slate-300 font-medium rounded-lg hover:border-indigo-600 hover:text-indigo-400 hover:bg-indigo-600/5 transition-colors flex items-center justify-center gap-2"
     >
      <Plus size={20} />
      Adicionar Habilidade
     </button>
    </>
   )}

   {errors.noSkills && (
    <p className="text-sm text-red-400">{errors.noSkills.message}</p>
   )}

   <div className="flex gap-4 pt-4">
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
