"use client";

/**
 * Experience Step (OPTIONAL)
 * Uncle Bob: "The proper use of comments is to compensate for our failure to express ourself in code"
 */

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

 const onSubmit = (data: ExperiencesForm) => {
  onNext(data.experiences);
 };

 return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
   <div className="mb-4">
    <h3 className="text-lg font-semibold text-gray-900">
     Experiência Profissional
    </h3>
    <p className="text-sm text-gray-600 mt-1">
     Adicione suas experiências mais relevantes. Você pode pular esta etapa e
     adicionar depois.
    </p>
   </div>

   {fields.map((field, index) => {
    const isCurrent = watch(`experiences.${index}.isCurrent`);

    return (
     <div
      key={field.id}
      className="p-6 border border-gray-200 rounded-lg space-y-4 relative"
     >
      {fields.length > 1 && (
       <button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors"
        aria-label="Remover experiência"
       >
        <Trash2 size={20} />
       </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div>
        <label
         htmlFor={`experiences.${index}.company`}
         className="block text-sm font-medium text-gray-700 mb-2"
        >
         Empresa <span className="text-red-500">*</span>
        </label>
        <input
         id={`experiences.${index}.company`}
         type="text"
         {...register(`experiences.${index}.company`)}
         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         placeholder="Nome da Empresa"
        />
        {errors.experiences?.[index]?.company && (
         <p className="mt-1 text-sm text-red-600">
          {errors.experiences[index]?.company?.message}
         </p>
        )}
       </div>

       <div>
        <label
         htmlFor={`experiences.${index}.position`}
         className="block text-sm font-medium text-gray-700 mb-2"
        >
         Cargo <span className="text-red-500">*</span>
        </label>
        <input
         id={`experiences.${index}.position`}
         type="text"
         {...register(`experiences.${index}.position`)}
         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         placeholder="Senior Developer"
        />
        {errors.experiences?.[index]?.position && (
         <p className="mt-1 text-sm text-red-600">
          {errors.experiences[index]?.position?.message}
         </p>
        )}
       </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       <div>
        <label
         htmlFor={`experiences.${index}.startDate`}
         className="block text-sm font-medium text-gray-700 mb-2"
        >
         Data Início <span className="text-red-500">*</span>
        </label>
        <input
         id={`experiences.${index}.startDate`}
         type="date"
         {...register(`experiences.${index}.startDate`)}
         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.experiences?.[index]?.startDate && (
         <p className="mt-1 text-sm text-red-600">
          {errors.experiences[index]?.startDate?.message}
         </p>
        )}
       </div>

       <div>
        <label
         htmlFor={`experiences.${index}.endDate`}
         className="block text-sm font-medium text-gray-700 mb-2"
        >
         Data Fim {isCurrent && "(Atual)"}
        </label>
        <input
         id={`experiences.${index}.endDate`}
         type="date"
         {...register(`experiences.${index}.endDate`)}
         disabled={isCurrent}
         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.experiences?.[index]?.endDate && (
         <p className="mt-1 text-sm text-red-600">
          {errors.experiences[index]?.endDate?.message}
         </p>
        )}
       </div>

       <div className="flex items-center pt-8">
        <label className="flex items-center space-x-2 cursor-pointer">
         <input
          type="checkbox"
          {...register(`experiences.${index}.isCurrent`)}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
         />
         <span className="text-sm text-gray-700">Trabalho atual</span>
        </label>
       </div>
      </div>

      <div>
       <label
        htmlFor={`experiences.${index}.location`}
        className="block text-sm font-medium text-gray-700 mb-2"
       >
        Localização <span className="text-gray-400">(opcional)</span>
       </label>
       <input
        id={`experiences.${index}.location`}
        type="text"
        {...register(`experiences.${index}.location`)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="São Paulo, SP"
       />
      </div>

      <div>
       <label
        htmlFor={`experiences.${index}.description`}
        className="block text-sm font-medium text-gray-700 mb-2"
       >
        Descrição <span className="text-gray-400">(opcional)</span>
       </label>
       <textarea
        id={`experiences.${index}.description`}
        rows={3}
        {...register(`experiences.${index}.description`)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="Suas responsabilidades e conquistas..."
       />
      </div>
     </div>
    );
   })}

   <button
    type="button"
    onClick={() => append(getEmptyExperience())}
    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
   >
    <Plus size={20} />
    Adicionar Outra Experiência
   </button>

   <div className="flex gap-4">
    <button
     type="button"
     onClick={onBack}
     className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
    >
     Voltar
    </button>
    <button
     type="button"
     onClick={onSkip}
     className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
    >
     Pular por Agora
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
