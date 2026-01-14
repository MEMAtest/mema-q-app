// Dynamic import for SSR compatibility - jsPDF requires browser APIs
export async function exportResultsToPDF(results, questions, answers, leadInfo = {}) {
  // Dynamically import jsPDF to avoid SSR issues
  const { default: jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('MEMA Financial Promotions Compliance Report', 14, 20);

  doc.setFontSize(12);
  doc.text(`Client: ${leadInfo.firm || 'N/A'}`, 14, 30);
  doc.text(`Email: ${leadInfo.email || 'N/A'}`, 14, 36);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 42);

  doc.setFontSize(14);
  doc.text(`Health Score: ${results?.healthScore ?? 0}%`, 14, 55);
  doc.text(`Issues Found: ${results?.potentialFailures?.length ?? 0}`, 14, 63);

  const tableData = [];
  if (Array.isArray(questions)) {
    questions.forEach((section) => {
      section.items.forEach((item) => {
        const userAnswer = answers[item.id];
        const answerText = userAnswer?.answer ? JSON.stringify(userAnswer.answer) : 'N/A';
        const notesText = userAnswer?.notes || '';
        tableData.push([
          item.questionRef || '-',
          item.questionText,
          answerText,
          notesText,
        ]);
      });
    });
  }

  doc.autoTable({
    startY: 75,
    head: [['Ref', 'Question', 'Answer', 'Notes']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 80 },
      2: { cellWidth: 35 },
      3: { cellWidth: 50 },
    },
  });

  doc.save(`MEMA_Compliance_Report_${Date.now()}.pdf`);
}
