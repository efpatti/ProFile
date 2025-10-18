# 🐳 Como Rodar o ProFile com Docker

## Pré-requisitos

- ✅ Docker instalado
- ✅ Docker Compose instalado

## 🚀 Comandos para Rodar Localmente

### 1. Configurar variáveis de ambiente

Certifique-se que o arquivo `.env.local` existe com as variáveis:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/profile_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"

# Se usar MinIO/S3
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="profile-assets"
```

### 2. Subir os serviços

```bash
# Subir todos os containers (PostgreSQL + MinIO + Aplicação)
docker-compose up -d

# Ou subir apenas o banco de dados
docker-compose up -d postgres

# Ou subir apenas o MinIO (storage)
docker-compose up -d minio
```

### 3. Verificar se os containers estão rodando

```bash
docker-compose ps
```

Você deve ver:

```
NAME                SERVICE      STATUS        PORTS
profile-postgres    postgres     running       5432:5432
profile-minio       minio        running       9000-9001:9000-9001
```

### 4. Inicializar o banco de dados

```bash
# Rodar migrations do Prisma
npx prisma migrate dev

# Ou se já tiver migrations prontas
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate

# (Opcional) Seed do banco
npm run seed
```

### 5. Rodar a aplicação Next.js

```bash
# Desenvolvimento
npm run dev

# Ou rodar tudo com Docker Compose (incluindo Next.js)
docker-compose up --build
```

## 📊 Acessar os Serviços

- **Aplicação Next.js**: http://localhost:3000
- **PostgreSQL**: `localhost:5432`
  - User: `postgres`
  - Password: `postgres`
  - Database: `profile_db`
- **MinIO Console**: http://localhost:9001
  - User: `minioadmin`
  - Password: `minioadmin`
- **Prisma Studio**: `npx prisma studio` → http://localhost:5555

## 🛠️ Comandos Úteis

### Ver logs dos containers

```bash
# Todos os containers
docker-compose logs -f

# Apenas PostgreSQL
docker-compose logs -f postgres

# Apenas MinIO
docker-compose logs -f minio
```

### Parar os containers

```bash
# Parar sem remover
docker-compose stop

# Parar e remover
docker-compose down

# Parar e remover INCLUINDO volumes (CUIDADO: apaga dados!)
docker-compose down -v
```

### Resetar banco de dados

```bash
# Parar e remover volumes
docker-compose down -v

# Subir novamente
docker-compose up -d postgres

# Rodar migrations
npx prisma migrate dev
```

### Executar comandos dentro dos containers

```bash
# Acessar PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d profile_db

# Acessar bash do container
docker-compose exec postgres bash
```

## 🔧 Troubleshooting

### Erro: "Port 5432 already in use"

Você já tem PostgreSQL rodando localmente. Opções:

1. Parar o PostgreSQL local:

```bash
sudo systemctl stop postgresql
```

2. Ou mudar a porta no `docker-compose.yml`:

```yaml
postgres:
 ports:
  - "5433:5432" # Usar porta 5433 no host
```

E atualizar `.env.local`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/profile_db?schema=public"
```

### Erro: "Permission denied" no MinIO

```bash
# Dar permissões corretas
sudo chown -R $USER:$USER ./data/minio
```

### Erro: localStorage.getItem is not a function

Esse erro acontece porque `localStorage` só existe no browser, não no servidor (SSR).

Solução temporária - adicionar verificação:

```typescript
// Antes
const value = localStorage.getItem("key");

// Depois
const value =
 typeof window !== "undefined" ? localStorage.getItem("key") : null;
```

## 📝 Estrutura do Docker Compose

```yaml
services:
 postgres: # Banco de dados PostgreSQL
 minio: # Object storage (S3-compatible)
 app: # Aplicação Next.js (opcional)
```

## 🎯 Fluxo Recomendado para Desenvolvimento

```bash
# 1. Subir apenas infra (DB + Storage)
docker-compose up -d postgres minio

# 2. Rodar migrations
npx prisma migrate dev

# 3. Rodar app localmente (mais rápido para desenvolvimento)
npm run dev

# 4. Quando precisar, parar tudo
docker-compose down
```

## 🚢 Para Deploy em Produção

```bash
# Build da aplicação
docker-compose build

# Subir em modo produção
docker-compose up -d

# Ver logs
docker-compose logs -f app
```

---

**🎩 Pronto! Agora você tem ambiente Docker completo rodando localmente!**
