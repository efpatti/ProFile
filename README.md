# Profile Application

Aplicação full-stack para gerenciamento de perfis profissionais, com backend em NestJS e frontend em Next.js.

## 🏗️ Arquitetura

Este projeto está organizado em uma arquitetura de microserviços com:

- **Backend (NestJS)**: API REST em `/backend`
- **Frontend (Next.js)**: Interface do usuário em `/frontend`
- **PostgreSQL**: Banco de dados relacional
- **Redis**: Cache e sessões

## 🐳 Docker Setup

A aplicação utiliza Docker Compose com 4 containers:

1. **PostgreSQL** - Banco de dados
2. **Redis** - Cache e sessões
3. **Backend** - API NestJS (porta 3001)
4. **Frontend** - Next.js (porta 3000)

### Pré-requisitos

- Docker (>= 20.10)
- Docker Compose (>= 2.0)

### Configuração Inicial

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd profile
   ```

2. **Configure as variáveis de ambiente**

   Copie os arquivos de exemplo e ajuste conforme necessário:
   ```bash
   # Raiz do projeto (para Docker Compose)
   cp .env.example .env

   # Backend
   cp backend/.env.example backend/.env

   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Gere secrets seguros**
   ```bash
   # Para JWT_SECRET
   openssl rand -base64 32

   # Para NEXTAUTH_SECRET
   openssl rand -base64 32
   ```

   **Ou use o Makefile para setup automático:**
   ```bash
   make setup
   ```

### 🎯 Comandos Rápidos (Makefile)

Para facilitar o uso, criamos um Makefile com comandos simplificados:

```bash
# Ver todos os comandos disponíveis
make help

# Desenvolvimento
make dev              # Iniciar ambiente de desenvolvimento
make dev-build        # Build e iniciar desenvolvimento
make dev-logs         # Ver logs do desenvolvimento

# Produção
make prod             # Iniciar ambiente de produção
make prod-build       # Build e iniciar produção

# Database
make db-migrate       # Executar migrações
make db-studio        # Abrir Prisma Studio
make db-backup        # Backup do banco

# Acessar containers
make backend-shell    # Shell do backend
make frontend-shell   # Shell do frontend
make postgres-shell   # PostgreSQL CLI
make redis-shell      # Redis CLI

# Utilitários
make status           # Status dos containers
make logs             # Ver todos os logs
make clean            # Limpar containers e volumes
```

### Comandos Docker (Manual)

#### Iniciar todos os serviços

```bash
# Build e start de todos os containers
docker-compose up --build

# Ou em modo detached (background)
docker-compose up -d --build
```

#### Verificar status dos containers

```bash
docker-compose ps
```

#### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f redis
```

#### Parar os serviços

```bash
# Parar containers
docker-compose stop

# Parar e remover containers
docker-compose down

# Parar, remover containers e volumes (CUIDADO: apaga dados!)
docker-compose down -v
```

#### Executar comandos nos containers

```bash
# Backend
docker-compose exec backend npm run migration:run
docker-compose exec backend npm test

# Frontend
docker-compose exec frontend npx prisma migrate dev
docker-compose exec frontend npx prisma studio

# PostgreSQL
docker-compose exec postgres psql -U postgres -d profile

# Redis CLI
docker-compose exec redis redis-cli
```

#### Rebuild de um serviço específico

```bash
docker-compose up -d --build --no-deps backend
docker-compose up -d --build --no-deps frontend
```

### Estrutura de Portas

| Serviço    | Porta Host | Porta Container |
|------------|------------|-----------------|
| Frontend   | 3000       | 3000            |
| Backend    | 3001       | 3001            |
| PostgreSQL | 5432       | 5432            |
| Redis      | 6379       | 6379            |

### Acessando a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

## 🛠️ Desenvolvimento Local (sem Docker)

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Database Migrations

```bash
# Frontend (onde está o Prisma)
cd frontend
npx prisma migrate dev
npx prisma generate
```

## 📁 Estrutura do Projeto

```
profile/
├── backend/                 # NestJS Backend
│   ├── src/
│   ├── test/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   ├── public/
│   ├── prisma/            # Prisma Schema & Migrations
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── docker-compose.yml     # Orquestração dos containers
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore
└── README.md
```

## 🔧 Troubleshooting

### Container não inicia

```bash
# Verificar logs
docker-compose logs <service-name>

# Rebuild completo
docker-compose down -v
docker-compose up --build
```

### Problemas de permissão com volumes

```bash
# Linux: ajustar permissões
sudo chown -R $USER:$USER volumes/
```

### Database connection issues

Verifique se:
1. O container do PostgreSQL está rodando: `docker-compose ps`
2. As variáveis de ambiente estão corretas no `.env`
3. A `DATABASE_URL` está usando `postgres` como hostname (nome do service no Docker)

### Redis connection issues

```bash
# Testar conexão Redis
docker-compose exec redis redis-cli ping
# Deve retornar: PONG
```

## 📝 Scripts Úteis

### Backup do Banco de Dados

```bash
docker-compose exec postgres pg_dump -U postgres profile > backup.sql
```

### Restaurar Banco de Dados

```bash
docker-compose exec -T postgres psql -U postgres profile < backup.sql
```

### Limpar tudo e começar do zero

```bash
# CUIDADO: Isso apaga todos os dados!
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## 🚀 Deploy

Para deploy em produção, considere:

1. Usar variáveis de ambiente seguras
2. Configurar SSL/TLS
3. Usar um serviço de banco de dados gerenciado
4. Configurar backup automático
5. Implementar logging centralizado
6. Configurar monitoramento e alertas

## 📄 Licença

[Sua licença aqui]

## 👥 Contribuindo

[Instruções de contribuição]
