import { useEffect, useMemo, useState } from "react";
import useResumeStore from "@/core/store/useResumeStore";

type SkillGroup = { title: string; items: string[] };

export function useResumeData(userId: string | undefined) {
 const [displayName, setDisplayName] = useState<string | undefined>();
 const [currentLogoUrl, setCurrentLogoUrl] = useState<string | undefined>();

 const {
  loadResume,
  skills,
  experiences,
  education,
  languages,
  projects,
  certifications,
  interests,
  recommendations,
  awards,
  profile,
  header,
  isLoading,
 } = useResumeStore();

 useEffect(() => {
  if (!userId) return;
  loadResume(userId);
 }, [userId, loadResume]);

 useEffect(() => {
  if (!userId) return;
  let cancelled = false;

  const fetchPreferences = async () => {
   try {
    const response = await fetch("/api/user/preferences");
    if (!response.ok) return;
    const data = await response.json();
    if (!cancelled && typeof data?.displayName === "string") {
     const trimmed = data.displayName.trim();
     if (trimmed.length > 0) setDisplayName(trimmed);
    }
   } catch (error) {
    console.error("Failed to load user preferences", error);
   }
  };

  fetchPreferences();
  return () => {
   cancelled = true;
  };
 }, [userId]);

 const skillsByGroup = useMemo<SkillGroup[]>(() => {
  if (!skills || skills.length === 0) return [];

  const groups = skills.reduce<Record<string, SkillGroup>>((acc, skill) => {
   const title = skill.category || "General";
   if (!acc[title]) acc[title] = { title, items: [] };
   const label = skill.name || skill.item || "";
   if (label) acc[title].items.push(label);
   return acc;
  }, {});

  return Object.keys(groups).map((key) => groups[key]);
 }, [skills]);

 return {
  isReady: !isLoading,
  displayName,
  currentLogoUrl,
  setCurrentLogoUrl,
  header,
  profile,
  skillsByGroup,
  experiences,
  education,
  languages,
  projects,
  certifications,
  interests,
  recommendations,
  awards,
 };
}
