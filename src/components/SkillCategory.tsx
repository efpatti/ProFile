import React from "react";
import { SkillCategory } from "@/types/resume";

interface SkillCategoryProps {
 category: SkillCategory;
}

const SkillCategoryComponent: React.FC<SkillCategoryProps> = ({ category }) => {
 return (
  <div className="mb-4">
   <h4 className="font-semibold text-gray-700 mb-2">{category.title}</h4>
   <ul className="list-disc pl-5 space-y-1 text-gray-700">
    {category.items.map((item, index) => (
     <li key={index}>{item}</li>
    ))}
   </ul>
  </div>
 );
};

export default SkillCategoryComponent;
