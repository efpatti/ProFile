#!/bin/bash

set -e

echo "🏗️  REORGANIZAÇÃO SOLID - ProFile"
echo "=================================="
echo ""
echo "⚠️  ATENÇÃO: Este script vai reorganizar completamente a estrutura do projeto!"
echo "Pressione CTRL+C para cancelar ou ENTER para continuar..."
read

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📁 Criando nova estrutura de diretórios...${NC}"

# ============================================
# DOMAIN LAYER
# ============================================
echo -e "${GREEN}✓${NC} Criando Domain Layer..."

# Resume Bounded Context
mkdir -p src/domain/resume/{entities,value-objects,repositories,services,errors}

# User Bounded Context  
mkdir -p src/domain/user/{entities,value-objects,repositories,errors}

# Export Bounded Context
mkdir -p src/domain/export/{entities,value-objects,services,errors}

# Shared Kernel
mkdir -p src/domain/shared/{value-objects,errors,types}

# ============================================
# APPLICATION LAYER
# ============================================
echo -e "${GREEN}✓${NC} Criando Application Layer..."

# Resume Use Cases
mkdir -p src/application/resume/{commands/{CreateResume,UpdateResume,DeleteResume},queries/{GetResume,ListResumes},events}

# Export Use Cases
mkdir -p src/application/export/{commands/{ExportToPDF,ExportToDOCX,ExportToBanner},queries/GetExportStatus}

# Shared
mkdir -p src/application/shared

# ============================================
# INFRASTRUCTURE LAYER
# ============================================
echo -e "${GREEN}✓${NC} Criando Infrastructure Layer..."

# Persistence
mkdir -p src/infrastructure/persistence/prisma/{repositories,mappers}
mkdir -p src/infrastructure/persistence/cache

# Storage
mkdir -p src/infrastructure/storage

# Export
mkdir -p src/infrastructure/export

# Auth
mkdir -p src/infrastructure/auth

# Config
mkdir -p src/infrastructure/config

# ============================================
# PRESENTATION LAYER
# ============================================
echo -e "${GREEN}✓${NC} Criando Presentation Layer..."

# Web (Next.js)
mkdir -p src/presentation/web/components/{resume,shared,layout}
mkdir -p src/presentation/web/hooks
mkdir -p src/presentation/web/providers

# API
mkdir -p src/presentation/api/{controllers,middleware,validators}

# ============================================
# TESTS
# ============================================
echo -e "${GREEN}✓${NC} Criando estrutura de testes..."

mkdir -p src/tests/unit/{domain,application}
mkdir -p src/tests/integration/infrastructure
mkdir -p src/tests/e2e/presentation

# ============================================
# BACKUP OLD STRUCTURE
# ============================================
echo -e "${YELLOW}📦 Fazendo backup da estrutura antiga...${NC}"

mkdir -p .backup/$(date +%Y%m%d_%H%M%S)
cp -r src/core .backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
cp -r src/components .backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
cp -r src/infrastructure .backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
cp -r src/presentation .backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

echo -e "${GREEN}✓${NC} Backup criado em .backup/"

# ============================================
# CRIAR ARQUIVOS INDEX
# ============================================
echo -e "${BLUE}📝 Criando arquivos index.ts...${NC}"

# Domain
find src/domain -type d -not -path "*/.*" -exec sh -c 'echo "export {};" > "$1/index.ts" 2>/dev/null || true' _ {} \;

# Application
find src/application -type d -not -path "*/.*" -exec sh -c 'echo "export {};" > "$1/index.ts" 2>/dev/null || true' _ {} \;

# Infrastructure
find src/infrastructure -type d -not -path "*/.*" -exec sh -c 'echo "export {};" > "$1/index.ts" 2>/dev/null || true' _ {} \;

echo -e "${GREEN}✓${NC} Arquivos index criados"

# ============================================
# SUMMARY
# ============================================
echo ""
echo "═══════════════════════════════════════════════════"
echo -e "${GREEN}🎉 Estrutura SOLID criada com sucesso!${NC}"
echo "═══════════════════════════════════════════════════"
echo ""
echo "📊 Nova estrutura:"
tree -L 3 -I 'node_modules|.next|.git|.backup' src/
echo ""
echo "📝 Próximos passos:"
echo "  1. Migrar entities para src/domain/[context]/entities/"
echo "  2. Migrar value objects para src/domain/[context]/value-objects/"
echo "  3. Migrar repositories para src/infrastructure/persistence/"
echo "  4. Migrar use cases para src/application/[context]/commands/"
echo "  5. Executar testes"
echo ""
echo "📚 Ver documentação: docs/SOLID-REORGANIZATION.md"
echo ""
