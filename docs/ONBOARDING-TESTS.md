# 🎯 Onboarding Critical Tests ($500K Quality)

## Teste Manual - Execute NESTA ORDEM:

### ✅ Cenário 1: Novo usuário com Credentials

```bash
# 1. Limpar DB (dev only)
npx prisma db push --force-reset

# 2. Testar
- Registrar novo usuário via /auth/sign-up
- Deve redirecionar automaticamente para /onboarding
- Preencher TODOS os passos (incluindo datas)
- Clicar "Finalizar"
- Verificar logs do console:
  [ONBOARDING] ✅ SUCCESS CHECKLIST:
    - Resume ID: ...
    - Experiences: 1
    - Education: 1
    - Template: professional
    - Palette: darkGreen
    - User onboarding flag: true
- Deve redirecionar para /protected/resume
- Refresh da página → NÃO deve voltar ao onboarding
```

**✅ Expected:**

- Onboarding completa
- Cookie `onboarding_attempts` zerado
- Nenhum loop infinito

---

### ✅ Cenário 2: Novo usuário com OAuth (simulado)

```bash
# Simular usuário OAuth que já tem registro parcial
# 1. Criar user no DB manualmente:
psql $DATABASE_URL -c "
  INSERT INTO \"User\" (id, email, name, \"hasCompletedOnboarding\")
  VALUES ('oauth-test-123', 'oauth@test.com', 'OAuth User', false);
"

# 2. Fazer login manual (criar session no NextAuth)
# 3. Acessar qualquer rota protegida
# 4. Deve redirecionar para /onboarding
# 5. Preencher onboarding
# 6. Verificar que NÃO criou resume duplicado:

psql $DATABASE_URL -c "
  SELECT COUNT(*) FROM \"Resume\" WHERE \"userId\" = 'oauth-test-123';
"
# Deve retornar: 1 (não 2!)
```

**✅ Expected:**

- Resume criado/atualizado (não duplicado)
- User.hasCompletedOnboarding = true
- Palette salva

---

### ✅ Cenário 3: Usuário preso em loop (escape hatch)

```bash
# Simular falha no onboarding
# 1. Criar user sem completar onboarding:
psql $DATABASE_URL -c "
  INSERT INTO \"User\" (id, email, \"hasCompletedOnboarding\")
  VALUES ('loop-test-456', 'loop@test.com', false);
"

# 2. Fazer login
# 3. Tentar acessar /protected/resume 3x (middleware conta tentativas)
# 4. Na 4ª tentativa, deve liberar acesso (escape hatch)
# 5. Verificar cookie `onboarding_attempts` zerado
```

**✅ Expected:**

- Após 3 redirecionamentos, usuário consegue acessar app
- Log de warning: `[MIDDLEWARE] ⚠️ User stuck in onboarding loop`

---

### ✅ Cenário 4: Datas inválidas

```bash
# Testar com inputs malformados via API diretamente
curl -X POST http://localhost:3000/api/onboarding \
  -H 'Content-Type: application/json' \
  -H 'Cookie: next-auth.session-token=...' \
  -d '{
    "personalInfo": {...},
    "professionalProfile": {...},
    "experiences": [{
      "company": "Test Inc",
      "position": "Dev",
      "startDate": "invalid-date",  ❌
      "isCurrent": false,
      "endDate": "2024-13-40"  ❌
    }],
    "education": [],
    "templateSelection": {...}
  }'
```

**✅ Expected:**

- Zod validation error (não chega ao Prisma)
- Response 400: "Data inicial inválida (use YYYY-MM-DD)"
- Logs: `[Onboarding] ⚠️ Invalid date format: "invalid-date"`

---

### ✅ Cenário 5: Re-onboarding (edge case)

```bash
# User completa onboarding, mas quer refazer
# 1. User já com hasCompletedOnboarding = true
# 2. Acessar /onboarding manualmente
# 3. Preencher com novos dados
# 4. Verificar que ATUALIZA resume (não cria novo)

psql $DATABASE_URL -c "
  SELECT COUNT(*) FROM \"Resume\" WHERE \"userId\" = '...';
"
# Deve retornar: 1 (mesmo depois de 2 onboardings)
```

**✅ Expected:**

- Upsert funciona corretamente
- Resume.updatedAt alterado
- Sem duplicatas

---

## 🔍 Logs esperados em SUCESSO:

```bash
[MIDDLEWARE] Path: /onboarding
[MIDDLEWARE] ✅ Onboarding route, allowing

[ONBOARDING] ===== START =====
[ONBOARDING] Session: user@example.com
[ONBOARDING] Validating data...
[ONBOARDING] Data validated successfully
[ONBOARDING] Finding user: user@example.com
[ONBOARDING] User found: cly2abc123
[ONBOARDING] Created 2 experiences
[ONBOARDING] Created 1 education entries
[ONBOARDING] Marking onboarding as complete...
[ONBOARDING] ✅ SUCCESS CHECKLIST:
  - Resume ID: cm3xyz789
  - Experiences: 2
  - Education: 1
  - Template: modern
  - Palette: darkGreen
  - User onboarding flag: true
[ONBOARDING] ===== COMPLETE =====

[MIDDLEWARE] Path: /protected/resume
[MIDDLEWARE] ✅ AUTHORIZED → Allowing access
```

---

## 🚨 Logs de ERRO esperados:

### ❌ Data inválida:

```
[Onboarding] ⚠️ Invalid date format: "2024-13-40"
[Onboarding] Skipping experience with invalid start date: Test Company
```

### ❌ Loop detection:

```
[MIDDLEWARE] ⛔ ONBOARDING INCOMPLETE → FORCING to /onboarding
[MIDDLEWARE] ⚠️ User stuck in onboarding loop (3 attempts)
```

---

## 📊 Database Checks

```sql
-- Verificar integridade após onboarding
SELECT
  u.email,
  u."hasCompletedOnboarding",
  u."onboardingCompletedAt",
  u.palette,
  COUNT(DISTINCT r.id) as resume_count,
  COUNT(DISTINCT e.id) as experience_count,
  COUNT(DISTINCT ed.id) as education_count
FROM "User" u
LEFT JOIN "Resume" r ON u.id = r."userId"
LEFT JOIN "Experience" e ON r.id = e."resumeId"
LEFT JOIN "Education" ed ON r.id = ed."resumeId"
WHERE u.email = 'test@example.com'
GROUP BY u.id;
```

**✅ Expected:**

- resume_count: 1
- experience_count: ≥ 0
- education_count: ≥ 0
- hasCompletedOnboarding: true
- onboardingCompletedAt: NOT NULL
- palette: 'darkGreen' (ou outra escolhida)

---

## 🎯 Automation TODO (opcional)

```typescript
// tests/e2e/onboarding.spec.ts
describe("Onboarding Flow", () => {
 test("should complete onboarding successfully", async ({ page }) => {
  await page.goto("/auth/sign-up");
  await page.fill("[name=email]", "test@example.com");
  await page.fill("[name=password]", "Test123!@#");
  await page.click("button[type=submit]");

  // Should redirect to onboarding
  await expect(page).toHaveURL("/onboarding");

  // Fill all steps...
  // Assert success
  await expect(page).toHaveURL("/protected/resume");
 });

 test("should prevent duplicate resumes", async ({ page }) => {
  // Test scenario 2...
 });

 test("should escape infinite loop after 3 attempts", async ({ page }) => {
  // Test scenario 3...
 });
});
```

---

## 🔥 Performance Benchmarks

```bash
# Onboarding deve completar em < 2s
ab -n 10 -c 1 \
  -H 'Cookie: next-auth.session-token=...' \
  -T 'application/json' \
  -p onboarding-payload.json \
  http://localhost:3000/api/onboarding

# Target: p95 < 2000ms
```

---

## ✅ Checklist Final

- [ ] Cenário 1: Novo usuário → ✅
- [ ] Cenário 2: OAuth user → ✅
- [ ] Cenário 3: Loop escape → ✅
- [ ] Cenário 4: Datas inválidas → ✅
- [ ] Cenário 5: Re-onboarding → ✅
- [ ] Database integrity → ✅
- [ ] Logs limpos → ✅
- [ ] Performance < 2s → ✅

---

**Uncle Bob:** _"The only way to go fast, is to go well"_ 🎯
