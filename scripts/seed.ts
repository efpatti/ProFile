const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const dotenv = require("dotenv");

// --- CONFIGURAÇÃO ---
// Carrega as variáveis de ambiente
dotenv.config({ path: ".env.local" });

// Carrega a chave da conta de serviço
const serviceAccount = require("../serviceAccountKey.json");

// Inicializa o Admin SDK
admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
});

// 2. Defina o ID do usuário para o qual os dados serão enviados.
const USER_ID = "8m37qusnbDa5XuNzqReDTdM1Cgs1"; // Substitua pelo UID do usuário alvo

// --- SCRIPT DE MIGRAÇÃO ---
const db = getFirestore();

async function seedHeaderOnly() {
 try {
  console.log(`Adicionando apenas a seção 'header' para o usuário: ${USER_ID}`);
  const batch = admin.firestore().batch();

  // Para cada idioma, cria header e subcoleção contacts
  const langs = ["pt-br", "en"];
  for (const lang of langs) {
   let headerData: any = {};
   if (lang === "pt-br") {
    headerData = {
     subtitle:
      "Desenvolvedor Web | Técnico em Desenvolvimento de Sistemas | Estudante de Ciência da Computação",
    };
   } else if (lang === "en") {
    headerData = {
     subtitle:
      "Web Developer | Software Development Technician | Computer Science Student",
    };
   }

   // Cria o documento header
   const headerRef = admin
    .firestore()
    .collection(`users/${USER_ID}/header`)
    .doc(lang);
   batch.set(headerRef, { ...headerData, language: lang });

   // Cria a subcoleção contacts dentro de header
   const contacts = [
    {
     icon: "FaEnvelope",
     text: "efpatti.dev@gmail.com",
     href: "mailto:efpatti.dev@gmail.com",
    },
    {
     icon: "FaPhoneAlt",
     text: "+55 (11) 97883-3101",
     href: "tel:+5511978833101",
    },
    {
     icon: "FaLinkedin",
     text: "linkedin.com/in/efpatti",
     href: "https://linkedin.com/in/efpatti",
    },
    {
     icon: "FaGithub",
     text: "github.com/efpatti",
     href: "https://github.com/efpatti",
    },
   ];
   contacts.forEach((contact, idx) => {
    const contactRef = admin
     .firestore()
     .collection(`users/${USER_ID}/header/${lang}/contacts`)
     .doc();
    batch.set(contactRef, { ...contact, order: idx + 1 });
   });

   console.log(`- Header (${lang}) preparado.`);
  }

  await batch.commit();
  console.log("\n✅ Header adicionado com sucesso!");
 } catch (error) {
  console.error("❌ Erro durante a adição do header:", error);
 }
}

seedHeaderOnly();
