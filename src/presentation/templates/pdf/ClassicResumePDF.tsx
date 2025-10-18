import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Resume } from "@/core/entities/Resume";

const createStyles = (colorScheme: Resume["colorScheme"]) =>
 StyleSheet.create({
  page: {
   padding: 30,
   fontSize: 11,
   fontFamily: "Times-Roman",
  },
  name: {
   fontSize: 24,
   textAlign: "center",
   marginBottom: 5,
  },
  headline: {
   fontSize: 12,
   textAlign: "center",
   marginBottom: 15,
  },
  section: {
   marginBottom: 15,
  },
  sectionTitle: {
   fontSize: 14,
   fontWeight: "bold",
   marginBottom: 8,
   borderBottom: `1px solid ${colorScheme.primary}`,
  },
 });

interface ClassicResumePDFProps {
 data: Resume;
}

export const ClassicResumePDF: React.FC<ClassicResumePDFProps> = ({ data }) => {
 const styles = createStyles(data.colorScheme);

 return (
  <Document>
   <Page size="A4" style={styles.page}>
    <Text style={styles.name}>{data.fullName}</Text>
    <Text style={styles.headline}>{data.headline}</Text>
    {/* Implementação simplificada - expandir conforme necessário */}
   </Page>
  </Document>
 );
};
