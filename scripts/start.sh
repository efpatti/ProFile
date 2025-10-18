#!/bin/bash

# ==================================
# ProFile - Inicialização Completa
# ==================================

set -e

echo "🚀 Starting ProFile setup..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se .env existe
if [ ! -f .env ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo "📝 Copie o .env.docker para .env e configure as variáveis:"
    echo "   cp .env.docker .env"
    echo "   nano .env"
    exit 1
fi

echo -e "${GREEN}✅ Arquivo .env encontrado${NC}"

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando!${NC}"
    echo "Inicie o Docker e tente novamente."
    exit 1
fi

echo -e "${GREEN}✅ Docker está rodando${NC}"

# Subir containers
echo ""
echo "🐳 Iniciando containers Docker..."
docker-compose up -d

# Aguardar PostgreSQL estar pronto
echo ""
echo "⏳ Aguardando PostgreSQL..."
until docker-compose exec -T postgres pg_isready -U profile_user > /dev/null 2>&1; do
    sleep 2
done
echo -e "${GREEN}✅ PostgreSQL pronto!${NC}"

# Aguardar Redis estar pronto
echo ""
echo "⏳ Aguardando Redis..."
until docker-compose exec -T redis redis-cli -a ${REDIS_PASSWORD:-redis_password_change_me} PING > /dev/null 2>&1; do
    sleep 2
done
echo -e "${GREEN}✅ Redis pronto!${NC}"

# Aguardar MinIO estar pronto
echo ""
echo "⏳ Aguardando MinIO..."
until curl -sf http://localhost:9000/minio/health/live > /dev/null 2>&1; do
    sleep 2
done
echo -e "${GREEN}✅ MinIO pronto!${NC}"

# Executar migrations do Prisma
echo ""
echo "📊 Executando migrations do Prisma..."
docker-compose exec -T app npx prisma migrate deploy

# Gerar Prisma Client
echo ""
echo "🔧 Gerando Prisma Client..."
docker-compose exec -T app npx prisma generate

# Setup MinIO (criar buckets)
echo ""
echo "🪣 Configurando buckets no MinIO..."
./scripts/setup-minio.sh

# Verificar health da aplicação
echo ""
echo "🏥 Verificando saúde da aplicação..."
sleep 5
if curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Aplicação está saudável!${NC}"
else
    echo -e "${YELLOW}⚠️  Aplicação ainda está iniciando...${NC}"
fi

# Sumário
echo ""
echo "═══════════════════════════════════════════════════"
echo -e "${GREEN}🎉 ProFile iniciado com sucesso!${NC}"
echo "═══════════════════════════════════════════════════"
echo ""
echo "📱 Acessos:"
echo "   🌐 Aplicação:      http://localhost:3001"
echo "   🗄️  MinIO Console:  http://localhost:9001"
echo "   🔍 Prisma Studio:  docker-compose --profile dev up prisma-studio"
echo ""
echo "🛠️  Comandos úteis:"
echo "   Ver logs:         docker-compose logs -f"
echo "   Parar:            docker-compose down"
echo "   Restart:          docker-compose restart"
echo "   Prisma Studio:    docker-compose --profile dev up prisma-studio"
echo ""
echo "📚 Documentação: docs/DOCKER-SETUP.md"
echo ""
