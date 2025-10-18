# 🚀 ProFile - Gerador Profissional de Currículos

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Uma plataforma web moderna e **100% self-hosted** para criar currículos profissionais e banners do LinkedIn personalizados.

## ✨ Características

- 🎨 **3 Templates Profissionais** de currículo
- 📱 **Perfis Públicos** em `profile.app/username`
- 🖼️ **Gerador de Banners LinkedIn** personalizados
- 📄 **Export em PDF e DOCX**
- 🔐 **Autenticação Segura** com Google e GitHub
- 🐳 **100% Self-Hosted** com Docker
- 🎯 **Clean Architecture** com SOLID principles
- 🚀 **Performance Otimizada**

## 🏗️ Arquitetura

### Stack Tecnológica

**Frontend:**

- Next.js 15 (App Router)
- React 19
- TypeScript 5.8
- TailwindCSS v4
- Framer Motion

**Backend:**

- PostgreSQL 16 (Prisma ORM)
- Redis 7 (Cache)
- MinIO (S3-compatible storage)
- NextAuth (Autenticação)

**Infraestrutura:**

- Docker Compose
- Multi-stage builds
- Health checks
- Volumes persistentes

### Arquitetura Limpa

```
src/
├── core/                    # Domain Layer
│   ├── entities/           # Business entities
│   ├── interfaces/         # Contracts
│   └── use-cases/          # Business logic
├── infrastructure/          # Infrastructure Layer
│   ├── repositories/       # Data access
│   └── services/           # External services
└── presentation/            # Presentation Layer
    ├── components/         # UI components
    ├── hooks/              # React hooks
    └── stores/             # State management
```

## 🚀 Quick Start

### Opção 1: Docker (Recomendado)

```bash
# 1. Clonar repositório
git clone https://github.com/efpatti/ProFile.git
cd ProFile

# 2. Ver guia rápido
./QUICKSTART.sh

# 3. Configurar ambiente
cp .env.docker .env
nano .env  # Editar com seus valores

# 4. Gerar secrets
openssl rand -base64 32  # Para cada senha

# 5. Iniciar stack
./scripts/start.sh
```

**Acessos:**

- 🌐 App: http://localhost:3001
- 🗄️ MinIO Console: http://localhost:9001
- 🔍 Prisma Studio: `docker-compose --profile dev up prisma-studio`

### Opção 2: Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Subir apenas infraestrutura
docker-compose up -d postgres redis minio

# Configurar .env.local
DATABASE_URL="postgresql://profile_user:password@localhost:5432/profile_db"

# Migrations
npx prisma migrate dev

# Rodar aplicação
npm run dev
```

## 📦 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (hot reload)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run typecheck    # Verificar tipos TypeScript
npm run lint         # Lint com ESLint
npm run lint:fix     # Fix automático de lint
npm run analyze      # Análise de bundle
```

## 🐳 Docker Commands

```bash
# Iniciar stack completa
./scripts/start.sh

# Ver logs
docker-compose logs -f

# Restart aplicação
docker-compose restart app

# Parar tudo
docker-compose down

# Backup banco
docker-compose exec postgres pg_dump -U profile_user profile_db > backup.sql

# Prisma Studio
docker-compose --profile dev up prisma-studio
```

## 📚 Documentação

- [📋 Sumário da Migração](docs/SUMMARY-MIGRATION.md) - Visão geral da migração Firebase → Docker
- [🐳 Docker Setup](docs/DOCKER-SETUP.md) - Guia completo Docker
- [🔐 NextAuth Migration](docs/MIGRATION-NEXTAUTH.md) - Migração de autenticação
- [🔄 Firebase → Docker](docs/MIGRATION-FIREBASE-TO-DOCKER.md) - Migração completa

## 🏗️ Estrutura do Projeto

```
ProFile/
├── docker-compose.yml           # Orquestração Docker
├── Dockerfile                   # Build da aplicação
├── prisma/
│   └── schema.prisma           # Schema do banco
├── src/
│   ├── app/                    # Next.js App Router
│   ├── core/                   # Domain Layer
│   ├── infrastructure/         # Data Layer
│   ├── presentation/           # UI Layer
│   └── lib/                    # Utilities
├── scripts/
│   ├── start.sh               # Inicialização automatizada
│   └── setup-minio.sh         # Setup de storage
└── docs/                       # Documentação
```

## 🔐 Configuração OAuth

### Google OAuth

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Crie um novo projeto
3. Configure OAuth consent screen
4. Crie credenciais OAuth 2.0
5. Adicione redirect URI: `http://localhost:3001/api/auth/callback/google`
6. Copie Client ID e Secret para `.env`

### GitHub OAuth

1. Acesse: https://github.com/settings/developers
2. New OAuth App
3. Configure callback: `http://localhost:3001/api/auth/callback/github`
4. Copie Client ID e Secret para `.env`

## 🚢 Deploy em Produção

### VPS (Ubuntu/Debian)

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clonar projeto
git clone https://github.com/efpatti/ProFile.git
cd ProFile

# Configurar .env para produção
cp .env.docker .env
nano .env

# Iniciar
./scripts/start.sh

# Configurar nginx + SSL
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d profile.app
```

Ver guia completo: [docs/DOCKER-SETUP.md#deploy-em-produção](docs/DOCKER-SETUP.md)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Ver arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 Roadmap

- [x] Clean Architecture
- [x] Docker Stack completa
- [x] PostgreSQL + Prisma
- [x] NextAuth com OAuth
- [x] MinIO (S3) storage
- [x] Export PDF/DOCX
- [ ] Testes E2E
- [ ] CI/CD com GitHub Actions
- [ ] Monitoring (Prometheus + Grafana)
- [ ] Multi-language support
- [ ] Mais templates de currículo

## 👨‍💻 Autor

**Eduardo Patti**

- GitHub: [@efpatti](https://github.com/efpatti)
- Website: [profile.app](https://profile.app)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
