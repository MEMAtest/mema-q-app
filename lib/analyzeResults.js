// lib/analyzeResults.js
// Analyzes assessment answers and generates compliance results

export function analyzeResults(questions, answers) {
  const potentialFailures = [];
  let compliantAnswersForScore = 0;
  let answeredQuestionsForScore = 0;

  const sectionData = questions.map(section => {
    let sectionYesCount = 0;
    let sectionNoCount = 0;
    let sectionOtherCount = 0;
    let sectionUnansweredCount = 0;

    section.items.forEach(item => {
      const answer = answers[item.id]?.answer;
      let isFailure = false;
      let implicationText = '';

      if (answer) answeredQuestionsForScore++;

      if (item.type === 'yesno') {
        if (answer === 'Yes') {
          compliantAnswersForScore++;
          sectionYesCount++;
        } else if (answer === 'No') {
          sectionNoCount++;
          if (item.complianceImplicationIfNo) {
            isFailure = true;
            implicationText = item.complianceImplicationIfNo;
          }
        } else {
          sectionUnansweredCount++;
        }
      } else if (item.type === 'dropdown' || item.type === 'multiselect') {
        const selection = Array.isArray(answer) ? answer : [answer];
        let hasFailure = false;

        if (item.complianceImplicationIfSelected) {
          selection.forEach(sel => {
            if (item.complianceImplicationIfSelected[sel]) {
              hasFailure = true;
              implicationText = item.complianceImplicationIfSelected[sel];
            }
          });
        }

        if (hasFailure) {
          isFailure = true;
          sectionNoCount++;
        } else if (answer) {
          compliantAnswersForScore++;
          sectionOtherCount++;
        } else {
          sectionUnansweredCount++;
        }
      }

      if (isFailure) {
        potentialFailures.push({
          id: item.id,
          question: item.questionText,
          ref: item.questionRef,
          implication: implicationText,
          notes: answers[item.id]?.notes || ''
        });
      }
    });

    return {
      title: (section.title || section.sectionTitle || 'Unknown Section').replace(/Section \d+: /g, ""),
      counts: [sectionYesCount, sectionNoCount, sectionOtherCount, sectionUnansweredCount]
    };
  });

  const healthScore = answeredQuestionsForScore > 0
    ? Math.round((compliantAnswersForScore / answeredQuestionsForScore) * 100)
    : 0;

  const chartData = {
    doughnut: [healthScore, 100 - healthScore],
    bar: {
      labels: sectionData.map(s => s.title),
      datasets: [
        { label: 'Yes', data: sectionData.map(s => s.counts[0]), backgroundColor: 'rgba(56, 189, 123, 0.7)' },
        { label: 'No / Issue', data: sectionData.map(s => s.counts[1]), backgroundColor: 'rgba(239, 68, 68, 0.7)' },
        { label: 'Other', data: sectionData.map(s => s.counts[2]), backgroundColor: 'rgba(99, 102, 241, 0.7)' },
        { label: 'Unanswered', data: sectionData.map(s => s.counts[3]), backgroundColor: 'rgba(245, 158, 11, 0.7)' }
      ]
    }
  };

  return { potentialFailures, healthScore, chartData };
}

export function getRiskLevel(score) {
  if (score >= 80) return 'low';
  if (score >= 50) return 'medium';
  return 'high';
}

export default analyzeResults;
