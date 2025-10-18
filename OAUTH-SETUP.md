# 🔐 Configuração OAuth - Google Cloud Console

## URIs de Redirecionamento Autorizados

Para configurar o Google OAuth, adicione as seguintes URIs no Google Cloud Console:

### 📍 **Desenvolvimento Local**

```
http://localhost:3000/api/auth/callback/google
```

### 🌐 **Produção** (quando fizer deploy)

```
https://seu-dominio.com/api/auth/callback/google
```

---

## 📋 Passo a Passo - Google Cloud Console

### 1️⃣ Acesse o Console

- Vá para: https://console.cloud.google.com/apis/credentials
- Selecione ou crie um projeto

### 2️⃣ Crie Credenciais OAuth 2.0

1. Clique em **"Criar credenciais"** → **"ID do cliente OAuth"**
2. Tipo de aplicativo: **"Aplicativo da Web"**
3. Nome: `ProFile - Desenvolvimento` (ou outro nome descritivo)

### 3️⃣ Configure as URIs

**Origens JavaScript autorizadas:**

```
http://localhost:3000
https://seu-dominio.com (quando fizer deploy)
```

**URIs de redirecionamento autorizadas:**

```
http://localhost:3000/api/auth/callback/google
https://seu-dominio.com/api/auth/callback/google (quando fizer deploy)
```

### 4️⃣ Copie as Credenciais

Após criar, você receberá:

- **Client ID** - Cole no `.env.local` como `GOOGLE_CLIENT_ID`
- **Client Secret** - Cole no `.env.local` como `GOOGLE_CLIENT_SECRET`

---

## 🔧 Arquivo .env.local

Adicione estas linhas ao seu `.env.local`:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="seu-client-id-aqui.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret-aqui"
```

---

## ✅ Verificação

Após configurar, teste acessando:

```
http://localhost:3000/api/auth/signin
```

Você deverá ver o botão "Sign in with Google" funcionando.

---

## 🚨 Problemas Comuns

### Erro: "redirect_uri_mismatch"

- **Causa**: A URI de redirecionamento não está configurada no Google Console
- **Solução**: Verifique se adicionou EXATAMENTE `http://localhost:3000/api/auth/callback/google`

### Erro: "invalid_client"

- **Causa**: Client ID ou Secret incorretos
- **Solução**: Verifique se copiou corretamente para o `.env.local`

### NextAuth não encontra variáveis

- **Causa**: `.env.local` não está sendo lido
- **Solução**: Reinicie o servidor (`npm run dev`)

---

## 📚 Links Úteis

- [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [NextAuth.js Docs - Google Provider](https://next-auth.js.org/providers/google)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
