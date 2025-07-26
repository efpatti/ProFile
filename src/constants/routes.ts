export const HOME_PATH = "/";
export const AUTH_PATH = "/auth";
export const LOGIN_PATH = `${AUTH_PATH}/sign-in`;
export const REGISTER_PATH = `${AUTH_PATH}/sign-up`;
export const PROTECTED_PATH = "/protected";
export const PROFILE_PATH = `${PROTECTED_PATH}/profile`;
export const BANNER_PATH = `${PROTECTED_PATH}/banner`;
export const RESUME_PATH = `${PROTECTED_PATH}/resume`;
export const CONTACT_PATH = "/contact";

export const routes = [
 {
  title: {
   en: "Home",
   ptBr: "Início",
  },
  href: HOME_PATH,
  protected: false,
  auth: false,
 },
 {
  title: {
   en: "Profile",
   ptBr: "Perfil",
  },
  href: PROFILE_PATH,
  protected: true,
  auth: false,
 },
 {
  title: {
   en: "Banner",
   ptBr: "Banner",
  },
  href: BANNER_PATH,
  protected: true,
  auth: false,
 },
 {
  title: {
   en: "Resume",
   ptBr: "Currículo",
  },
  href: RESUME_PATH,
  protected: true,
  auth: false,
 },
 {
  title: {
   en: "Log in",
   ptBr: "Entrar",
  },
  href: LOGIN_PATH,
  protected: false,
  auth: true,
 },
 {
  title: {
   en: "Sign up",
   ptBr: "Cadastrar",
  },
  href: REGISTER_PATH,
  protected: false,
  auth: true,
 },
 {
  title: {
   en: "Contact",
   ptBr: "Fale Conosco",
  },
  href: CONTACT_PATH,
  protected: false,
  auth: false,
 },
];

export const publicRoutes = routes.filter(
 (route) => !route.protected && !route.auth
);
export const protectedRoutes = routes.filter((route) => route.protected);
export const authRoutes = routes.filter((route) => route.auth);
export const bannerAndResumeRoutes = routes.filter((route) =>
 [BANNER_PATH, RESUME_PATH].includes(route.href)
);
export const profileRoute = routes.find((route) => route.href === PROFILE_PATH);
export const mainPublicRoutes = routes.filter(
 (route) =>
  !route.protected && !route.auth && ![CONTACT_PATH].includes(route.href)
);
export const contactRoute = routes.find((route) => route.href === CONTACT_PATH);
