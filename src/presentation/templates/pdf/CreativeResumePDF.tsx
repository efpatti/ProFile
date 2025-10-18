import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Resume } from "@/core/entities/Resume";

const createStyles = (colorScheme: Resume["colorScheme"]) =>
 StyleSheet.create({
  page: {
   flexDirection: "row",
   fontSize: 10,
  },
  sidebar: {
   width: "35%",
   backgroundColor: colorScheme.primary,
   padding: 20,
   color: "#FFFFFF",
  },
  main: {
   width: "65%",
   padding: 20,
  },
 });

interface CreativeResumePDFProps {
 data: Resume;
}

export const CreativeResumePDF: React.FC<CreativeResumePDFProps> = ({
 data,
}) => {
 const styles = createStyles(data.colorScheme);

 return (
  <Document>
   <Page size="A4" style={styles.page}>
    <View style={styles.sidebar}>{/* Sidebar com foto e info */}</View>
    <View style={styles.main}>{/* Conteúdo principal */}</View>
   </Page>
  </Document>
 );
};
