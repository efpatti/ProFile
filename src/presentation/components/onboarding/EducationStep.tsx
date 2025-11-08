"use client";

/**
 * Education Step (OPTIONAL)
 * Uncle Bob: "Code should be written to minimize the time it would take for someone else to understand it"
 */

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

 const onSubmit = (data: EducationForm) => {
  onNext(data.education);
 };

 return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
   <div className="mb-4">
    <h3 className="text-lg font-semibold text-gray-900">Formação Acadêmica</h3>
    <p className="text-sm text-gray-600 mt-1">
     Adicione sua formação acadêmica. Você pode pular esta etapa e adicionar
     depois.
    </p>
   </div>

   {fields.map((field, index) => {
    const isCurrent = watch(`education.${index}.isCurrent`);

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
        aria-label="Remover formação"
       >
        <Trash2 size={20} />
       </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div>
        <label
         htmlFor={`education.${index}.institution`}
         className="block text-sm font-medium text-gray-700 mb-2"
        >
         Instituição <span className="text-red-500">*</span>
        </label>
        <input
         id={`education.${index}.institution`}
         type="text"
         {...register(`education.${index}.institution`)}
         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         placeholder="Universidade de São Paulo"
        />
        {errors.education?.[index]?.institution && (
         <p className="mt-1 text-sm text-red-600">
          {errors.education[index]?.institution?.message}
         </p>
        )}
       </div>

       <div>
        <label
         htmlFor={`education.${index}.degree`}
         className="block text-sm font-medium text-gray-700 mb-2"
        >
         Grau <span className="text-red-500">*</span>
        </label>
        <select
         id={`education.${index}.degree`}
         {...register(`education.${index}.degree`)}
         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
         <p className="mt-1 text-sm text-red-600">
          {errors.education[index]?.degree?.message}
         </p>
        )}
       </div>
      </div>

      <div>
       <label
        htmlFor={`education.${index}.field`}
        className="block text-sm font-medium text-gray-700 mb-2"
       >
        Área de Estudo <span className="text-red-500">*</span>
       </label>
       <input
        id={`education.${index}.field`}
        type="text"
        {...register(`education.${index}.field`)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Ciência da Computação"
       />
       {errors.education?.[index]?.field && (
        <p className="mt-1 text-sm text-red-600">
         {errors.education[index]?.field?.message}
        </p>
       )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       <div>
        <label
         htmlFor={`education.${index}.startDate`}
         className="block text-sm font-medium text-gray-700 mb-2"
        >
         Data Início <span className="text-red-500">*</span>
        </label>
        <input
         id={`education.${index}.startDate`}
         type="date"
         {...register(`education.${index}.startDate`)}
         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.education?.[index]?.startDate && (
         <p className="mt-1 text-sm text-red-600">
          {errors.education[index]?.startDate?.message}
         </p>
        )}
       </div>

       <div>
        <label
         htmlFor={`education.${index}.endDate`}
         className="block text-sm font-medium text-gray-700 mb-2"
        >
         Data Conclusão {isCurrent && "(Em andamento)"}
        </label>
        <input
         id={`education.${index}.endDate`}
         type="date"
         {...register(`education.${index}.endDate`)}
         disabled={isCurrent}
         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.education?.[index]?.endDate && (
         <p className="mt-1 text-sm text-red-600">
          {errors.education[index]?.endDate?.message}
         </p>
        )}
       </div>

       <div className="flex items-center pt-8">
        <label className="flex items-center space-x-2 cursor-pointer">
         <input
          type="checkbox"
          {...register(`education.${index}.isCurrent`)}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
         />
         <span className="text-sm text-gray-700">Em andamento</span>
        </label>
       </div>
      </div>
     </div>
    );
   })}

   <button
    type="button"
    onClick={() => append(getEmptyEducation())}
    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
   >
    <Plus size={20} />
    Adicionar Outra Formação
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
