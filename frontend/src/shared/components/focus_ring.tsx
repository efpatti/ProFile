import React from "react";

export const FocusRing = ({
 children,
 className = "",
}: {
 children: React.ReactNode;
 className?: string;
}) => (
 <div
  className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-zinc-900 rounded-md ${className}`}
 >
  {children}
 </div>
);
