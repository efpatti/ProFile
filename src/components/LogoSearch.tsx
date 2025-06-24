import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";

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

 const handleSearch = async () => {
  if (query.length < 2) return;
  setLoading(true);
  const res = await fetch(`/api/brand-search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  setResults(data.results?.results || []);
  setShowSuggestions(true);
  setLoading(false);
 };

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

 return (
  <div className="mt-6 flex items-center gap-3 w-full max-w-2xl">
   <div className="relative flex-1">
    <input
     ref={inputRef}
     type="text"
     value={query}
     onChange={(e) => {
      setQuery(e.target.value);
      setShowSuggestions(false);
     }}
     onFocus={() => query.length >= 2 && setShowSuggestions(true)}
     placeholder=" "
     autoComplete="off"
     className="peer px-4 py-3 w-full bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:border-accent focus:ring-0 transition-all duration-200"
    />
    <label
     htmlFor="company-domain"
     className="absolute left-3 top-3 px-1 text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent bg-gray-800 peer-focus:bg-gray-900"
    >
     Digite o nome ou domínio (ex: Google ou google.com)
    </label>
    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent scale-x-0 peer-focus:scale-x-100 transition-transform duration-300 origin-left" />
    {showSuggestions && results.length > 0 && (
     <div className="absolute z-10 w-full bg-gray-900 border border-gray-700 rounded-b shadow-lg mt-1 max-h-56 overflow-y-auto suggestions-container">
      {results.map((brand) => (
       <div
        key={brand.domain}
        className="suggestion-item flex items-center px-3 py-2 hover:bg-gray-800 cursor-pointer"
        onClick={() => handleSelect(brand)}
       >
        <Image
         src={brand.logo_url}
         alt={brand.name || brand.domain}
         width={24}
         height={24}
         className="w-6 h-6 rounded-full mr-2 bg-white p-1"
        />
        <div>
         <div className="font-medium">{brand.name || brand.domain}</div>
         <div className="text-xs text-gray-400">{brand.domain}</div>
        </div>
       </div>
      ))}
      {results.length === 0 && (
       <div className="suggestion-item px-3 py-2 text-gray-400">
        No results found
       </div>
      )}
     </div>
    )}
   </div>
   <button
    onClick={handleSearch}
    className="icon-expand-button rounded-lg px-3 py-2 bg-accent text-white ml-2"
    disabled={loading || query.length < 2}
    title="Buscar"
   >
    <FaEdit />
   </button>
   <button
    onClick={handleRemove}
    className="icon-expand-button rounded-lg px-3 py-2 bg-gray-700 text-white ml-1"
    title="Remover logo"
   >
    <FaTrash />
   </button>
  </div>
 );
};
