#!/bin/bash

# ==================================
# Setup MinIO for ProFile
# ==================================

set -e

echo "🪣 Setting up MinIO buckets..."

# Aguardar MinIO estar pronto
until curl -sf http://localhost:9000/minio/health/live > /dev/null 2>&1; do
    echo "⏳ Waiting for MinIO to be ready..."
    sleep 2
done

echo "✅ MinIO is ready!"

# Configurar alias do MinIO
mc alias set local http://localhost:9000 ${MINIO_ROOT_USER:-minioadmin} ${MINIO_ROOT_PASSWORD:-minioadmin}

# Criar bucket para currículos
if ! mc ls local/profile-resumes > /dev/null 2>&1; then
    echo "📦 Creating bucket: profile-resumes"
    mc mb local/profile-resumes
    
    # Configurar política de acesso (público para leitura)
    mc anonymous set download local/profile-resumes
    
    echo "✅ Bucket created successfully!"
else
    echo "✅ Bucket profile-resumes already exists"
fi

# Criar bucket para uploads temporários
if ! mc ls local/profile-temp > /dev/null 2>&1; then
    echo "📦 Creating bucket: profile-temp"
    mc mb local/profile-temp
    
    # Configurar lifecycle (deletar arquivos após 24h)
    cat > /tmp/lifecycle.json <<EOF
{
    "Rules": [
        {
            "ID": "DeleteOldTempFiles",
            "Status": "Enabled",
            "Expiration": {
                "Days": 1
            }
        }
    ]
}
EOF
    mc ilm import local/profile-temp < /tmp/lifecycle.json
    
    echo "✅ Temp bucket created with lifecycle policy!"
else
    echo "✅ Bucket profile-temp already exists"
fi

# Criar bucket para banners do LinkedIn
if ! mc ls local/profile-banners > /dev/null 2>&1; then
    echo "📦 Creating bucket: profile-banners"
    mc mb local/profile-banners
    mc anonymous set download local/profile-banners
    echo "✅ Banners bucket created!"
else
    echo "✅ Bucket profile-banners already exists"
fi

echo ""
echo "🎉 MinIO setup completed!"
echo "📊 Buckets:"
mc ls local

echo ""
echo "🔗 Access MinIO Console: http://localhost:9001"
echo "   User: ${MINIO_ROOT_USER:-minioadmin}"
echo "   Pass: ${MINIO_ROOT_PASSWORD:-minioadmin}"
