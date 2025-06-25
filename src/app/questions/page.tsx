"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaletteSelector } from "@/components/PaletteSelector";
import { usePalette } from "@/styles/PaletteProvider";

type Question = {
 question: string;
 answer: string | string[];
};

type Answers = {
 name: string;
 role: string;
 customRole?: string;
 favoriteColor: string;
};

const Questions = () => {
 const [currentQuestion, setCurrentQuestion] = useState<number>(0);
 const [answers, setAnswers] = useState<Answers>({
  name: "",
  role: "",
  customRole: "",
  favoriteColor: "",
 });
 const [showCustomRoleInput, setShowCustomRoleInput] = useState<boolean>(false);
 const [isAnimating, setIsAnimating] = useState<boolean>(false);
 const { palette } = usePalette();

 const questions: Question[] = [
  {
   question: "What's your name?",
   answer: "",
  },
  {
   question: "What's your role?",
   answer: [
    "Fullstack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Mobile Developer",
    "Data Scientist",
    "DevOps Engineer",
    "UI/UX Designer",
    "QA Engineer",
    "Product Manager",
    "Other",
   ],
  },
  {
   question: "What's your favorite color?",
   answer: "",
  },
 ];

 const handleNext = () => {
  if (isNextDisabled() || isAnimating) return;

  setIsAnimating(true);
  setTimeout(() => {
   if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
   } else {
    console.log("Form completed:", answers);
   }
   setIsAnimating(false);
  }, 300);
 };

 const handleAnswerChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
 ) => {
  const { name, value } = e.target;

  if (value === "Other" && name === "role") {
   setShowCustomRoleInput(true);
   setAnswers({ ...answers, [name]: value });
  } else {
   if (name === "role") setShowCustomRoleInput(false);
   setAnswers({ ...answers, [name]: value });
  }
 };

 const handleCustomRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setAnswers({ ...answers, customRole: e.target.value });
 };

 const isNextDisabled = () => {
  if (currentQuestion === 0 && !answers.name) return true;
  if (currentQuestion === 1 && !answers.role) return true;
  if (currentQuestion === 1 && answers.role === "Other" && !answers.customRole)
   return true;
  if (currentQuestion === 2 && !answers.favoriteColor) return true;
  return false;
 };

 // Efeito de gradiente animado
 useEffect(() => {
  document.body.style.background =
   "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
  document.body.style.backgroundSize = "400% 400%";
  document.body.style.animation = "gradient 15s ease infinite";

  return () => {
   document.body.style.background = "";
   document.body.style.backgroundSize = "";
   document.body.style.animation = "";
  };
 }, []);

 return (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans">
   <style jsx global>{`
    @keyframes gradient {
     0% {
      background-position: 0% 50%;
     }
     50% {
      background-position: 100% 50%;
     }
     100% {
      background-position: 0% 50%;
     }
    }
   `}</style>

   <div className="w-full max-w-lg">
    <AnimatePresence mode="wait">
     <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20"
     >
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 w-full">
       <motion.div
        className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)]"
        initial={{ width: "0%" }}
        animate={{
         width: `${((currentQuestion + 1) / questions.length) * 100}%`,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
       />
      </div>

      <div className="p-8 space-y-8">
       <div className="text-center">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--accent)] uppercase">
         Question {currentQuestion + 1} of {questions.length}
        </h2>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
         {questions[currentQuestion].question}
        </h1>
       </div>

       <div className="space-y-6">
        {/* Name Question */}
        {currentQuestion === 0 && (
         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
         >
          <div className="relative">
           <input
            type="text"
            name="name"
            value={answers.name}
            onChange={handleAnswerChange}
            className="w-full px-5 py-3 text-lg border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[var(--accent)] focus:bg-white shadow-sm transition-all duration-200 text-slate-900"
            placeholder="Your beautiful name..."
            autoFocus
           />
           <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
             className="w-5 h-5 text-gray-400"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
            >
             <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
             />
            </svg>
           </div>
          </div>
         </motion.div>
        )}

        {/* Role Question */}
        {currentQuestion === 1 && (
         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
         >
          <div className="relative">
           <select
            name="role"
            value={answers.role}
            onChange={handleAnswerChange}
            className="w-full px-5 py-3 text-lg appearance-none border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all duration-200 text-slate-900"
            autoFocus
           >
            <option value="">Select your role</option>
            {(questions[1].answer as string[]).map((role, index) => (
             <option key={index} value={role}>
              {role}
             </option>
            ))}
           </select>
           <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
             className="w-5 h-5 text-gray-400"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
            >
             <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
             />
            </svg>
           </div>
          </div>

          <AnimatePresence>
           {showCustomRoleInput && (
            <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: "auto" }}
             exit={{ opacity: 0, height: 0 }}
             transition={{ duration: 0.2 }}
            >
             <div className="relative">
              <input
               type="text"
               name="customRole"
               value={answers.customRole || ""}
               onChange={handleCustomRoleChange}
               className="w-full px-5 py-3 text-lg border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all duration-200"
               placeholder="Tell us your unique role..."
               autoFocus
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
               <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
               >
                <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeWidth="2"
                 d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
               </svg>
              </div>
             </div>
            </motion.div>
           )}
          </AnimatePresence>
         </motion.div>
        )}

        {/* Favorite Color Question */}
        {currentQuestion === 2 && (
         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
         >
          <div className="flex flex-col items-center gap-4">
           <PaletteSelector />
           <div className="text-sm text-gray-700 mt-2">
            Cor selecionada:{" "}
            <span className="font-bold capitalize">{palette}</span>
           </div>
           <button
            type="button"
            onClick={() => setAnswers({ ...answers, favoriteColor: palette })}
            className={`mt-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-semibold shadow transition-all duration-200 ${
             answers.favoriteColor === palette
              ? "ring-2 ring-[var(--secondary)]"
              : ""
            }`}
           >
            Usar esta cor
           </button>
          </div>
         </motion.div>
        )}
       </div>

       <motion.button
        whileTap={{ scale: isNextDisabled() ? 1 : 0.98 }}
        whileHover={{ scale: isNextDisabled() ? 1 : 1.02 }}
        onClick={handleNext}
        disabled={isNextDisabled()}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-md ${
         isNextDisabled()
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] text-white hover:shadow-lg"
        }`}
       >
        {currentQuestion === questions.length - 1
         ? "✨ Complete ✨"
         : "Continue →"}
       </motion.button>
      </div>
     </motion.div>
    </AnimatePresence>
   </div>
  </div>
 );
};

export default Questions;
