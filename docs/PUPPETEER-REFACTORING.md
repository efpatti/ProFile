# PuppeteerService Refactoring - SRP Implementation

## 📋 Overview

Refatoração completa seguindo **Single Responsibility Principle (SRP)** de Uncle Bob.

### ANTES (God Class Anti-Pattern)

```
PuppeteerService.ts - 311 linhas
├── Browser lifecycle management
├── Banner screenshot capture
├── Resume PDF generation
└── Palette utility methods
```

**Violações:**

- ❌ Múltiplas responsabilidades em uma classe
- ❌ Código duplicado em navegação/setup
- ❌ Difícil de testar isoladamente
- ❌ Difícil de manter (mudança em banner afeta PDF)

### DEPOIS (SRP Compliant)

```
src/core/services/
├── BrowserManager.ts          (62 linhas)  - Singleton pattern
├── BannerCaptureService.ts    (205 linhas) - Screenshot capture
├── ResumePDFService.ts        (237 linhas) - PDF generation
├── PuppeteerService.ts        (74 linhas)  - Facade pattern
└── index.ts                   (11 linhas)  - Clean exports

Total: 589 linhas vs 311 (mais código, mas melhor arquitetura)
```

**Benefícios:**

- ✅ Cada serviço tem UMA responsabilidade
- ✅ Código modular e reutilizável
- ✅ Fácil de testar (mock de dependências)
- ✅ Fácil de manter (mudanças isoladas)
- ✅ Backward compatibility mantida

---

## 🏗️ Arquitetura

### 1. BrowserManager (Singleton)

**Responsabilidade:** Gerenciar ciclo de vida do browser Puppeteer

```typescript
// Singleton instance compartilhada
const browserManager = BrowserManager.getInstance();

// Métodos
await browserManager.getBrowser(); // Obtém/cria browser
await browserManager.closeBrowser(); // Fecha browser
browserManager.isActive(); // Verifica status
```

**Pattern:** Singleton  
**Benefício:** Reutiliza browser entre capturas (performance)

---

### 2. BannerCaptureService

**Responsabilidade:** Capturar screenshots de banners em alta qualidade

**Método público:**

```typescript
const buffer = await BannerCaptureService.capture(palette, logoUrl);
```

**Métodos privados (decomposição):**

- `setupPage()` - Configura viewport alta resolução
- `buildBannerUrl()` - Constrói URL com BannerService
- `navigateToPage()` - Navegação com error handling
- `waitForBannerReady()` - Aguarda renderização completa
- `debugBannerError()` - Debug quando falha
- `waitForLogo()` - Aguarda logo carregar
- `waitForCodeBlock()` - Aguarda code block renderizar
- `applyQualityStyles()` - Aplica antialiasing CSS
- `captureBannerElement()` - Screenshot final

**Pattern:** Template Method (métodos privados orquestrados)  
**Benefício:** Cada step é testável e documentado

---

### 3. ResumePDFService

**Responsabilidade:** Gerar PDFs de currículos com layout perfeito

**Método público:**

```typescript
const buffer = await ResumePDFService.generate({
 palette: "sunset",
 lang: "pt-br",
 bannerColor: "#ff6b6b",
 userId: "123",
});
```

**Métodos privados (decomposição):**

- `setupPage()` - Configura viewport PDF
- `buildResumeUrl()` - Constrói URL com query params
- `navigateToPage()` - Navegação com error handling
- `waitForResumeReady()` - Aguarda data-ready="1"
- `extractStyles()` - Extrai link/style tags + CSS vars
- `renderCleanPage()` - Renderiza página limpa (só #resume)
- `generatePDF()` - Gera PDF com dimensões calculadas
- `calculateContentHeight()` - Calcula altura exata em mm

**Pattern:** Template Method + Builder  
**Benefício:** Controle fino sobre cada etapa do PDF

---

### 4. PuppeteerService (Facade)

**Responsabilidade:** Interface de compatibilidade + utility methods

```typescript
// Backward compatibility
PuppeteerService.captureBanner(palette, logoUrl);
PuppeteerService.captureResumePDF(palette, lang, color, userId);
PuppeteerService.getPaletteInfo(palette);
```

**Pattern:** Facade  
**Benefício:** Código existente continua funcionando sem mudanças

---

## 📊 Métricas

### Antes

- **1 arquivo**: 311 linhas
- **1 classe**: 3 responsabilidades
- **Cyclomatic Complexity**: Alta (muitos if/try/catch aninhados)
- **Testability**: Baixa (tudo acoplado)

### Depois

- **5 arquivos**: 589 linhas (mais modular)
- **3 classes**: 1 responsabilidade cada
- **Cyclomatic Complexity**: Baixa (métodos pequenos)
- **Testability**: Alta (dependências injetáveis)

### Redução em PuppeteerService.ts

```
311 linhas → 74 linhas = 76% de redução
```

---

## 🧪 Como Testar

### BrowserManager

```typescript
describe("BrowserManager", () => {
 it("should return singleton instance", () => {
  const instance1 = BrowserManager.getInstance();
  const instance2 = BrowserManager.getInstance();
  expect(instance1).toBe(instance2);
 });

 it("should reuse browser instance", async () => {
  const browser1 = await browserManager.getBrowser();
  const browser2 = await browserManager.getBrowser();
  expect(browser1).toBe(browser2);
 });
});
```

### BannerCaptureService (com mock)

```typescript
describe("BannerCaptureService", () => {
 it("should capture banner with correct viewport", async () => {
  jest.spyOn(browserManager, "getBrowser").mockResolvedValue(mockBrowser);

  const buffer = await BannerCaptureService.capture("sunset", "");

  expect(mockPage.setViewport).toHaveBeenCalledWith({
   width: 1584,
   height: 396,
   deviceScaleFactor: 2,
  });
 });
});
```

---

## 🔄 Migration Guide

### Opção 1: Continuar usando PuppeteerService (zero mudanças)

```typescript
// Código existente continua funcionando
const banner = await PuppeteerService.captureBanner(palette, logo);
const pdf = await PuppeteerService.captureResumePDF(palette, lang);
```

### Opção 2: Migrar para serviços especializados (recomendado)

```typescript
// ANTES
import { PuppeteerService } from "@/core/services/PuppeteerService";
const banner = await PuppeteerService.captureBanner(palette, logo);

// DEPOIS
import { BannerCaptureService } from "@/core/services";
const banner = await BannerCaptureService.capture(palette, logo);
```

### Opção 3: Usar index.ts (clean imports)

```typescript
import {
 BannerCaptureService,
 ResumePDFService,
 closeBrowser,
} from "@/core/services";

const banner = await BannerCaptureService.capture(palette, logo);
const pdf = await ResumePDFService.generate({ palette, lang });
await closeBrowser();
```

---

## ✅ Checklist Uncle Bob

- [x] **SRP**: Cada classe com 1 responsabilidade
- [x] **OCP**: Aberto para extensão, fechado para modificação
- [x] **DIP**: Dependências através de abstrações (Page interface)
- [x] **Métodos pequenos**: Cada método faz UMA coisa
- [x] **Naming**: Nomes descritivos (waitForBannerReady, calculateContentHeight)
- [x] **No comments needed**: Código auto-documentado
- [x] **Error handling**: Try/catch com debug screenshots
- [x] **Constants**: VIEWPORT, TIMEOUT, DEBUG_PATH extraídos

---

## 🎯 Próximos Passos

1. **Escrever testes** (T1 - CRÍTICO)

   - BrowserManager.test.ts
   - BannerCaptureService.test.ts
   - ResumePDFService.test.ts

2. **Extrair PaletteUtilityService**

   - Mover `getPaletteInfo()` para serviço separado
   - Remover último método não-Puppeteer do PuppeteerService

3. **Type Safety**
   - Criar interface IPuppeteerService
   - Dependency Injection via constructor

---

## 📖 Referências

- **Clean Code** (Uncle Bob Martin) - Capítulo 10: Classes
- **SOLID Principles** - Single Responsibility Principle
- **Design Patterns** - Singleton, Facade, Template Method
