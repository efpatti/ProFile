"use client";

// Sincronização de banner color agora é feita pelo PaletteProvider via API
// Este componente é mantido apenas para compatibilidade
export const BannerColorSyncWrapper = ({
 children,
}: {
 children: React.ReactNode;
}) => {
 return <>{children}</>;
};
