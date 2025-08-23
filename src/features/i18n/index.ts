import { en } from "./dictionaries/en";
import { ptBr } from "./dictionaries/ptBr";

export type Locale = "en" | "pt-br";
export const dictionaries = {
 en,
 "pt-br": ptBr,
};

export function getDictionary(locale: Locale) {
 return dictionaries[locale];
}
