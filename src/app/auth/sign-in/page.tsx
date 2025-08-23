"use client";

import { motion } from "framer-motion";
import { FaGithub, FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/services/AuthProvider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/core/services/LanguageProvider";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
  opacity: 1,
  transition: { staggerChildren: 0.1 as const },
 },
};

const itemVariants = {
 hidden: { y: 20, opacity: 0 },
 visible: {
  y: 0,
  opacity: 1,
  transition: { type: "spring" as const, stiffness: 100 },
 },
};

const signInSchema = z.object({
 email: z.string().email("Invalid email"),
 password: z.string().min(6, "Minimum 6 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

const Header = () => {
 const { t } = useLanguage();
 return (
  <motion.div variants={itemVariants} className="p-8 pb-0">
   <h1 className="text-2xl font-bold text-center text-white mb-2">
    {t("auth.login")}
   </h1>
   <p className="text-zinc-400 text-center">{t("auth.email")}</p>
  </motion.div>
 );
};

const SocialButtons = () => (
 <motion.div
  variants={itemVariants}
  className="px-8 pt-6 flex justify-center space-x-4"
 >
  {[FaGithub, FaGoogle].map((Icon, i) => (
   <button
    key={i}
    className="p-3 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors text-white"
   >
    <Icon className="text-lg" />
   </button>
  ))}
 </motion.div>
);

const Divider = () => (
 <motion.div variants={itemVariants} className="px-8 py-6 flex items-center">
  <div className="flex-1 h-px bg-zinc-700"></div>
  <span className="px-4 text-sm text-zinc-500">OR</span>
  <div className="flex-1 h-px bg-zinc-700"></div>
 </motion.div>
);

const InputField = ({
 id,
 label,
 type,
 Icon,
 placeholder,
 register,
 error,
}: {
 id: keyof SignInValues;
 label: string;
 type: string;
 Icon: React.ElementType;
 placeholder: string;
 register: ReturnType<typeof useForm<SignInValues>>["register"];
 error?: string;
}) => (
 <motion.div variants={itemVariants}>
  <Input
   id={id}
   label={label}
   type={type}
   placeholder={placeholder}
   leftIcon={<Icon className="text-zinc-500" />}
   error={error}
   {...register(id)}
  />
 </motion.div>
);

const Form = () => {
 const [loading, setLoading] = useState(false);
 const [authLoading, setAuthLoading] = useState(true);
 const [userLogged, setUserLogged] = useState(false);
 const router = useRouter();
 const { user, loading: globalAuthLoading } = useAuth();
 const {
  register,
  handleSubmit,
  formState: { errors },
  setError,
  clearErrors,
 } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });
 const { t } = useLanguage();

 useEffect(() => {
  setAuthLoading(globalAuthLoading);
  setUserLogged(!!user);
 }, [globalAuthLoading, user]);

 useEffect(() => {
  if (!authLoading && userLogged) {
   router.replace("/");
  }
 }, [authLoading, userLogged, router]);

 if (authLoading) {
  return (
   <div className="flex justify-center items-center py-16">
    <span className="text-zinc-400 text-lg animate-pulse">Loading...</span>
   </div>
  );
 }

 const onSubmit = async (values: SignInValues) => {
  setLoading(true);
  clearErrors();
  try {
   await signInWithEmailAndPassword(auth, values.email, values.password);
  } catch (err) {
   const message = err instanceof Error ? err.message : "Failed to sign in";
   setError("root", { message });
  } finally {
   setLoading(false);
  }
 };

 return (
  <motion.form
   variants={containerVariants}
   className="px-8 pb-8 space-y-6"
   onSubmit={handleSubmit(onSubmit)}
   noValidate
  >
   <InputField
    id="email"
    label={t("auth.email")}
    type="email"
    Icon={FaEnvelope}
    placeholder="you@example.com"
    register={register}
    error={errors.email?.message}
   />
   <motion.div variants={itemVariants}>
    <div className="flex justify-between items-center mb-1">
     <label
      htmlFor="password"
      className="block text-sm font-medium text-zinc-300"
     >
      {t("auth.password")}
     </label>
     <a
      href="#"
      className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
     >
      {t("auth.forgot")}
     </a>
    </div>
    <div className="relative">
     <Input
      id="password"
      type="password"
      placeholder="••••••••"
      leftIcon={<FaLock className="text-zinc-500" />}
      error={errors.password?.message}
      {...register("password")}
     />
    </div>
    {errors.password && (
     <p id="password-error" className="mt-1 text-xs text-red-400">
      {errors.password.message}
     </p>
    )}
   </motion.div>
   <motion.div variants={itemVariants}>
    <Button
     type="submit"
     loading={loading}
     full
     rightIcon={<FiArrowRight className="ml-2" />}
    >
     {t("auth.login")}
    </Button>
   </motion.div>
   {errors.root && (
    <motion.div
     variants={itemVariants}
     className="text-center text-red-400 text-sm"
    >
     {errors.root.message}
    </motion.div>
   )}
   <motion.div
    variants={itemVariants}
    className="text-center text-zinc-400 text-sm"
   >
    Don&apos;t have an account?{" "}
    <a
     href="/auth/sign-up"
     className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
    >
     {t("auth.signUpCta")}
    </a>
   </motion.div>
  </motion.form>
 );
};

const Footer = () => (
 <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="mt-6 text-center text-zinc-500 text-sm"
 >
  © {new Date().getFullYear()} ProFile. All rights reserved.
 </motion.div>
);

const SignIn = () => (
 <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
  <motion.div
   initial={{ scale: 0.95, opacity: 0 }}
   animate={{ scale: 1, opacity: 1 }}
   transition={{ duration: 0.5 }}
   className="w-full max-w-lg"
  >
   <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="bg-zinc-800/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-zinc-700/50"
   >
    <Header />
    <SocialButtons />
    <Divider />
    <Form />
   </motion.div>
   <Footer />
  </motion.div>
 </div>
);

export default SignIn;
