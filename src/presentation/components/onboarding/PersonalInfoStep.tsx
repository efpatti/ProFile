"use client";

/**
 * Personal Info Step
 * Uncle Bob: "Functions should do one thing. They should do it well."
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, type PersonalInfo } from "@/types/onboarding";

interface PersonalInfoStepProps {
 initialData?: Partial<PersonalInfo>;
 onNext: (data: PersonalInfo) => void;
}

export function PersonalInfoStep({
 initialData,
 onNext,
}: PersonalInfoStepProps) {
 const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
 } = useForm<PersonalInfo>({
  resolver: zodResolver(personalInfoSchema),
  defaultValues: initialData,
 });

 return (
  <form onSubmit={handleSubmit(onNext)} className="space-y-6">
   <div>
    <label
     htmlFor="fullName"
     className="block text-sm font-medium text-gray-700 mb-2"
    >
     Nome Completo <span className="text-red-500">*</span>
    </label>
    <input
     id="fullName"
     type="text"
     {...register("fullName")}
     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     placeholder="João da Silva"
    />
    {errors.fullName && (
     <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
    )}
   </div>

   <div>
    <label
     htmlFor="email"
     className="block text-sm font-medium text-gray-700 mb-2"
    >
     Email <span className="text-red-500">*</span>
    </label>
    <input
     id="email"
     type="email"
     {...register("email")}
     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     placeholder="joao@example.com"
    />
    {errors.email && (
     <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
    )}
   </div>

   <div>
    <label
     htmlFor="phone"
     className="block text-sm font-medium text-gray-700 mb-2"
    >
     Telefone <span className="text-gray-400">(opcional)</span>
    </label>
    <input
     id="phone"
     type="tel"
     {...register("phone")}
     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     placeholder="+55 (11) 98765-4321"
    />
    {errors.phone && (
     <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
    )}
   </div>

   <div>
    <label
     htmlFor="location"
     className="block text-sm font-medium text-gray-700 mb-2"
    >
     Localização <span className="text-gray-400">(opcional)</span>
    </label>
    <input
     id="location"
     type="text"
     {...register("location")}
     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     placeholder="São Paulo, SP"
    />
    {errors.location && (
     <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
    )}
   </div>

   <button
    type="submit"
    disabled={isSubmitting}
    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
   >
    {isSubmitting ? "Salvando..." : "Próximo"}
   </button>
  </form>
 );
}
