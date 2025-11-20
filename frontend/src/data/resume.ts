import type { ResumeDataType } from "./resume.types";

export const resumeData: ResumeDataType = {
 "pt-br": {
  title: "Currículo - Enzo Ferracini Patti",
  header: {
   name: "Enzo Ferracini Patti",
   title:
    "Desenvolvedor Web | Técnico em Desenvolvimento de Sistemas | Estudante de Ciência da Computação",
   contacts: [
    {
     icon: "fa-solid fa-envelope",
     text: "efpatti.dev@gmail.com",
     href: "mailto:efpatti.dev@gmail.com",
    },
    {
     icon: "fa-solid fa-phone",
     text: "+55 (11) 97883-3101",
     href: "tel:+5511978833101",
    },
    {
     icon: "fab fa-linkedin",
     text: "linkedin.com/in/efpatti",
     href: "https://linkedin.com/in/efpatti",
    },
    {
     icon: "fab fa-github",
     text: "github.com/efpatti",
     href: "https://github.com/efpatti",
    },
   ],
  },
  sections: {
   profile: {
    title: "Perfil",
    icon: "fa-user",
    content:
     "Estudante de Ciência da Computação e Desenvolvedor Web comprometido com a criação de sistemas bem estruturados, escaláveis e com foco em qualidade. Movido por propósito, aprendizado contínuo e a entrega de soluções que fazem a diferença.",
   },
   languages: {
    title: "Idiomas",
    icon: "fa-globe",
    items: ["Inglês: Intermediário/Avançado (B2)", "Português: Nativo/Fluente"],
   },
   education: {
    title: "Formação Acadêmica",
    icon: "fa-graduation-cap",
    items: [
     {
      title: "Bacharelado em Ciência da Computação – USCS",
      period: "Jan 2025 – Dez 2028",
     },
     {
      title: "Técnico em Desenvolvimento de Sistemas – SENAI",
      period: "Jan 2023 – Dez 2024",
     },
    ],
   },
   experience: {
    title: "Experiência",
    icon: "fa-briefcase",
    items: [
     {
      title: "Assistente Técnico & Beta Tester – SENAI, São Caetano do Sul",
      period: "Jan 2023 – Dez 2024",
      details: [
       "Colaborei no desenvolvimento e aprimoramento de exercícios em sala de aula, garantindo a qualidade e funcionalidade dos sistemas como beta tester.",
       "Prestei suporte técnico para mais de 30 alunos, auxiliando em questões de desenvolvimento de software e compreensão conceitual.",
       "Liderei atividades de suporte e substituí o professor em 3 aulas, treinando mais de 30 alunos — fortalecendo habilidades de comunicação e ensino técnico.",
      ],
     },
    ],
   },
   projects: {
    title: "Projetos",
    icon: "fa-code",
    items: [
     {
      title: "Sistema de Cadastro — SENAI São Caetano do Sul",
      description:
       "Desenvolvido com o Professor William Reis utilizando React.js, Node.js e MySQL. Adotado por mais de 30 alunos para estudos práticos.",
      link: {
       text: "Ver Repositório",
       href: "https://github.com/willreis/sistemaCadastro",
      },
     },
     {
      title: "Tempo CEP (Integração com API)",
      description:
       "Criei um sistema que busca dados de endereço via API de CEP brasileiro e dados meteorológicos via API do Yahoo Weather. Construído com React.js, TailwindCSS e Axios.",
      link: {
       text: "Ver Repositório",
       href: "https://github.com/efpatti/tempo-cep",
      },
     },
     {
      title: "Bartira",
      description:
       "Sistema de gestão com autenticação JWT, CRUD de usuários, controle de produtos/fornecedores/vendas e módulo financeiro. Integrado com API de CEP.",
      link: {
       text: "Ver Repositório",
       href: "https://github.com/efpatti/bartira",
      },
     },
    ],
   },
   certifications: {
    title: "Certificações",
    icon: "fa-certificate",
    items: [
     {
      title: "GitHub Foundations",
      examCode: "GH-900",
      linkCredly:
       "https://www.credly.com/badges/e0b9da58-6869-44f7-8a17-c2e6c7ca2e22",
     },
    ],
   },
   skills: {
    title: "Habilidades",
    icon: "fa-cogs",
    categories: [
     {
      title: "Técnicas",
      items: [
       "JavaScript",
       "TypeScript",
       "Python",
       "Bash",
       "HTML5",
       "CSS3",
       "SASS",
       "React.js",
       "Next.js",
       "Node.js",
       "API RESTful",
       "JWT",
       "Django",
       "MySQL",
       "PostgreSQL",
       "Firebase",
       "MongoDB",
       "Linux",
       "Git",
       "Postman",
       "Scrum",
       "Kanban",
       "Jest",
       "React Testing Library",
       "Vitest",
      ],
     },
     {
      title: "Profissionais",
      items: [
       "Resolução de problemas",
       "Trabalho em equipe",
       "Aprendizado rápido",
       "Proatividade",
       "Criatividade",
       "Liderança",
      ],
     },
    ],
   },
   interests: {
    title: "Interesses",
    icon: "fa-lightbulb",
    categories: [
     {
      title: "Foco Técnico",
      items: [
       "Otimização de Performance",
       "Soluções Cloud-Native",
       "UI/UX para Devs",
       "Acessibilidade",
      ],
     },
     {
      title: "Valores & Comunidade",
      items: [
       "Arquitetura Escalável",
       "Impacto Social",
       "Open-Source",
       "Mentoria",
      ],
     },
    ],
   },
   recommendations: {
    title: "Recomendações",
    icon: "fa-quote-left",
    items: [
     {
      title: "Rodrigo R. Alvarez",
      period: "Jan 2023 – Dez 2024",
      description: `Professor de TI, Desenvolvedor Fullstack`,
      details: [
       `"Tive o privilégio de ter Enzo como aluno e devo destacar seu desempenho excepcional. <br /><br />Ele se destacou por seu aprendizado rápido, dedicação consistente e grande interesse em aprofundar seus conhecimentos. Desde o início, ficou claro que ele buscava ir além do básico, aplicando as lições de maneiras práticas e criativas..."`,
      ],
     },
    ],
   },
   awards: {
    title: "Prêmios",
    icon: "fa-trophy",
    items: [
     {
      title: "Honra ao Mérito – SENAI São Caetano do Sul",
      description:
       "Premiação como melhor aluno do curso de Desenvolvimento de Sistemas.",
     },
    ],
   },
  },
  buttons: {
   generatePDF: "Gerar PDF",
  },
 },
 en: {
  title: "Resume - Enzo Ferracini Patti",
  header: {
   name: "Enzo Ferracini Patti",
   title:
    "Web Developer | Software Development Technician | Computer Science Student",
   contacts: [
    {
     icon: "fa-solid fa-envelope",
     text: "efpatti.dev@gmail.com",
     href: "mailto:efpatti.dev@gmail.com",
    },
    {
     icon: "fa-solid fa-phone",
     text: "+55 (11) 97883-3101",
     href: "tel:+5511978833101",
    },
    {
     icon: "fab fa-linkedin",
     text: "linkedin.com/in/efpatti",
     href: "https://linkedin.com/in/efpatti",
    },
    {
     icon: "fab fa-github",
     text: "github.com/efpatti",
     href: "https://github.com/efpatti",
    },
   ],
  },
  sections: {
   profile: {
    title: "Profile",
    icon: "fa-user",
    content:
     "Computer Science student and Web Developer committed to creating well-structured, scalable systems with a focus on quality. Driven by purpose, continuous learning, and delivering solutions that make a difference.",
   },
   languages: {
    title: "Languages",
    icon: "fa-globe",
    items: ["English: Intermediate/Advanced (B2)", "Portuguese: Native/Fluent"],
   },
   education: {
    title: "Education",
    icon: "fa-graduation-cap",
    items: [
     {
      title: "Bachelor's Degree in Computer Science – USCS",
      period: "Jan 2025 – Dec 2028",
     },
     {
      title: "Associate Degree in Systems Development – SENAI",
      period: "Jan 2023 – Dec 2024",
     },
    ],
   },
   experience: {
    title: "Experience",
    icon: "fa-briefcase",
    items: [
     {
      title: "Technical Assistant & Beta Tester – SENAI, São Caetano do Sul",
      period: "Jan 2023 – Dec 2024",
      details: [
       "Collaborated in the development and improvement of classroom exercises, ensuring system quality and functionality as a beta tester.",
       "Provided technical support for over 30 students, assisting with software development issues and conceptual understanding.",
       "Led support activities and substituted the teacher in 3 classes, training more than 30 students—strengthening communication and technical teaching skills.",
      ],
     },
    ],
   },
   projects: {
    title: "Projects",
    icon: "fa-code",
    items: [
     {
      title: "Registration System — SENAI São Caetano do Sul",
      description:
       "Developed with Professor William Reis using React.js, Node.js and MySQL. Adopted by more than 30 students for practical studies.",
      link: {
       text: "View Repository",
       href: "https://github.com/willreis/sistemaCadastro",
      },
     },
     {
      title: "Weather by ZIP Code (API Integration)",
      description:
       "Created a system that fetches address data via Brazilian ZIP code API and weather data via Yahoo Weather API. Built with React.js, TailwindCSS and Axios.",
      link: {
       text: "View Repository",
       href: "https://github.com/efpatti/tempo-cep",
      },
     },
     {
      title: "Bartira",
      description:
       "Management system with JWT authentication, CRUD for users, product/supplier/sales control and financial module. Integrated with ZIP code API.",
      link: {
       text: "View Repository",
       href: "https://github.com/efpatti/bartira",
      },
     },
    ],
   },
   certifications: {
    title: "Certifications",
    icon: "fa-certificate",
    items: [
     {
      title: "GitHub Foundations",
      examCode: "GH-900",
      linkCredly:
       "https://www.credly.com/badges/e0b9da58-6869-44f7-8a17-c2e6c7ca2e22",
     },
    ],
   },
   skills: {
    title: "Skills",
    icon: "fa-cogs",
    categories: [
     {
      title: "Technical",
      items: [
       "JavaScript",
       "TypeScript",
       "Python",
       "Bash",
       "HTML5",
       "CSS3",
       "SASS",
       "React.js",
       "Next.js",
       "Node.js",
       "RESTful API",
       "JWT",
       "Django",
       "MySQL",
       "PostgreSQL",
       "Firebase",
       "MongoDB",
       "Linux",
       "Git",
       "Postman",
       "Scrum",
       "Kanban",
       "Jest",
       "React Testing Library",
       "Vitest",
      ],
     },
     {
      title: "Professional",
      items: [
       "Problem solving",
       "Teamwork",
       "Fast learner",
       "Proactivity",
       "Creativity",
       "Leadership",
      ],
     },
    ],
   },
   interests: {
    title: "Interests",
    icon: "fa-lightbulb",
    categories: [
     {
      title: "Technical Focus",
      items: [
       "Performance Optimization",
       "Cloud-Native Solutions",
       "UI/UX for Devs",
       "Accessibility",
      ],
     },
     {
      title: "Values & Community",
      items: [
       "Scalable Architecture",
       "Social Impact",
       "Open-Source",
       "Mentoring",
      ],
     },
    ],
   },
   recommendations: {
    title: "Recommendations",
    icon: "fa-quote-left",
    items: [
     {
      title: "Rodrigo R. Alvarez",
      period: "Jan 2023 – Dec 2024",
      description: `IT Professor, Fullstack Developer`,
      details: [
       `"I had the privilege of having Enzo as a student and must highlight his exceptional performance. <br /><br />He stood out for his quick learning, consistent dedication, and great interest in deepening his knowledge. From the beginning, it was clear that he sought to go beyond the basics, applying lessons in practical and creative ways..."`,
      ],
     },
    ],
   },
   awards: {
    title: "Awards",
    icon: "fa-trophy",
    items: [
     {
      title: "Honor of Merit – SENAI São Caetano do Sul",
      description:
       "Awarded as the best student in the Systems Development course.",
     },
    ],
   },
  },
  buttons: {
   generatePDF: "Generate PDF",
  },
 },
};
