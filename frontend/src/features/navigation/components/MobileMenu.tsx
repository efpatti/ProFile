"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export const MobileMenu = ({
 isOpen,
 onClose,
 children,
}: {
 isOpen: boolean;
 onClose: () => void;
 children: React.ReactNode;
}) => (
 <AnimatePresence>
  {isOpen && (
   <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-40 bg-zinc-900/95 backdrop-blur-sm pt-16"
    style={{ willChange: "opacity" }}
   >
    <motion.div
     initial={{ y: -20 }}
     animate={{ y: 0 }}
     exit={{ y: -20 }}
     className="container mx-auto p-6 overflow-y-auto h-full"
     style={{ willChange: "transform" }}
    >
     {children}
     <div className="mt-8 flex justify-center">
      <button
       onClick={onClose}
       className="px-6 py-2 text-gray-400 hover:text-white border border-gray-700 rounded-lg flex items-center gap-2"
      >
       Close
      </button>
     </div>
    </motion.div>
   </motion.div>
  )}
 </AnimatePresence>
);
