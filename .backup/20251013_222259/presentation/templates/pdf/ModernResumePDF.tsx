import React from "react";
import {
 Document,
 Page,
 Text,
 View,
 StyleSheet,
 Font,
} from "@react-pdf/renderer";
import { Resume } from "@/core/entities/Resume";

// ==================== STYLES ====================

const createStyles = (colorScheme: Resume["colorScheme"]) =>
 StyleSheet.create({
  page: {
   padding: 40,
   fontSize: 10,
   fontFamily: "Helvetica",
   backgroundColor: "#FFFFFF",
  },
  header: {
   marginBottom: 20,
   borderBottom: `2px solid ${colorScheme.primary}`,
   paddingBottom: 15,
  },
  name: {
   fontSize: 28,
   fontWeight: "bold",
   color: colorScheme.primary,
   marginBottom: 5,
  },
  headline: {
   fontSize: 14,
   color: colorScheme.secondary,
   marginBottom: 10,
  },
  contactInfo: {
   fontSize: 9,
   color: "#666666",
   flexDirection: "row",
   gap: 10,
  },
  section: {
   marginBottom: 15,
  },
  sectionTitle: {
   fontSize: 14,
   fontWeight: "bold",
   color: colorScheme.primary,
   marginBottom: 8,
   textTransform: "uppercase",
   borderBottom: `1px solid ${colorScheme.accent}`,
   paddingBottom: 4,
  },
  experienceItem: {
   marginBottom: 12,
  },
  jobTitle: {
   fontSize: 12,
   fontWeight: "bold",
   color: "#000000",
  },
  company: {
   fontSize: 11,
   color: colorScheme.secondary,
   marginBottom: 3,
  },
  period: {
   fontSize: 9,
   color: "#666666",
   fontStyle: "italic",
   marginBottom: 5,
  },
  description: {
   fontSize: 10,
   color: "#333333",
   lineHeight: 1.4,
  },
  skillCategory: {
   marginBottom: 8,
  },
  skillCategoryName: {
   fontSize: 11,
   fontWeight: "bold",
   color: colorScheme.secondary,
   marginBottom: 3,
  },
  skillsList: {
   fontSize: 10,
   color: "#333333",
  },
 });

// ==================== COMPONENT ====================

interface ModernResumePDFProps {
 data: Resume;
}

export const ModernResumePDF: React.FC<ModernResumePDFProps> = ({ data }) => {
 const styles = createStyles(data.colorScheme);

 return (
  <Document>
   <Page size="A4" style={styles.page}>
    {/* Header */}
    <View style={styles.header}>
     <Text style={styles.name}>{data.fullName}</Text>
     <Text style={styles.headline}>{data.headline}</Text>
     <View style={styles.contactInfo}>
      <Text>{data.email}</Text>
      {data.phone && <Text>• {data.phone}</Text>}
      {data.location && <Text>• {data.location}</Text>}
     </View>
    </View>

    {/* Resumo */}
    <View style={styles.section}>
     <Text style={styles.sectionTitle}>Resumo Profissional</Text>
     <Text style={styles.description}>{data.summary}</Text>
    </View>

    {/* Experiências */}
    <View style={styles.section}>
     <Text style={styles.sectionTitle}>Experiência Profissional</Text>
     {data.experiences.map((exp) => (
      <View key={exp.id} style={styles.experienceItem}>
       <Text style={styles.jobTitle}>{exp.role}</Text>
       <Text style={styles.company}>{exp.company}</Text>
       <Text style={styles.period}>
        {exp.startDate} - {exp.endDate || "Atual"}
       </Text>
       {exp.description && (
        <Text style={styles.description}>{exp.description}</Text>
       )}
       {exp.technologies.length > 0 && (
        <Text style={styles.description}>
         Tecnologias: {exp.technologies.join(", ")}
        </Text>
       )}
      </View>
     ))}
    </View>

    {/* Formação */}
    <View style={styles.section}>
     <Text style={styles.sectionTitle}>Formação Acadêmica</Text>
     {data.education.map((edu) => (
      <View key={edu.id} style={styles.experienceItem}>
       <Text style={styles.jobTitle}>
        {edu.degree} em {edu.field}
       </Text>
       <Text style={styles.company}>{edu.institution}</Text>
       <Text style={styles.period}>
        {edu.startDate} - {edu.endDate || "Atual"}
       </Text>
      </View>
     ))}
    </View>

    {/* Habilidades */}
    {data.skills.length > 0 && (
     <View style={styles.section}>
      <Text style={styles.sectionTitle}>Habilidades</Text>
      {data.skills.map((category) => (
       <View key={category.id} style={styles.skillCategory}>
        <Text style={styles.skillCategoryName}>{category.name}</Text>
        <Text style={styles.skillsList}>{category.skills.join(" • ")}</Text>
       </View>
      ))}
     </View>
    )}

    {/* Idiomas */}
    {data.languages.length > 0 && (
     <View style={styles.section}>
      <Text style={styles.sectionTitle}>Idiomas</Text>
      <Text style={styles.skillsList}>
       {data.languages
        .map((lang) => `${lang.language}: ${lang.proficiency}`)
        .join(" • ")}
      </Text>
     </View>
    )}
   </Page>
  </Document>
 );
};
