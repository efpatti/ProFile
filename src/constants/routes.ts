export const HOME_PATH = "/";
export const AUTH_PATH = "/auth";
export const LOGIN_PATH = `${AUTH_PATH}/sign-in`;
export const REGISTER_PATH = `${AUTH_PATH}/sign-up`;
export const PROTECTED_PATH = "/protected";
export const PROFILE_PATH = `${PROTECTED_PATH}/profile`;
export const BANNER_PATH = `${PROTECTED_PATH}/banner`;
export const RESUME_PATH = `${PROTECTED_PATH}/resume`;
export const CONTACT_PATH = "/contact";

export type Locale = "en" | "ptBr";
export interface AppRoute {
 key: string;
 title: Record<Locale, string>;
 href: string;
 protected: boolean;
 auth: boolean;
}

export const routes: AppRoute[] = [
 {
  key: "home",
  title: { en: "home", ptBr: "home" },
  href: HOME_PATH,
  protected: false,
  auth: false,
 },
 {
  key: "profile",
  title: { en: "profile", ptBr: "profile" },
  href: PROFILE_PATH,
  protected: true,
  auth: false,
 },
 {
  key: "banner",
  title: { en: "banner", ptBr: "banner" },
  href: BANNER_PATH,
  protected: true,
  auth: false,
 },
 {
  key: "resume",
  title: { en: "resume", ptBr: "resume" },
  href: RESUME_PATH,
  protected: true,
  auth: false,
 },
 {
  key: "signIn",
  title: { en: "signIn", ptBr: "signIn" },
  href: LOGIN_PATH,
  protected: false,
  auth: true,
 },
 {
  key: "signUp",
  title: { en: "signUp", ptBr: "signUp" },
  href: REGISTER_PATH,
  protected: false,
  auth: true,
 },
 {
  key: "contact",
  title: { en: "contact", ptBr: "contact" },
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
