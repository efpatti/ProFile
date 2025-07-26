import { ResumeDataset } from "@/types/resume";

const resumeData: ResumeDataset = {
 "pt-br": {
  title: "Currículo - Enzo Ferracini Patti",
  header: {
   name: "Enzo Ferracini Patti",
   title:
    "Desenvolvedor Web | Técnico em Desenvolvimento de Sistemas | Estudante de Ciência da Computação",
   contacts: [
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
   ],
  },
  sections: {
   profile: {
    title: "Perfil",
    content:
     "Estudante de Ciência da Computação e Desenvolvedor Web comprometido com a criação de sistemas bem estruturados, escaláveis e com foco em qualidade. Movido por propósito, aprendizado contínuo e a entrega de soluções que fazem a diferença.",
   },
   languages: {
    title: "Idiomas",
    items: ["Inglês: Intermediário/Avançado (B2)", "Português: Nativo/Fluente"],
   },
   education: {
    title: "Formação Acadêmica",
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
    categories: [
     {
      title: "Técnicas",
      items: [
       "Linguagens: JavaScript, TypeScript, Python, Bash",
       "Frontend: HTML5, CSS3, SASS, Vite.js, React.js, Next.js, Remix, Redux, Context API, React Hook Form, TailwindCSS, Chakra UI, Shadcn UI, Styled Components, Web Components",
       "Backend: Node.js, Desenvolvimento de API RESTful, Autenticação JWT, Django",
       "Bancos de Dados: MySQL, PostgreSQL, Firebase, MongoDB",
       "Ferramentas & DevOps: Linux, Bash, Git, Microsoft Office, Google Workspace, Postman, Insomnia",
       "Metodologias Ágeis: Scrum, Kanban",
       "Testes: Testes Unitários e de Integração (Jest, React Testing Library, Vitest)",
      ],
     },
     {
      title: "Profissionais",
      items: [
       "Resolução de problemas",
       "Trabalho em equipe",
       "Proativo na adoção e aprendizado de novas tecnologias",
       "Aprendizado rápido",
       "Criatividade",
       "Curiosidade",
       "Liderança",
      ],
     },
    ],
   },
   interests: {
    title: "Interesses",
    categories: [
     {
      title: "Foco Técnico",
      items: [
       "Otimização de Performance (React/Node)",
       "Soluções Cloud-Native",
       "UI/UX para Desenvolvedores",
       "Desenvolvimento Orientado a Acessibilidade",
      ],
     },
     {
      title: "Valores & Comunidade",
      items: [
       "Construção de Arquitetura Escalável",
       "Tecnologia para Impacto Social",
       "Comunidades Open-Source",
       "Mentoria para Desenvolvedores Júniores",
      ],
     },
    ],
   },
   recommendations: {
    title: "Recomendações",
    items: [
     {
      name: "Rodrigo R. Alvarez",
      position: "Professor de TI, Desenvolvedor Fullstack",
      period: "Jan 2023 – Dez 2024",
      text: `"Tive o privilégio de ter Enzo como aluno e devo destacar seu desempenho excepcional. <br /><br />Ele se destacou por seu aprendizado rápido, dedicação consistente e grande interesse em aprofundar seus conhecimentos. Desde o início, ficou claro que ele buscava ir além do básico, aplicando as lições de maneiras práticas e criativas..."`,
     },
    ],
   },
   awards: {
    title: "Prêmios",
    items: [
     {
      icon: "fa-solid fa-award",
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
   ],
  },
  sections: {
   profile: {
    title: "Profile",
    content:
     "Computer Science student and Web Developer committed to creating well-structured, scalable systems with a focus on quality. Driven by purpose, continuous learning, and delivering solutions that make a difference.",
   },
   languages: {
    title: "Languages",
    items: ["English: Intermediate/Advanced (B2)", "Portuguese: Native/Fluent"],
   },
   education: {
    title: "Education",
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
    categories: [
     {
      title: "Technical",
      items: [
       "Languages: JavaScript, TypeScript, Python, Bash",
       "Frontend: HTML5, CSS3, SASS, Vite.js, React.js, Next.js, Remix, Redux, Context API, React Hook Form, TailwindCSS, Chakra UI, Shadcn UI, Styled Components, Web Components",
       "Backend: Node.js, RESTful API Development, JWT Authentication, Django",
       "Databases: MySQL, PostgreSQL, Firebase, MongoDB",
       "Tools & DevOps: Linux, Bash, Git, Microsoft Office, Google Workspace, Postman, Insomnia",
       "Agile Methodologies: Scrum, Kanban",
       "Testing: Unit and Integration Tests (Jest, React Testing Library, Vitest)",
      ],
     },
     {
      title: "Professional",
      items: [
       "Problem solving",
       "Teamwork",
       "Proactive in adopting and learning new technologies",
       "Fast learner",
       "Creativity",
       "Curiosity",
       "Leadership",
      ],
     },
    ],
   },
   interests: {
    title: "Interests",
    categories: [
     {
      title: "Technical Focus",
      items: [
       "Performance Optimization (React/Node)",
       "Cloud-Native Solutions",
       "UI/UX for Developers",
       "Accessibility-Oriented Development",
      ],
     },
     {
      title: "Values & Community",
      items: [
       "Building Scalable Architecture",
       "Technology for Social Impact",
       "Open-Source Communities",
       "Mentoring Junior Developers",
      ],
     },
    ],
   },
   recommendations: {
    title: "Recommendations",
    items: [
     {
      name: "Rodrigo R. Alvarez",
      position: "IT Professor, Fullstack Developer",
      period: "Jan 2023 – Dec 2024",
      text: `"I had the privilege of having Enzo as a student and must highlight his exceptional performance. <br /><br />He stood out for his quick learning, consistent dedication, and great interest in deepening his knowledge. From the beginning, it was clear that he sought to go beyond the basics, applying lessons in practical and creative ways..."`,
     },
    ],
   },
   awards: {
    title: "Awards",
    items: [
     {
      icon: "fa-solid fa-award",
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

export { resumeData };
