"use client";

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

 const inputClass =
  "w-full px-4 py-3 rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:border-transparent transition";
 const labelClass = "block text-sm font-medium text-slate-200 mb-2";

 return (
  <form onSubmit={handleSubmit(onNext)} className="space-y-6 text-slate-100">
   <div>
    <label htmlFor="fullName" className={labelClass}>
     Nome Completo <span className="text-red-500">*</span>
    </label>
    <input
     id="fullName"
     type="text"
     {...register("fullName")}
     className={inputClass}
     placeholder="João da Silva"
    />
    {errors.fullName && (
     <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>
    )}
   </div>

   <div>
    <label htmlFor="email" className={labelClass}>
     Email <span className="text-red-500">*</span>
    </label>
    <input
     id="email"
     type="email"
     {...register("email")}
     className={inputClass}
     placeholder="joao@example.com"
    />
    {errors.email && (
     <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
    )}
   </div>

   <div>
    <label htmlFor="phone" className={labelClass}>
     Telefone <span className="text-slate-400">(opcional)</span>
    </label>
    <input
     id="phone"
     type="tel"
     {...register("phone")}
     className={inputClass}
     placeholder="+55 (11) 98765-4321"
    />
    {errors.phone && (
     <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
    )}
   </div>

   <div>
    <label htmlFor="location" className={labelClass}>
     Localização <span className="text-slate-400">(opcional)</span>
    </label>
    <input
     id="location"
     type="text"
     {...register("location")}
     className={inputClass}
     placeholder="São Paulo, SP"
    />
    {errors.location && (
     <p className="mt-1 text-sm text-red-400">{errors.location.message}</p>
    )}
   </div>

   <button
    type="submit"
    disabled={isSubmitting}
    className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
   >
    {isSubmitting ? "Salvando..." : "Próximo"}
   </button>
  </form>
 );
}
