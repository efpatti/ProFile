#!/bin/bash

# ==================================
# ProFile - Quick Start Guide
# ==================================

cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🐳 ProFile - Docker Stack                              ║
║   Firebase → PostgreSQL + Redis + MinIO                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

📚 PASSOS PARA COMEÇAR:

1️⃣  Configurar Variáveis de Ambiente
   $ cp .env.docker .env
   $ nano .env

   Gerar secrets:
   $ openssl rand -base64 32  # NEXTAUTH_SECRET
   $ openssl rand -base64 32  # POSTGRES_PASSWORD
   $ openssl rand -base64 32  # REDIS_PASSWORD
   $ openssl rand -base64 32  # MINIO_ROOT_PASSWORD

2️⃣  Iniciar Stack Docker
   $ ./scripts/start.sh
   
   OU manualmente:
   $ docker-compose up -d
   $ docker-compose exec app npx prisma migrate deploy
   $ ./scripts/setup-minio.sh

3️⃣  Acessar Aplicação
   🌐 App:           http://localhost:3001
   🗄️  MinIO Console: http://localhost:9001
   🔍 Prisma Studio: docker-compose --profile dev up prisma-studio
                     http://localhost:5555

4️⃣  Configurar OAuth (Opcional)
   Google: https://console.cloud.google.com/apis/credentials
   GitHub: https://github.com/settings/developers
   
   Adicionar no .env:
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GITHUB_ID=...
   GITHUB_SECRET=...

═══════════════════════════════════════════════════════════

🔧 COMANDOS ÚTEIS:

   Logs:
   $ docker-compose logs -f
   $ docker-compose logs -f app

   Status:
   $ docker-compose ps
   
   Restart:
   $ docker-compose restart
   $ docker-compose restart app

   Parar tudo:
   $ docker-compose down

   Rebuild:
   $ docker-compose build app
   $ docker-compose up -d app

   PostgreSQL:
   $ docker-compose exec postgres psql -U profile_user -d profile_db

   Redis:
   $ docker-compose exec redis redis-cli -a seu_password

   Backup:
   $ docker-compose exec postgres pg_dump -U profile_user profile_db > backup.sql

═══════════════════════════════════════════════════════════

📊 ESTRUTURA:

   PostgreSQL (5432)  → Auth + Currículos
   Redis (6379)       → Cache + Sessões
   MinIO (9000/9001)  → Storage S3
   Next.js (3000)     → Aplicação Web

═══════════════════════════════════════════════════════════

📚 DOCUMENTAÇÃO:

   docs/SUMMARY-MIGRATION.md              → Sumário da migração
   docs/DOCKER-SETUP.md                   → Guia completo Docker
   docs/MIGRATION-NEXTAUTH.md             → Migração NextAuth
   docs/MIGRATION-FIREBASE-TO-DOCKER.md   → Migração completa

═══════════════════════════════════════════════════════════

🎯 PRÓXIMOS PASSOS:

   [ ] Configurar .env
   [ ] Executar ./scripts/start.sh
   [ ] Testar autenticação
   [ ] Testar criação de currículo
   [ ] Configurar OAuth providers
   [ ] Migrar dados do Firebase (se houver)

═══════════════════════════════════════════════════════════

💡 DICA: Execute './scripts/start.sh' para começar!

EOF
