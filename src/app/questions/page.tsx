"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaletteSelector } from "@/components/PaletteSelector";
import { usePalette } from "@/styles/PaletteProvider";
import {
 FaArrowAltCircleLeft,
 FaArrowAltCircleRight,
 FaCheckCircle,
} from "react-icons/fa";

type Question = {
 question: string;
 answer: string | string[];
};

type Answers = {
 name: string;
 role: string;
 customRole?: string;
 favoriteColor: string;
 stack?: string[];
};

export const stackOptionsByRole: Record<string, string[]> = {
 "Fullstack Developer": [
  "React.js",
  "Next.js",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  ".NET",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Docker",
  "Git",
  "REST",
  "GraphQL",
  "Redis",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
 ],

 "Frontend Developer": [
  "React.js",
  "Next.js",
  "Vue.js",
  "Angular",
  "TailwindCSS",
  "Styled Components",
  "Sass",
  "CSS Modules",
  "Vite",
  "Webpack",
  "Babel",
  "Jest",
  "React Testing Library",
  "Cypress",
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "Figma",
  "APIs REST",
  "GraphQL",
 ],

 "Backend Developer": [
  "Node.js",
  "Express",
  "NestJS",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  ".NET Core",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "REST",
  "GraphQL",
  "Pytest",
  "JUnit",
  "Supertest",
  "Docker",
  "Kafka",
  "RabbitMQ",
  "Git",
  "CI/CD",
  "Python",
  "JavaScript",
  "Java",
  "Go",
  "C#",
 ],

 "Mobile Developer": [
  "React Native",
  "Flutter",
  "Swift",
  "Xcode",
  "Kotlin",
  "Java",
  "Firebase",
  "Expo",
  "Fastlane",
  "SQLite",
  "Realm",
  "GraphQL",
  "Detox",
  "Espresso",
  "XCTest",
 ],

 "Data Scientist": [
  "Python",
  "R",
  "SQL",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "TensorFlow",
  "PyTorch",
  "Matplotlib",
  "Seaborn",
  "Jupyter",
  "Google Colab",
  "Airflow",
  "Docker",
  "Spark",
  "Hadoop",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Snowflake",
  "APIs",
  "Git",
  "Dash",
  "Streamlit",
 ],

 "DevOps Engineer": [
  "Docker",
  "Podman",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud (GCP)",
  "Jenkins",
  "GitHub Actions",
  "GitLab CI",
  "ArgoCD",
  "Terraform",
  "Ansible",
  "Prometheus",
  "Grafana",
  "Datadog",
  "Linux",
  "Bash",
  "Nginx",
  "Helm",
 ],

 "UI/UX Designer": [
  "Figma",
  "Adobe XD",
  "Sketch",
  "InVision",
  "Framer",
  "Material UI",
  "Fluent",
  "Tailwind UI",
  "Miro",
  "Notion",
  "Heurísticas de Nielsen",
  "Testes de Usabilidade",
 ],

 "QA Engineer": [
  "Selenium",
  "Cypress",
  "Playwright",
  "Appium",
  "Jest",
  "JUnit",
  "Mocha",
  "Postman",
  "Rest Assured",
  "GitHub Actions",
  "Jenkins",
  "JavaScript",
  "Java",
  "Python",
  "TestRail",
  "Jira",
  "Cucumber",
  "BDD",
  "TDD",
 ],

 "Product Manager": [
  "Jira",
  "Trello",
  "Notion",
  "Monday",
  "Asana",
  "Slack",
  "Zoom",
  "Confluence",
  "Figma",
  "Miro",
  "Google Analytics",
  "Hotjar",
  "Mixpanel",
  "Tableau",
  "Excel",
  "SQL",
  "Roadmaps",
  "OKRs",
  "Scrum",
  "Kanban",
 ],
};

const FloatingInput = ({
 label,
 value,
 onChange,
 name,
 autoFocus = false,
 icon,
}: {
 label: string;
 value: string;
 onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 name: string;
 autoFocus?: boolean;
 icon?: React.ReactNode;
}) => {
 const [isFocused, setIsFocused] = useState(false);
 const inputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
  if (value && inputRef.current) {
   setIsFocused(true);
  }
 }, [value]);

 return (
  <div className="relative w-full pt-6">
   <div className="relative">
    <input
     ref={inputRef}
     type="text"
     name={name}
     value={value}
     onChange={onChange}
     onFocus={() => setIsFocused(true)}
     onBlur={() => !value && setIsFocused(false)}
     className="w-full bg-transparent px-0 pt-6 py-2 border-0 border-b border-gray-300 focus:outline-none focus:ring-0 text-gray-900 text-lg"
     autoFocus={autoFocus}
    />

    {icon && (
     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      {icon}
     </div>
    )}

    <motion.label
     className={`absolute left-0 pointer-events-none origin-top-left ${
      isFocused || value
       ? "text-sm text-[var(--accent)]"
       : "text-lg text-gray-500"
     }`}
     initial={{ y: 24, scale: 1 }}
     animate={{
      y: isFocused || value ? 0 : 24,
      scale: isFocused || value ? 0.85 : 1,
     }}
     transition={{ duration: 0.2, ease: "easeOut" }}
    >
     {label}
    </motion.label>

    <motion.div
     className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)]"
     initial={{ scaleX: 0 }}
     animate={{
      scaleX: isFocused ? 1 : 0,
     }}
     transition={{ duration: 0.3, ease: "easeOut" }}
    />
   </div>
  </div>
 );
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
 // 3. Estados para perguntas dinâmicas e seleção de techs
 const [questions, setQuestions] = useState<Question[]>([
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
 ]);
 const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
 const [techSelectionIndex, setTechSelectionIndex] = useState<number | null>(
  null
 );
 const { palette } = usePalette();

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

 // 4. Efeito para inserir etapa dinâmica
 useEffect(() => {
  // Remove etapa de stack e cor se já existirem
  const baseQuestions = [questions[0], questions[1]];
  if (stackOptionsByRole[answers.role]) {
   baseQuestions.push({
    question: "What's your stack?",
    answer: stackOptionsByRole[answers.role],
   });
   setTechSelectionIndex(2);
   baseQuestions.push({
    question: "What's your favorite color?",
    answer: "",
   });
  } else {
   setTechSelectionIndex(null);
   baseQuestions.push({
    question: "What's your favorite color?",
    answer: "",
   });
  }
  setQuestions(baseQuestions);
  setSelectedTechs([]);
  // eslint-disable-next-line
 }, [answers.role]);

 const handleNext = () => {
  if (isNextDisabled() || isAnimating) return;

  setIsAnimating(true);
  setTimeout(() => {
   if (techSelectionIndex !== null && currentQuestion === techSelectionIndex) {
    setAnswers((prev) => ({ ...prev, stack: selectedTechs }));
   }
   if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
   } else {
    console.log("Form completed:", answers);
   }
   setIsAnimating(false);
  }, 300);
 };

 const handleBack = () => {
  if (currentQuestion === 0 || isAnimating) return;
  setIsAnimating(true);
  setTimeout(() => {
   setCurrentQuestion((prev) => Math.max(prev - 1, 0));
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

 const toggleTech = (tech: string) => {
  setSelectedTechs((prev) => {
   if (prev.includes(tech)) {
    return prev.filter((t) => t !== tech);
   } else if (prev.length < 5) {
    return [...prev, tech];
   } else {
    return prev;
   }
  });
 };

 const isNextDisabled = () => {
  if (currentQuestion === 0 && !answers.name) return true;
  if (currentQuestion === 1 && !answers.role) return true;
  if (currentQuestion === 1 && answers.role === "Other" && !answers.customRole)
   return true;
  if (techSelectionIndex !== null && currentQuestion === techSelectionIndex) {
   if (selectedTechs.length < 3 || selectedTechs.length > 5) return true;
  }
  if (
   (techSelectionIndex === null &&
    currentQuestion === 2 &&
    !answers.favoriteColor) ||
   (techSelectionIndex !== null &&
    currentQuestion === techSelectionIndex + 1 &&
    !answers.favoriteColor)
  )
   return true;
  return false;
 };

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
          <FloatingInput
           label="Your beautiful name..."
           value={answers.name}
           onChange={handleAnswerChange}
           name="name"
           autoFocus
           icon={
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
           }
          />
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
             <FloatingInput
              label="Tell us your unique role..."
              value={answers.customRole || ""}
              onChange={handleCustomRoleChange}
              name="customRole"
              autoFocus
              icon={
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
              }
             />
            </motion.div>
           )}
          </AnimatePresence>
         </motion.div>
        )}

        {/* Etapa dinâmica de tecnologias */}
        {techSelectionIndex !== null &&
         currentQuestion === techSelectionIndex && (
          <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
          >
           <div className="text-center mb-4 font-semibold text-lg  text-gray-700">
            Choose 3 to 5 technologies you use the most
           </div>
           <div className="flex flex-wrap gap-2 justify-center">
            {(questions[techSelectionIndex].answer as string[]).map((tech) => (
             <button
              key={tech}
              type="button"
              onClick={() => toggleTech(tech)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150
                    ${
                     selectedTechs.includes(tech)
                      ? "bg-[var(--accent)] text-white border-[var(--accent)] scale-105 shadow"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
             >
              {tech}
             </button>
            ))}
           </div>
           <div className="text-xs text-gray-500 mt-2 text-center">
            {selectedTechs.length < 3 && "Select at least 3 technologies."}
            {selectedTechs.length > 5 && "You can select up to 5 technologies."}
            {selectedTechs.length >= 3 &&
             selectedTechs.length <= 5 &&
             `${selectedTechs.length} selected`}
           </div>
          </motion.div>
         )}
        {/* Etapa de cor favorita */}
        {((techSelectionIndex === null && currentQuestion === 2) ||
         (techSelectionIndex !== null &&
          currentQuestion === techSelectionIndex + 1)) && (
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
       <div className="flex items-center justify-between gap-4 mt-4">
        <AnimatePresence initial={false}>
         {currentQuestion > 0 && (
          <motion.button
           key="back-btn"
           initial={{ opacity: 0, x: -40 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -40 }}
           transition={{ type: "spring", stiffness: 400, damping: 30 }}
           onClick={handleBack}
           className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          >
           <FaArrowAltCircleLeft />
           Back
          </motion.button>
         )}
        </AnimatePresence>
        <motion.button
         whileTap={{ scale: isNextDisabled() ? 1 : 0.98 }}
         whileHover={{ scale: isNextDisabled() ? 1 : 1.02 }}
         onClick={handleNext}
         disabled={isNextDisabled()}
         className={`cursor-pointer flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-md ml-2
                    ${
                     isNextDisabled()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] text-white hover:shadow-lg"
                    }`}
        >
         {currentQuestion === questions.length - 1 ? (
          <div className="flex items-center justify-center space-x-2">
           <h1>Complete</h1>
           <FaCheckCircle />
          </div>
         ) : (
          <div className="flex items-center justify-center space-x-2">
           <h1>Continue</h1>
           <FaArrowAltCircleRight />
          </div>
         )}
        </motion.button>
       </div>
      </div>
     </motion.div>
    </AnimatePresence>
   </div>
  </div>
 );
};

export default Questions;
