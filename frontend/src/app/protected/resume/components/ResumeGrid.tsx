"use client";

import React from "react";
import type { BgBannerColorName } from "@/styles/shared_style_constants";
import { ProfileSection } from "./ProfileSection";
import { SkillsSection } from "./SkillsSection";
import { ExperienceSection } from "./ExperienceSection";
import { ProjectsSection } from "./ProjectsSection";
import { LanguagesSection } from "./LanguagesSection";
import { EducationSection } from "./EducationSection";
import { RecommendationsSection } from "./RecommendationsSection";
import { CertificationsSection } from "./CertificationsSection";
import { InterestsSection } from "./InterestsSection";
import { AwardsSection } from "./AwardsSection";

interface ResumeGridProps {
 profile: any;
 languagesList: any[];
 education: any[];
 experiences: any[];
 recommendations: any[];
 certifications: any[];
 skillsByGroup: any;
 projects: any[];
 interests: any;
 awards: any[];
 language: string;
 selectedBg: BgBannerColorName;
}

export function ResumeGrid({
 profile,
 languagesList,
 education,
 experiences,
 recommendations,
 certifications,
 skillsByGroup,
 projects,
 interests,
 awards,
 language,
 selectedBg,
}: ResumeGridProps) {
 return (
  <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
   {/* Left Column */}
   <div>
    <ProfileSection
     profile={profile}
     language={language}
     selectedBg={selectedBg}
    />
    <LanguagesSection
     languages={languagesList}
     language={language}
     selectedBg={selectedBg}
    />
    <EducationSection
     education={education}
     language={language}
     selectedBg={selectedBg}
    />
    <ExperienceSection
     experiences={experiences}
     language={language}
     selectedBg={selectedBg}
    />
    <RecommendationsSection
     recommendations={recommendations}
     language={language}
     selectedBg={selectedBg}
    />
    <CertificationsSection
     certifications={certifications}
     language={language}
     selectedBg={selectedBg}
    />
   </div>

   {/* Right Column */}
   <div>
    <SkillsSection
     skills={skillsByGroup}
     language={language}
     selectedBg={selectedBg}
    />
    <ProjectsSection
     projects={projects}
     language={language}
     selectedBg={selectedBg}
    />
    <InterestsSection
     interests={interests}
     language={language}
     selectedBg={selectedBg}
    />
    <AwardsSection
     awards={awards}
     language={language}
     selectedBg={selectedBg}
    />
   </div>
  </div>
 );
}
