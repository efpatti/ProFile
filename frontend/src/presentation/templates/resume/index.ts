import { ProfessionalTemplate } from "./ProfessionalTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalistTemplate } from "./MinimalistTemplate";

export { ProfessionalTemplate, ModernTemplate, MinimalistTemplate };

export const TEMPLATE_REGISTRY = {
 professional: ProfessionalTemplate,
 modern: ModernTemplate,
 minimalist: MinimalistTemplate,
} as const;

export type TemplateId = keyof typeof TEMPLATE_REGISTRY;

export const TEMPLATE_METADATA = {
 professional: {
  id: "professional" as const,
  name: "Professional",
  description:
   "ATS-friendly single-column layout optimized for job applications",
  features: [
   "Single column layout",
   "High contrast for readability",
   "ATS-optimized (no graphics)",
   "Clean hierarchy",
   "System fonts",
  ],
  category: "Traditional",
  difficulty: "beginner",
  recommended: true,
 },
 modern: {
  id: "modern" as const,
  name: "Modern",
  description: "Two-column creative design with sidebar and accent colors",
  features: [
   "Two-column layout",
   "Color sidebar",
   "Icon accents",
   "Tech-forward aesthetic",
   "Prominent technologies",
  ],
  category: "Creative",
  difficulty: "intermediate",
  recommended: true,
 },
 minimalist: {
  id: "minimalist" as const,
  name: "Minimalist",
  description:
   "Clean and elegant design with generous whitespace and serif typography",
  features: [
   "Generous whitespace",
   "Serif headings",
   "Typography-driven",
   "Minimal visual elements",
   "Focus on quality",
  ],
  category: "Elegant",
  difficulty: "advanced",
  recommended: true,
 },
} as const;

export function getTemplateComponent(templateId: string) {
 return (
  TEMPLATE_REGISTRY[templateId as TemplateId] || TEMPLATE_REGISTRY.professional
 );
}

export function getTemplateMetadata(templateId: string) {
 return (
  TEMPLATE_METADATA[templateId as TemplateId] || TEMPLATE_METADATA.professional
 );
}
