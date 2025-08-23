"use client";

import { motion } from "framer-motion";
import { FaGithub, FaGoogle, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import LogoSVG from "@/components/LogoSVG";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/services/AuthProvider";
import { doc, setDoc } from "firebase/firestore";
import { PaletteSelector } from "@/components/PaletteSelector";
import type { PaletteName } from "@/styles/PaletteProvider";
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

const Header = () => (
 <motion.div variants={itemVariants} className="p-8 pb-0">
  <div className="flex justify-center mb-6">
   <div className="h-30 w-40 bg-gradient-to-r flex items-center justify-center">
    <LogoSVG className="w-[500px] h-[400px]" />
   </div>
  </div>
  <h1 className="text-2xl font-bold text-center text-white mb-2">
   Create an account
  </h1>
  <p className="text-zinc-400 text-center">
   Get started with your free account
  </p>
 </motion.div>
);

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
}: {
 id: string;
 label: string;
 type: string;
 Icon: React.ElementType;
 placeholder: string;
}) => (
 <motion.div variants={itemVariants}>
  <Input
   id={id}
   label={label}
   type={type}
   placeholder={placeholder}
   leftIcon={<Icon className="text-zinc-500" />}
  />
 </motion.div>
);

const Form = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [authLoading, setAuthLoading] = useState(true);
 const [userLogged, setUserLogged] = useState(false);
 const [palette, setPalette] = useState<PaletteName>("darkGreen");
 const router = useRouter();
 const { user, loading: globalAuthLoading } = useAuth();

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

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  const form = e.currentTarget;
  const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
  const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
  const password = (form.elements.namedItem("password") as HTMLInputElement)
   ?.value;
  const confirmPassword = (
   form.elements.namedItem("confirmPassword") as HTMLInputElement
  )?.value;

  if (password !== confirmPassword) {
   setError("Passwords don't match");
   setLoading(false);
   return;
  }

  try {
   const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
   );
   await updateProfile(userCredential.user, { displayName: name });
   // Save to Firestore with palette
   await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    name,
    email,
    palette, // save palette
    createdAt: new Date().toISOString(),
   });
   router.push("/"); // redirect to home on success
  } catch (err) {
   const errorMsg = err instanceof Error ? err.message : String(err);
   setError(errorMsg || "Failed to create account");
  } finally {
   setLoading(false);
  }
 };

 return (
  <motion.form
   variants={containerVariants}
   className="px-8 pb-8 space-y-6"
   onSubmit={handleSubmit}
  >
   <InputField
    id="name"
    label="Full name"
    type="text"
    Icon={FaUser}
    placeholder="John Doe"
   />
   <InputField
    id="email"
    label="Email address"
    type="email"
    Icon={FaEnvelope}
    placeholder="you@example.com"
   />
   <InputField
    id="password"
    label="Password"
    type="password"
    Icon={FaLock}
    placeholder="••••••••"
   />
   <InputField
    id="confirmPassword"
    label="Confirm Password"
    type="password"
    Icon={FaLock}
    placeholder="••••••••"
   />
   <motion.div variants={itemVariants}>
    <label className="block text-sm font-medium text-zinc-300 mb-1">
     Color palette
    </label>
    <PaletteSelector
     bgName="midnightSlate"
     selected={palette}
     onSelect={setPalette}
    />
   </motion.div>
   <motion.div variants={itemVariants}>
    <Button
     type="submit"
     loading={loading}
     full
     rightIcon={<FiArrowRight className="ml-2" />}
    >
     Sign up
    </Button>
   </motion.div>
   {error && (
    <motion.div
     variants={itemVariants}
     className="text-center text-red-400 text-sm"
    >
     {error}
    </motion.div>
   )}
   <motion.div
    variants={itemVariants}
    className="text-center text-zinc-400 text-sm"
   >
    Already have an account?{" "}
    <a
     href="/auth/sign-in"
     className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
    >
     Sign in
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

const SignUp = () => (
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

export default SignUp;
