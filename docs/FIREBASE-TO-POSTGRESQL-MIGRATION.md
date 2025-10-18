# Plano de Migração Firebase → PostgreSQL

## Status Atual ✅

### Já Migrado

1. ✅ Schema Prisma configurado com User (palette, bannerColor)
2. ✅ PrismaUserRepository criado
3. ✅ API /api/user/preferences (GET e PATCH)
4. ✅ AuthProvider atualizado para usar API
5. ✅ PaletteProvider atualizado para usar API
6. ✅ PaletteSelector atualizado para usar API
7. ✅ SettingsBanner atualizado para usar API

## Próximos Passos 🚀

### Fase 1: Remover hooks Firebase duplicados

- [ ] Remover src/features/palette/hooks/\* (funcionalidade já está em PaletteProvider)

### Fase 2: Migrar Store de Resume

- [ ] Atualizar src/core/store/useResumeStore.ts para usar API/Prisma
- [ ] Já existe PrismaResumeRepository - usar ele

### Fase 3: Atualizar Pages/API

- [ ] src/app/api/resume/route.ts - trocar FirebaseResumeRepository por PrismaResumeRepository
- [ ] src/app/(public)/[username]/page.tsx - usar API
- [ ] src/app/protected/resume/page.tsx - usar API
- [ ] src/presentation/hooks/useResume.ts - usar PrismaResumeRepository

### Fase 4: Migrar Services para API Routes

Criar rotas API para cada service e usar Prisma:

- [ ] /api/resume/awards
- [ ] /api/resume/certifications
- [ ] /api/resume/interests
- [ ] /api/resume/skills
- [ ] /api/resume/recommendations
- [ ] /api/resume/projects
- [ ] /api/resume/education
- [ ] /api/resume/experience
- [ ] /api/resume/profile
- [ ] /api/resume/header

### Fase 5: Componentes

- [ ] ExperienceEditor - remover Timestamp do Firebase, usar Date
- [ ] Banner - remover tipo User do Firebase

### Fase 6: Limpeza Final

- [ ] Remover dependências firebase e firebase-admin do package.json
- [ ] Remover src/lib/firebase.ts
- [ ] Remover src/lib/firebaseAdmin.ts
- [ ] Remover FirebaseResumeRepository
- [ ] Remover variáveis FIREBASE do .env
- [ ] Remover firestore.rules, firestore.indexes.json, firebase.json
- [ ] Atualizar signOut para usar NextAuth signOut

## Comandos

```bash
# Instalar dependências do Prisma (já instalado)
npm install @prisma/client

# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev

# Ver banco
npx prisma studio
```
