import React, { useEffect, useRef } from "react";
import { HtmlFormatter } from "@/core/formatters/HtmlFormatter";
import { Developer } from "@/core/models/Developer";
import { usePalette } from "@/styles/pallete_provider";

interface CodeBlockProps {
 dev: Developer;
 bgColor: { bg: string; text: string };
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ dev, bgColor }) => {
 const codeRef = useRef<HTMLPreElement>(null);
 const { palette } = usePalette();

 useEffect(() => {
  const formatter = new HtmlFormatter();
  if (codeRef.current) {
   codeRef.current.innerHTML = formatter.format(
    dev.toJSON(),
    palette,
    bgColor.text
   );
  }
 }, [dev, palette, bgColor.text]);

 return (
  <pre
   id="code"
   ref={codeRef}
   className="p-6 shadow-md shadow-[color:var(--secondary)] rounded-lg text-sm font-mono mb-4 w-full max-w-2xl mx-auto overflow-x-auto"
   style={{
    borderColor: "var(--accent)",
    color: bgColor.text,
    backgroundColor: bgColor.bg,
   }}
  />
 );
};
