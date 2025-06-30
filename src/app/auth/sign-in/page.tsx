"use client";

import { motion } from "framer-motion";
import { FaGithub, FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import LogoSVG from "@/components/LogoSVG"; // Componente SVG extraído

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
   Welcome back
  </h1>
  <p className="text-zinc-400 text-center">
   Log in to your account to continue
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
  <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1">
   {label}
  </label>
  <div className="relative">
   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <Icon className="text-zinc-500" />
   </div>
   <input
    id={id}
    type={type}
    className="w-full pl-10 pr-3 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    placeholder={placeholder}
   />
  </div>
 </motion.div>
);

const Form = () => (
 <motion.form variants={containerVariants} className="px-8 pb-8 space-y-6">
  <InputField
   id="email"
   label="Email address"
   type="email"
   Icon={FaEnvelope}
   placeholder="you@example.com"
  />

  <motion.div variants={itemVariants}>
   <div className="flex justify-between items-center mb-1">
    <label
     htmlFor="password"
     className="block text-sm font-medium text-zinc-300"
    >
     Password
    </label>
    <a
     href="#"
     className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
    >
     Forgot?
    </a>
   </div>
   <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
     <FaLock className="text-zinc-500" />
    </div>
    <input
     id="password"
     type="password"
     className="w-full pl-10 pr-3 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
     placeholder="••••••••"
    />
   </div>
  </motion.div>

  <motion.div variants={itemVariants}>
   <button
    type="submit"
    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center"
   >
    Log in
    <FiArrowRight className="ml-2" />
   </button>
  </motion.div>

  <motion.div
   variants={itemVariants}
   className="text-center text-zinc-400 text-sm"
  >
   Don&apos;t have an account?{" "}
   <a
    href="/auth/sign-up"
    className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
   >
    Sign up
   </a>
  </motion.div>
 </motion.form>
);

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
