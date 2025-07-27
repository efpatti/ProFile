import React from "react";
import { SkillCategory } from "@/types/resume";

interface SkillCategoryProps {
 category: SkillCategory;
 textClass?: string;
}

const SkillCategoryComponent: React.FC<SkillCategoryProps> = ({
 category,
 textClass = "text-gray-700",
}) => {
 return (
  <div className="mb-4">
   <h4 className={`font-semibold mb-2 ${textClass}`}>{category.title}</h4>
   <ul className={`list-disc pl-5 space-y-1 ${textClass}`}>
    {category.items.map((item, index) => (
     <li key={index}>{item}</li>
    ))}
   </ul>
  </div>
 );
};

export default SkillCategoryComponent;
