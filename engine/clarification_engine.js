/**
 * CLARIFICATION ENGINE
 * 
 * Generates 3-5 context-aware questions based on incomplete or ambiguous patient data.
 * STRICTLY clarification; NEVER provides medical advice or diagnostic speculation.
 */

function generateClarificationQuestions(patientData) {
  const questions = [];
  const symptoms = patientData.symptoms || [];
  const medications = patientData.medications || [];
  const labResults = patientData.labResults || [];
  const conflicts = patientData.conflicts || [];

  // Question generator 1: Symptom timeline / onset / frequency
  symptoms.forEach(s => {
    const sName = (typeof s === 'string' ? s : s.name || '').trim();
    if (!sName) return;

    const lower = sName.toLowerCase();
    if (lower.includes('headache') && !questions.some(q => q.topic === 'headache')) {
      questions.push({
        id: 'clarif_headache_onset',
        topic: 'headache',
        category: 'Symptom Characterization',
        question: `For how long have you been experiencing headaches, and do they occur daily or intermittently?`,
        rationale: 'Reported symptom does not specify duration or frequency pattern.',
        contextField: 'symptoms',
        status: 'Unanswered',
        answer: null
      });
    }

    if (lower.includes('fatigue') && !questions.some(q => q.topic === 'fatigue')) {
      questions.push({
        id: 'clarif_fatigue_pattern',
        topic: 'fatigue',
        category: 'Symptom Characterization',
        question: `When you experience fatigue, does it typically worsen at specific times of the day or after physical activity?`,
        rationale: 'Fatigue was noted in intake without descriptive context.',
        contextField: 'symptoms',
        status: 'Unanswered',
        answer: null
      });
    }
  });

  // Question generator 2: Medication dosage / timing
  medications.forEach(m => {
    const mName = (typeof m === 'string' ? m : m.name || '').trim();
    const dosage = typeof m === 'object' ? m.dosage : null;
    if (mName && (!dosage || dosage === 'dose unspecified' || dosage === 'N/A')) {
      if (!questions.some(q => q.topic === 'med_dosage')) {
        questions.push({
          id: 'clarif_med_' + Math.random().toString(36).substring(2, 6),
          topic: 'med_dosage',
          category: 'Medication Intake Detail',
          question: `What dosage and schedule do you take for ${mName} (for example: once daily in the morning)?`,
          rationale: 'Active medication was reported without dosage strength or daily timing.',
          contextField: 'medications',
          status: 'Unanswered',
          answer: null
        });
      }
    }
  });

  // Question generator 3: Conflict followup (if conflict radar found an issue)
  if (conflicts.length > 0 && !questions.some(q => q.topic === 'allergy_clarification')) {
    const allergyConflict = conflicts.find(c => c.category.includes('ALLERGY'));
    if (allergyConflict) {
      questions.push({
        id: 'clarif_allergy_history',
        topic: 'allergy_clarification',
        category: 'Allergy Reconciliation',
        question: 'Could you confirm if you have ever had hives, swelling, or difficulty breathing after penicillin, or if that previous record was in error?',
        rationale: 'Contradiction between current intake and 2025 clinic notes.',
        contextField: 'allergies',
        status: 'Unanswered',
        answer: null
      });
    }
  }

  // Question generator 4: Fasting state check for metabolic tests
  const glucoseTest = labResults.find(l => l.testName.toLowerCase().includes('glucose'));
  if (glucoseTest && !questions.some(q => q.topic === 'fasting_state')) {
    questions.push({
      id: 'clarif_fasting_state',
      topic: 'fasting_state',
      category: 'Test Preparation Context',
      question: `Were you fasting (at least 8 to 12 hours with water only) prior to having your blood drawn for the glucose test?`,
      rationale: 'Fasting status is required for accurate interpretation of reference ranges in glucose tests.',
      contextField: 'labResults',
      status: 'Unanswered',
      answer: null
    });
  }

  // Ensure 3 to 5 questions
  if (questions.length < 3) {
    questions.push({
      id: 'clarif_general_followup',
      topic: 'general_followup',
      category: 'Clinical Intake Context',
      question: 'Have you had any recent changes in prescription medications or over-the-counter supplements in the past 3 months?',
      rationale: 'Intake record does not note over-the-counter supplements or changes.',
      contextField: 'medications',
      status: 'Unanswered',
      answer: null
    });
  }

  return questions.slice(0, 5);
}

module.exports = {
  generateClarificationQuestions
};
