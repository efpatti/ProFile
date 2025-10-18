"use client";

// Sincronização de paleta agora é feita pelo PaletteProvider via API
// Este componente é mantido apenas para compatibilidade
export const PaletteSyncWrapper = ({
 children,
}: {
 children: React.ReactNode;
}) => {
 return <>{children}</>;
};
