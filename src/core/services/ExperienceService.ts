import {
 collection,
 getDocs,
 query,
 where,
 orderBy,
 limit,
 writeBatch,
 doc,
 Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Experience {
 id?: string;
 title: string;
 company: string;
 period: string;
 description: string;
 language: "pt-br" | "en";
 order: number;
 locate?: string;
 details?: string[];
 // Novos campos
 startDate?: Timestamp | null;
 endDate?: Timestamp | null;
 isCurrent?: boolean;
 periodDisplay?: string;
}

export const fetchExperienceForUser = async (
 userId: string,
 language: "pt-br" | "en",
 pageSize = 100
): Promise<Experience[]> => {
 const ref = collection(db, "users", userId, "experience");
 const q = query(
  ref,
  where("language", "==", language),
  orderBy("order", "asc"),
  limit(pageSize)
 );
 const snap = await getDocs(q);
 return snap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as Omit<Experience, "id">),
 }));
};

// Função auxiliar para formatar o período de exibição
const formatPeriodDisplay = (
 startDate: Date | null,
 endDate: Date | null,
 isCurrent: boolean,
 language: "pt-br" | "en"
): string => {
 if (!startDate) return "";

 const locale = language === "pt-br" ? "pt-BR" : "en-US";
 const monthFormat: Intl.DateTimeFormatOptions = { month: "short" };
 const yearFormat: Intl.DateTimeFormatOptions = { year: "numeric" };

 const startMonth = startDate.toLocaleDateString(locale, monthFormat);
 const startYear = startDate.toLocaleDateString(locale, yearFormat);

 let endStr = "";
 if (isCurrent) {
  endStr = language === "pt-br" ? "Atual" : "Present";
 } else if (endDate) {
  const endMonth = endDate.toLocaleDateString(locale, monthFormat);
  const endYear = endDate.toLocaleDateString(locale, yearFormat);
  endStr = `${endMonth} ${endYear}`;
 }

 return `${startMonth} ${startYear} - ${endStr}`;
};

// Função para converter dados de entrada para o formato Firestore
const prepareExperienceData = (
 experience: Partial<Experience>,
 language: "pt-br" | "en"
): Omit<Experience, "id"> => {
 const {
  startDate,
  endDate,
  isCurrent,
  period,
  title,
  company,
  description,
  locate,
  details,
  order,
 } = experience;

 // Determinar datas baseado na lógica isCurrent
 let finalStartDate: Timestamp | null = null;
 let finalEndDate: Timestamp | null = null;
 let finalIsCurrent = isCurrent || false;

 if (startDate instanceof Date) {
  finalStartDate = Timestamp.fromDate(startDate);
 } else if (startDate instanceof Timestamp) {
  finalStartDate = startDate;
 }

 if (finalIsCurrent) {
  finalEndDate = null;
 } else if (endDate instanceof Date) {
  finalEndDate = Timestamp.fromDate(endDate);
 } else if (endDate instanceof Timestamp) {
  finalEndDate = endDate;
 }

 // Converter Timestamps para Date para formatação
 const startDateObj = finalStartDate ? finalStartDate.toDate() : null;
 const endDateObj = finalEndDate ? finalEndDate.toDate() : null;

 // Gerar periodDisplay
 const periodDisplay = formatPeriodDisplay(
  startDateObj,
  endDateObj,
  finalIsCurrent,
  language
 );

 // Manter o campo period original para compatibilidade
 const finalPeriod = period || periodDisplay;

 return {
  title: title || "",
  company: company || "",
  period: finalPeriod,
  periodDisplay,
  description: description || "",
  language,
  order: order || 0,
  locate: locate || "",
  details: details || [],
  startDate: finalStartDate,
  endDate: finalEndDate,
  isCurrent: finalIsCurrent,
 };
};

export const saveExperience = async (
 userId: string,
 language: "pt-br" | "en",
 items: Experience[],
 existingSnapshot?: Experience[]
) => {
 const batch = writeBatch(db);

 const existing =
  existingSnapshot ?? (await fetchExperienceForUser(userId, language));
 const existingIds = new Set(existing.map((e) => e.id));
 const newIds = new Set(items.map((e) => e.id).filter(Boolean));

 // Deletions
 for (const e of existing) {
  if (!newIds.has(e.id)) {
   const ref = doc(db, "users", userId, "experience", e.id!);
   batch.delete(ref);
  }
 }

 // Upserts according to array order
 items.forEach((item, index) => {
  const data = prepareExperienceData({ ...item, order: index }, language);

  if (item.id && existingIds.has(item.id)) {
   const ref = doc(db, "users", userId, "experience", item.id);
   batch.set(ref, data);
  } else {
   const ref = doc(collection(db, "users", userId, "experience"));
   batch.set(ref, data);
  }
 });

 await batch.commit();
};

// Função para migrar experiências existentes (opcional)
export const migrateExistingExperiences = async (
 userId: string,
 language: "pt-br" | "en"
) => {
 const experiences = await fetchExperienceForUser(userId, language);

 const batch = writeBatch(db);

 for (const exp of experiences) {
  if (exp.period && (!exp.startDate || !exp.periodDisplay)) {
   // Tentar extrair datas do campo period existente
   const periodMatch = exp.period.match(
    /([A-Za-z]+) (\d{4}) - ([A-Za-z]+) (\d{4}|Present|Atual)/
   );

   if (periodMatch) {
    const [, startMonth, startYear, endMonth, endYear] = periodMatch;
    const isCurrent = endYear === "Present" || endYear === "Atual";

    const startDateDate = new Date(`${startMonth} 1, ${startYear}`);
    const endDateDate = isCurrent
     ? null
     : new Date(`${endMonth} 1, ${endYear}`);

    const updatedData = prepareExperienceData(
     {
      ...exp,
      startDate: startDateDate ? Timestamp.fromDate(startDateDate) : null,
      endDate: endDateDate ? Timestamp.fromDate(endDateDate) : null,
      isCurrent,
     },
     language
    );

    const ref = doc(db, "users", userId, "experience", exp.id!);
    batch.update(ref, updatedData);
   }
  }
 }

 await batch.commit();
};
