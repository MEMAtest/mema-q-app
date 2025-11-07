import jsPDF from 'jspdf';
import 'jspdf-autotable';

const COLORS = {
  primary: [0, 123, 255],
  secondary: [255, 69, 0],
  success: [16, 185, 129],
  danger: [239, 68, 68],
  warning: [245, 158, 11],
  text: [26, 26, 26],
  textSecondary: [107, 114, 128],
  bgLight: [247, 247, 247],
  white: [255, 255, 255]
};

export const generateCompliancePDF = (results, questions, answers) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  let currentPage = 1;

  // Helper function to add page numbers
  const addPageNumber = () => {
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textSecondary);
    doc.text(
      `Page ${currentPage} of 12`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      `Report Generated: ${new Date().toLocaleDateString('en-GB')}`,
      margin,
      pageHeight - 10
    );
  };

  // Helper function for new page
  const addNewPage = () => {
    addPageNumber();
    doc.addPage();
    currentPage++;
  };

  // ====== PAGE 1: COVER PAGE ======
  // Header background
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 80, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('FINPROMS', pageWidth / 2, 30, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('FINANCIAL PROMOTIONS COMPLIANCE REPORT', pageWidth / 2, 45, { align: 'center' });

  // Company details section
  let y = 100;
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const reportDetails = [
    ['Assessment Date:', new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Report ID:', `FP-${Date.now().toString().slice(-6)}-2025`],
    ['Generated for:', 'Compliance Assessment'],
    ['Total Questions:', Object.keys(answers).length.toString()],
  ];

  reportDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 50, y);
    y += 8;
  });

  // Score circle
  y = 140;
  const scoreX = pageWidth / 2;
  const scoreY = y + 30;
  const radius = 25;

  // Circle background
  doc.setFillColor(...COLORS.primary);
  doc.circle(scoreX, scoreY, radius, 'F');

  // Circle border
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(3);
  doc.circle(scoreX, scoreY, radius + 2, 'S');

  // Score text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text(`${results.healthScore}%`, scoreX, scoreY + 2, { align: 'center' });

  doc.setFontSize(10);
  doc.text('OVERALL COMPLIANCE SCORE', scoreX, scoreY + 12, { align: 'center' });

  // Status badge
  y = scoreY + 50;
  const healthStatus = results.healthScore >= 80 ? 'STRONG' : results.healthScore >= 60 ? 'NEEDS ATTENTION' : 'CRITICAL';
  const statusColor = results.healthScore >= 80 ? COLORS.success : results.healthScore >= 60 ? COLORS.warning : COLORS.danger;

  doc.setFillColor(...statusColor);
  doc.roundedRect(scoreX - 40, y, 80, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Status: ${healthStatus}`, scoreX, y + 8, { align: 'center' });

  // Footer
  doc.setTextColor(...COLORS.textSecondary);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('This report provides a comprehensive analysis of your organization\'s compliance', scoreX, pageHeight - 30, { align: 'center' });
  doc.text('with FCA Financial Promotions regulations (PERG 8)', scoreX, pageHeight - 24, { align: 'center' });
  doc.text('Prepared by: MEMA Consultants | www.memaconsultants.com', scoreX, pageHeight - 15, { align: 'center' });

  addPageNumber();

  // ====== PAGE 2: EXECUTIVE SUMMARY ======
  addNewPage();

  y = margin;
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, y, pageWidth, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('EXECUTIVE SUMMARY', pageWidth / 2, y + 8, { align: 'center' });

  y += 25;

  // Assessment Overview section
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('ASSESSMENT OVERVIEW', margin, y);

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const totalQuestions = Object.keys(answers).length;
  const compliantAnswers = results.chartData.doughnut[0];
  const issuesCount = results.potentialFailures.length;

  const overviewData = [
    ['Total Questions Assessed:', totalQuestions],
    ['Fully Compliant:', `${compliantAnswers} (${Math.round((compliantAnswers/totalQuestions)*100)}%)`],
    ['Requires Review:', `${issuesCount} (${Math.round((issuesCount/totalQuestions)*100)}%)`],
    ['Critical Issues:', results.potentialFailures.filter((_, i) => i < 2).length],
    ['Sections Reviewed:', questions.length],
  ];

  doc.autoTable({
    startY: y,
    head: [['Metric', 'Value']],
    body: overviewData,
    theme: 'striped',
    headStyles: { fillColor: COLORS.primary, fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 15;

  // Key Findings
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('KEY FINDINGS', margin, y);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Strengths
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.success);
  doc.text('✓ STRENGTHS', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(9);
  const strengths = [
    'Strong compliance in preliminary scope assessment',
    'Excellent firm identification practices',
    'Well-documented record-keeping systems',
  ];

  strengths.forEach(strength => {
    doc.text(`• ${strength}`, margin + 5, y);
    y += 5;
  });

  y += 5;

  // Areas for Improvement
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.warning);
  doc.text('⚠ AREAS FOR IMPROVEMENT', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(9);

  if (results.potentialFailures.length > 0) {
    results.potentialFailures.slice(0, 3).forEach(failure => {
      const text = `• ${failure.question.substring(0, 70)}${failure.question.length > 70 ? '...' : ''}`;
      doc.text(text, margin + 5, y);
      y += 5;
    });
  } else {
    doc.text('• No significant areas for improvement identified', margin + 5, y);
    y += 5;
  }

  y += 10;

  // Overall Assessment
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('OVERALL ASSESSMENT', margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const assessmentText = `Your organization demonstrates ${healthStatus.toLowerCase()} compliance fundamentals with FCA PERG 8 requirements. The ${results.healthScore}% compliance score places you ${results.healthScore >= 74 ? 'above' : 'at or below'} the industry average.`;

  const splitText = doc.splitTextToSize(assessmentText, contentWidth);
  doc.text(splitText, margin, y);
  y += splitText.length * 5 + 10;

  // Recommended Next Steps
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('RECOMMENDED NEXT STEPS', margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const nextSteps = [
    `1. Address critical issues (${results.potentialFailures.filter((_, i) => i < 2).length} identified) within 14 days`,
    '2. Review medium priority items within 30 days',
    '3. Schedule quarterly reassessments',
    '4. Implement continuous monitoring procedures',
  ];

  nextSteps.forEach(step => {
    doc.text(step, margin, y);
    y += 6;
  });

  // ====== PAGE 3-4: DETAILED ISSUE ANALYSIS ======
  if (results.potentialFailures.length > 0) {
    addNewPage();

    y = margin;
    doc.setFillColor(...COLORS.danger);
    doc.rect(0, y, pageWidth, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('DETAILED ISSUE ANALYSIS', pageWidth / 2, y + 8, { align: 'center' });

    y += 25;

    results.potentialFailures.forEach((failure, index) => {
      if (y > pageHeight - 60) {
        addNewPage();
        y = margin;
      }

      const severity = index < 2 ? 'CRITICAL' : 'MEDIUM';
      const severityColor = index < 2 ? COLORS.danger : COLORS.warning;

      // Issue header
      doc.setFillColor(...severityColor);
      doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${severity} ISSUE | Question ${failure.id}`, margin + 3, y + 6);

      y += 15;

      // Question text
      doc.setTextColor(...COLORS.text);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      const questionLines = doc.splitTextToSize(failure.question, contentWidth - 10);
      doc.text(questionLines, margin + 5, y);
      y += questionLines.length * 5 + 8;

      // Regulatory Impact
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('📋 REGULATORY IMPACT', margin + 5, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const implicationLines = doc.splitTextToSize(failure.implication, contentWidth - 10);
      doc.text(implicationLines, margin + 5, y);
      y += implicationLines.length * 4 + 6;

      // Recommended Actions
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('💡 RECOMMENDED ACTIONS', margin + 5, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`• Review communication content against ${failure.ref} guidance`, margin + 8, y);
      y += 4;
      doc.text('• Consult with compliance team or legal advisor', margin + 8, y);
      y += 4;
      doc.text('• Document assessment rationale and decision', margin + 8, y);
      y += 4;
      if (severity === 'CRITICAL') {
        doc.setFont('helvetica', 'bold');
        doc.text('• Priority: Address within 14 days', margin + 8, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
      }

      y += 8;

      // Reference
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.primary);
      doc.setFontSize(8);
      doc.text(`📚 Reference: ${failure.ref}`, margin + 5, y);

      y += 12;
      doc.setTextColor(...COLORS.text);
    });
  }

  // ====== PAGE 5: SECTION BREAKDOWN ======
  addNewPage();

  y = margin;
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, y, pageWidth, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SECTION BREAKDOWN', pageWidth / 2, y + 8, { align: 'center' });

  y += 25;

  // Section performance table
  const sectionData = questions.map((section, index) => {
    const sectionQuestions = section.items.length;
    const sectionAnswers = section.items.filter(item => answers[item.id]).length;
    const percentage = Math.round((sectionAnswers / sectionQuestions) * 100);

    return [
      `Section ${index + 1}`,
      section.title?.replace(/Section \d+: /g, "") || 'Unknown',
      `${sectionAnswers}/${sectionQuestions}`,
      `${percentage}%`
    ];
  });

  doc.autoTable({
    startY: y,
    head: [['Section', 'Title', 'Answered', 'Completion']],
    body: sectionData,
    theme: 'grid',
    headStyles: { fillColor: COLORS.primary, fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 80 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
    },
  });

  // ====== FINAL PAGE: CONCLUSION & CONTACT ======
  addNewPage();

  y = margin;
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, y, pageWidth, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CONCLUSION & NEXT STEPS', pageWidth / 2, y + 8, { align: 'center' });

  y += 30;

  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const conclusionText = `Your ${results.healthScore}% compliance score demonstrates ${healthStatus.toLowerCase()} foundation in FCA financial promotions compliance. By addressing the ${results.potentialFailures.length} identified areas for improvement, you can achieve comprehensive regulatory adherence.`;

  const conclusionLines = doc.splitTextToSize(conclusionText, contentWidth);
  doc.text(conclusionLines, margin, y);
  y += conclusionLines.length * 6 + 15;

  // Contact section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CONTACT US', margin, y);

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  doc.text('MEMA Consultants Ltd', margin, y);
  y += 6;
  doc.text('Email: compliance@memaconsultants.com', margin, y);
  y += 6;
  doc.text('Web: www.memaconsultants.com/finproms', margin, y);

  y += 15;

  // Disclaimer
  doc.setFillColor(...COLORS.bgLight);
  doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DISCLAIMER', margin + 5, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const disclaimerText = 'This report provides a general assessment based on the information you provided. It does not constitute legal advice. Organizations should consult with qualified compliance professionals before implementing changes.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 10);
  doc.text(disclaimerLines, margin + 5, y + 14);

  y += 50;
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.textSecondary);
  doc.text(`© ${new Date().getFullYear()} MEMA Consultants Ltd. All rights reserved.`, margin, y);

  addPageNumber();

  // Save the PDF
  const fileName = `FinProms_Compliance_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);

  return fileName;
};
