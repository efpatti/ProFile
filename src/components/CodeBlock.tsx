import React, { useEffect, useRef } from "react";
import { HtmlFormatter } from "@/core/formatters/HtmlFormatter";
import { Developer } from "@/core/models/Developer";
import { usePalette } from "@/styles/PaletteProvider";

interface CodeBlockProps {
 dev: Developer;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ dev }) => {
 const codeRef = useRef<HTMLPreElement>(null);
 const { palette } = usePalette();

 useEffect(() => {
  const formatter = new HtmlFormatter();
  if (codeRef.current) {
   codeRef.current.innerHTML = formatter.format(dev.toJSON(), palette);
  }
 }, [dev, palette]);

 return (
  <pre
   id="code"
   ref={codeRef}
   className="bg-gray-900 p-6 shadow-md shadow-[color:var(--secondary)] rounded-lg text-sm font-mono text-gray-50 mb-4 w-full max-w-2xl mx-auto overflow-x-auto"
   style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
  />
 );
};
