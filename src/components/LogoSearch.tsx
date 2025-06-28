import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface LogoSearchProps {
 onLogoSelect: (logoUrl: string) => void;
}

interface LogoResult {
 domain: string;
 logo_url: string;
 name?: string;
}

export const LogoSearch: React.FC<LogoSearchProps> = ({ onLogoSelect }) => {
 const [query, setQuery] = useState("");
 const [results, setResults] = useState<LogoResult[]>([]);
 const [loading, setLoading] = useState(false);
 const [showSuggestions, setShowSuggestions] = useState(false);
 const inputRef = useRef<HTMLInputElement>(null);
 const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

 // Busca automática com debounce
 useEffect(() => {
  if (query.length < 2) {
   setResults([]);
   setShowSuggestions(false);
   return;
  }
  setLoading(true);
  if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  debounceTimeout.current = setTimeout(async () => {
   const res = await fetch(`/api/brand-search?q=${encodeURIComponent(query)}`);
   const data = await res.json();
   setResults(data.results || []);
   setShowSuggestions(true);
   setLoading(false);
  }, 400);
  return () => {
   if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  };
 }, [query]);

 const handleBlur = () => setTimeout(() => setShowSuggestions(false), 150);

 const handleSelect = (logo: LogoResult) => {
  onLogoSelect(logo.logo_url);
  setShowSuggestions(false);
  setQuery(logo.domain);
 };

 const handleRemove = () => {
  onLogoSelect("/img/mottu.jpg");
  setQuery("");
  setShowSuggestions(false);
 };

 // Variantes de animação
 const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
   opacity: 1,
   transition: {
    staggerChildren: 0.1,
   },
  },
 };

 const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
   y: 0,
   opacity: 1,
   transition: {
    type: "spring" as const,
    stiffness: 300,
   },
  },
  pulse: {
   scale: [1, 1.1, 1],
   transition: {
    duration: 1,
    repeat: Infinity,
    ease: "easeInOut" as const,
   },
  },
 };

 return (
  <div className="mt-6 flex items-center gap-3 w-full max-w-2xl">
   <div className="relative flex-1">
    {/* Input com veias luminosas */}
    <motion.div
     initial={false}
     animate={{
      boxShadow:
       query.length > 0
        ? "0 0 10px rgb(255, 255, 255)"
        : "0 0 5px rgba(74, 222, 128, 0.2)",
     }}
     className="relative"
    >
     <input
      ref={inputRef}
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onFocus={() => query.length >= 2 && setShowSuggestions(true)}
      onBlur={handleBlur}
      placeholder=" "
      autoComplete="off"
      className="peer px-4 py-3 w-full bg-zinc-900 border-2 border-zinc-800/30 rounded-lg text-gray-200 focus:border-zinc-500 focus:ring-0 transition-all duration-300"
     />

     {/* Efeito de veias luminosas */}
     <motion.div
      initial={{ opacity: 0 }}
      animate={{
       opacity: query.length > 0 ? 0.7 : 0.3,
       backgroundImage:
        query.length > 0
         ? "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)"
         : "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)",
      }}
      className="absolute inset-0 rounded-6xl pointer-events-none"
     />

     <label
      htmlFor="company-domain"
      className="absolute left-3 top-3 px-1 text-zinc-300 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400/60 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-400 peer-focus:bg-zinc-900/90 z-10"
     >
      Digite o nome ou domínio (ex: Google ou google.com)
     </label>

     {/* Micélio animado (fungo) */}
     <motion.div
      initial={{ width: 0 }}
      animate={{
       width: query.length > 0 ? "100%" : "0%",
      }}
      className="absolute bottom-0 left-0 h-0.5 bg-zinc-400 origin-left"
     />
    </motion.div>

    {/* Sugestões com efeito orgânico e scroll personalizado */}
    <AnimatePresence>
     {showSuggestions && (
      <motion.div
       initial={{ opacity: 0, y: -10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -10 }}
       transition={{ duration: 0.2 }}
       className="absolute z-10 w-full mt-1 overflow-hidden"
      >
       <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-zinc-950/95 backdrop-blur-sm border-2 border-zinc-800/30 rounded-lg shadow-xl overflow-y-auto max-h-56 custom-organic-scroll"
       >
        <div className="pr-2">
         {" "}
         {/* Espaço para a barra de scroll */}
         {loading ? (
          <motion.div
           variants={itemVariants}
           className="px-4 py-3 text-zinc-300 flex items-center gap-2"
          >
           <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full"
           />
           Carregando redes orgânicas...
          </motion.div>
         ) : results.length > 0 ? (
          results.map((brand) => (
           <motion.div
            key={brand.domain}
            variants={itemVariants}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.48)" }}
            className="flex items-center px-4 py-3 cursor-pointer border-b border-zinc-900/30 last:border-b-0"
            onClick={() => handleSelect(brand)}
           >
            <motion.div
             variants={itemVariants}
             animate="pulse"
             className="relative w-8 h-8 rounded-full bg-white/10 p-1 mr-3"
            >
             <Image
              src={brand.logo_url}
              alt={brand.name || brand.domain}
              width={32}
              height={32}
              className="rounded-full"
             />
            </motion.div>
            <div>
             <div className="font-medium text-zinc-100">
              {brand.name || brand.domain}
             </div>
             <div className="text-xs text-zinc-300/70">{brand.domain}</div>
            </div>
           </motion.div>
          ))
         ) : (
          <motion.div
           variants={itemVariants}
           className="px-4 py-3 text-zinc-300/70"
          >
           Nenhum organismo encontrado
          </motion.div>
         )}
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>
   </div>

   {/* Botão de remover com efeito orgânico */}
   <motion.button
    onClick={handleRemove}
    whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.3)" }}
    whileTap={{ scale: 0.95 }}
    className="rounded-lg p-3 bg-red-900/30 text-red-400 ml-1 border-2 border-red-800/30"
    title="Remover logo"
   >
    <FaTrash />
   </motion.button>
  </div>
 );
};
