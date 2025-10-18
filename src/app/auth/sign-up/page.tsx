"use client";

import { motion } from "framer-motion";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function SignUpPage() {
 const router = useRouter();
 const { data: session, status } = useSession();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 useEffect(() => {
  if (status === "authenticated") {
   router.push("/onboarding");
  }
 }, [status, router]);

 const handleOAuthSignUp = async (provider: "google" | "github") => {
  try {
   setLoading(true);
   setError("");
   await signIn(provider, { callbackUrl: "/onboarding" });
  } catch (err) {
   setError("Failed to sign up. Please try again.");
   console.error("Sign-up error:", err);
  } finally {
   setLoading(false);
  }
 };

 if (status === "loading") {
  return (
   <div className="flex items-center justify-center min-h-screen bg-zinc-900">
    <div className="text-white">Loading...</div>
   </div>
  );
 }

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
      Create an account
     </h1>
     <p className="text-zinc-400 text-center">
      Get started with your free account
     </p>
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
     <button
      onClick={() => handleOAuthSignUp("google")}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white hover:bg-gray-100 transition-colors text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
     >
      <FaGoogle className="text-xl" />
      Sign up with Google
     </button>

     <button
      onClick={() => handleOAuthSignUp("github")}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition-colors text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
     >
      <FaGithub className="text-xl" />
      Sign up with GitHub
     </button>
    </motion.div>

    <motion.div variants={itemVariants} className="px-8 py-6">
     <div className="relative">
      <div className="absolute inset-0 flex items-center">
       <div className="w-full border-t border-zinc-700"></div>
      </div>
      <div className="relative flex justify-center text-sm">
       <span className="px-4 bg-zinc-800 text-zinc-500">
        Already have an account?
       </span>
      </div>
     </div>
    </motion.div>

    <motion.div variants={itemVariants} className="px-8 pb-8">
     <Link
      href="/auth/sign-in"
      className="w-full flex items-center justify-center p-4 rounded-xl border-2 border-zinc-700 hover:border-zinc-600 transition-colors text-white font-medium"
     >
      Sign in
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
