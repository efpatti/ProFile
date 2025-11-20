interface ResumeHeaderProps {
 displayName?: string;
 userName?: string | null;
 subtitle?: string | null;
 contacts?: { text: string; href?: string }[];
}
export function ResumeHeader({
 displayName,
 userName,
 subtitle,
 contacts,
}: ResumeHeaderProps) {
 return (
  <div className="p-8 bg-[var(--accent)] text-white">
   <h1 className="text-3xl font-bold mb-2">
    {displayName || userName || "Seu Nome"}
   </h1>
   <h2 className="text-xl opacity-90 mb-6">
    {subtitle || "Título Profissional"}
   </h2>
   <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base">
    {(contacts || []).map((contact) => {
     const content = <span>{contact.text}</span>;
     if (!contact.href) {
      return (
       <span key={contact.text} className="text-sm text-white opacity-80">
        {contact.text}
       </span>
      );
     }

     const isExternal = contact.href.startsWith("http");
     return (
      <a
       key={contact.text}
       href={contact.href}
       className="flex items-center gap-2 hover:underline transition-colors duration-200 text-sm text-white"
       target={isExternal ? "_blank" : undefined}
       rel={isExternal ? "noopener noreferrer" : undefined}
      >
       {content}
      </a>
     );
    })}
   </div>
  </div>
 );
}
