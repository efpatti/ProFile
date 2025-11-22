"use client";

import { motion } from "framer-motion";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
  opacity: 1,
  transition: { staggerChildren: 0.1 },
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

export default function SignInPage() {
 const router = useRouter();
 const { isAuthenticated, login, error: authError, clearError } = useAuth();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");

 useEffect(() => {
  if (isAuthenticated) {
   router.push("/protected/resume");
  }
 }, [isAuthenticated, router]);

 useEffect(() => {
  if (authError) {
   setError(authError);
   clearError();
  }
 }, [authError, clearError]);

 const handleEmailSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
   setLoading(true);
   setError("");

   const success = await login({ email, password });

   if (success) {
    router.push("/protected/resume");
   } else {
    setError("Invalid email or password");
   }
  } catch (err) {
   setError("Failed to sign in. Please try again.");
   console.error("Sign-in error:", err);
  } finally {
   setLoading(false);
  }
 };

 // OAuth is not implemented in the current backend
 const handleOAuthSignIn = async (provider: "google" | "github") => {
  setError("OAuth sign-in is not available yet. Please use email and password.");
 };

 return (
  <div className="flex items-center justify-center min-h-screen bg-zinc-900 p-4">
   <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
   >
    <motion.div variants={itemVariants} className="p-8 pb-6">
     <h1 className="text-3xl font-bold text-center text-white mb-2">
      Welcome Back
     </h1>
     <p className="text-zinc-400 text-center">Sign in to continue to ProFile</p>
    </motion.div>

    {error && (
     <motion.div
      variants={itemVariants}
      className="mx-8 mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg"
     >
      <p className="text-red-400 text-sm text-center">{error}</p>
     </motion.div>
    )}

    <motion.div variants={itemVariants} className="px-8 space-y-4">
     <form onSubmit={handleEmailSignIn} className="space-y-4">
      <div>
       <label
        htmlFor="email"
        className="block text-sm font-medium text-zinc-400 mb-2"
       >
        Email
       </label>
       <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-xl bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="your@email.com"
       />
      </div>

      <div>
       <label
        htmlFor="password"
        className="block text-sm font-medium text-zinc-400 mb-2"
       >
        Password
       </label>
       <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        className="w-full px-4 py-3 rounded-xl bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="••••••••"
       />
      </div>

      <button
       type="submit"
       disabled={loading}
       className="w-full p-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
       {loading ? "Signing in..." : "Sign in with Email"}
      </button>
     </form>

     <div className="relative">
      <div className="absolute inset-0 flex items-center">
       <div className="w-full border-t border-zinc-700"></div>
      </div>
      <div className="relative flex justify-center text-sm">
       <span className="px-4 bg-zinc-800 text-zinc-500">Or continue with</span>
      </div>
     </div>

     <button
      onClick={() => handleOAuthSignIn("google")}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white hover:bg-gray-100 transition-colors text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
     >
      <FaGoogle className="text-xl" />
      Continue with Google
     </button>

     <button
      onClick={() => handleOAuthSignIn("github")}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition-colors text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
     >
      <FaGithub className="text-xl" />
      Continue with GitHub
     </button>
    </motion.div>

    <motion.div variants={itemVariants} className="px-8 py-6">
     <div className="relative">
      <div className="absolute inset-0 flex items-center">
       <div className="w-full border-t border-zinc-700"></div>
      </div>
      <div className="relative flex justify-center text-sm">
       <span className="px-4 bg-zinc-800 text-zinc-500">New to ProFile?</span>
      </div>
     </div>
    </motion.div>

    <motion.div variants={itemVariants} className="px-8 pb-8">
     <Link
      href="/auth/sign-up"
      className="w-full flex items-center justify-center p-4 rounded-xl border-2 border-zinc-700 hover:border-zinc-600 transition-colors text-white font-medium"
     >
      Create an account
     </Link>
    </motion.div>

    <motion.div variants={itemVariants} className="px-8 pb-8">
     <p className="text-zinc-500 text-xs text-center">
      By continuing, you agree to ProFile's{" "}
      <Link href="/terms" className="underline hover:text-zinc-400">
       Terms of Service
      </Link>{" "}
      and{" "}
      <Link href="/privacy" className="underline hover:text-zinc-400">
       Privacy Policy
      </Link>
      .
     </p>
    </motion.div>
   </motion.div>
  </div>
 );
}
