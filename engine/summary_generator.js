/**
 * AI SUMMARY GENERATOR: "YOUR RECORD, SIMPLIFIED"
 * 
 * Generates an objective, calm, patient-friendly summary strictly bounded
 * by available records. NEVER diagnoses or prescribes.
 */

function generateRecordSummary(patientData) {
  const labResults = patientData.labResults || [];
  const conflicts = (patientData.conflicts || []).filter(c => !c.resolved);
  const clarifications = (patientData.clarificationQuestions || []).filter(q => q.status === 'Unanswered');
  const symptoms = patientData.symptoms || [];
  const medications = patientData.medications || [];

  // Categorize lab results
  const lowResults = labResults.filter(r => r.status === 'LOW');
  const highResults = labResults.filter(r => r.status === 'HIGH');
  const unknownRangeResults = labResults.filter(r => r.status === 'UNKNOWN');
  const normalResults = labResults.filter(r => r.status === 'NORMAL');
  const unverifiedFields = labResults.filter(r => r.verificationStatus === 'Needs Verification');

  const bulletPoints = [];

  // Patient Intake Overview
  if (symptoms.length > 0 || medications.length > 0) {
    const sympStr = symptoms.map(s => typeof s === 'string' ? s : s.name).join(', ');
    const medStr = medications.map(m => typeof m === 'string' ? m : m.name).join(', ');
    let intakeNote = `Patient intake reports symptoms of ${sympStr || 'none specified'}`;
    if (medStr) intakeNote += `, with active medication usage including ${medStr}.`;
    else intakeNote += '.';
    bulletPoints.push({
      category: 'Intake Profile',
      text: intakeNote
    });
  }

  // Range Analysis Highlights
  const outOfRange = [...lowResults, ...highResults];
  if (outOfRange.length > 0) {
    const details = outOfRange.map(item => {
      const dir = item.status === 'LOW' ? 'below' : 'above';
      return `${item.testName} (${item.value} ${item.unit} vs reported reference range ${item.referenceRange})`;
    }).join('; ');
    bulletPoints.push({
      category: 'Laboratory Observations',
      text: `${outOfRange.length} value${outOfRange.length > 1 ? 's are' : ' is'} outside the reference ranges stated in the uploaded reports: ${details}.`
    });
  } else if (normalResults.length > 0) {
    bulletPoints.push({
      category: 'Laboratory Observations',
      text: `All ${normalResults.length} analyzed laboratory parameters are within their source-reported reference ranges.`
    });
  }

  if (unknownRangeResults.length > 0) {
    const names = unknownRangeResults.map(r => r.testName).join(', ');
    bulletPoints.push({
      category: 'Reference Range Note',
      text: `Reference ranges were unavailable in the source document for: ${names}. MedLens does not substitute external or arbitrary ranges.`
    });
  }

  // Inconsistencies & Verification
  if (conflicts.length > 0) {
    bulletPoints.push({
      category: 'Inconsistencies Flagged',
      text: `${conflicts.length} potential conflict detected across records (including ${conflicts[0].category.toLowerCase()}) that requires human clarification.`
    });
  }

  if (clarifications.length > 0) {
    bulletPoints.push({
      category: 'Pending Clarification',
      text: `${clarifications.length} context-aware follow-up question${clarifications.length > 1 ? 's have' : ' has'} been generated to clarify symptom duration and test context.`
    });
  }

  if (unverifiedFields.length > 0) {
    bulletPoints.push({
      category: 'Verification Status',
      text: `${unverifiedFields.length} extracted field${unverifiedFields.length > 1 ? 's remain' : ' remains'} marked as "Needs Verification" awaiting human review.`
    });
  }

  const paragraphText = `The available records contain information about the patient's reported symptoms, medications, and laboratory results. ${
    outOfRange.length > 0 
      ? `Some laboratory values are outside the reference ranges stated in the uploaded reports (${outOfRange.map(o => o.testName).join(', ')}). ` 
      : 'Extracted laboratory values are within their source-stated ranges. '
  }${
    conflicts.length > 0 ? `${conflicts.length} item requires reconciliation. ` : ''
  }${
    unverifiedFields.length > 0 ? `${unverifiedFields.length} field(s) currently await human verification.` : ''
  }`;

  return {
    title: 'YOUR RECORD, SIMPLIFIED',
    generatedAt: new Date().toISOString(),
    summaryParagraph: paragraphText,
    highlights: bulletPoints,
    metrics: {
      totalTests: labResults.length,
      withinRange: normalResults.length,
      outsideRange: outOfRange.length,
      unavailableRange: unknownRangeResults.length,
      pendingVerification: unverifiedFields.length,
      activeConflicts: conflicts.length
    },
    disclaimer: 'AI-generated summary — verify against source records. MedLens organizes and summarizes supplied medical information. It does not provide diagnosis or treatment recommendations.'
  };
}

module.exports = {
  generateRecordSummary
};
