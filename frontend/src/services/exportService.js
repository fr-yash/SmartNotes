import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak } from 'docx';
import { saveAs } from 'file-saver';

export const exportService = {
  // Export note as PDF
  exportToPDF: async (note, summary) => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(30, 58, 138); // Blue color
      pdf.text(note.title, margin, yPosition);
      yPosition += 15;

      // Metadata
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const createdDate = new Date(note.createdAt).toLocaleDateString();
      const updatedDate = new Date(note.updatedAt).toLocaleDateString();
      pdf.text(`Created: ${createdDate}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Updated: ${updatedDate}`, margin, yPosition);
      yPosition += 12;

      // Original Content Section
      pdf.setFontSize(14);
      pdf.setTextColor(30, 58, 138);
      pdf.text('Original Content', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      const contentLines = pdf.splitTextToSize(note.content, maxWidth);
      contentLines.forEach((line) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 6;
      });

      yPosition += 8;

      // AI Summary Section
      if (summary) {
        if (yPosition > pageHeight - margin - 20) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(14);
        pdf.setTextColor(30, 58, 138);
        pdf.text('AI-Generated Summary', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const summaryLines = pdf.splitTextToSize(summary, maxWidth);
        summaryLines.forEach((line) => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 6;
        });
      }

      // Save PDF
      pdf.save(`${note.title}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  },

  // Export note as Word Document
  exportToWord: async (note, summary) => {
    try {
      const createdDate = new Date(note.createdAt).toLocaleDateString();
      const updatedDate = new Date(note.updatedAt).toLocaleDateString();

      const sections = [
        new Paragraph({
          text: note.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: `Created: ${createdDate}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Updated: ${updatedDate}`,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: 'Original Content',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: note.content,
          spacing: { after: 300 }
        })
      ];

      // Add summary if available
      if (summary) {
        sections.push(
          new Paragraph({
            text: 'AI-Generated Summary',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: summary,
            spacing: { after: 100 }
          })
        );
      }

      const doc = new Document({
        sections: [
          {
            children: sections
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${note.title}.docx`);
    } catch (error) {
      console.error('Error exporting to Word:', error);
      throw error;
    }
  }
};

