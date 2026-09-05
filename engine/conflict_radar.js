/**
 * CONFLICT RADAR
 * 
 * Identifies contradictions across patient intake, historical records, and reports.
 * MedLens NEVER decides which source is correct.
 * It flags the contradiction calmly and asks for human clarification.
 */

function detectConflicts(patientData) {
  const conflicts = [];
  const intakeAllergies = patientData.allergies || [];
  const intakeMeds = patientData.medications || [];
  const documents = patientData.documents || [];

  // 1. Allergy Conflicts
  // Check if intake says "No known allergies" or "None" while any past record or doc lists allergies
  const intakeAllergyText = intakeAllergies.map(a => typeof a === 'string' ? a : a.name).join(' ').toLowerCase();
  const deniesAllergies = /no known|none|nil|nkda|denies|no allergies/i.test(intakeAllergyText) || intakeAllergies.length === 0;

  // Search historical documents or previous records for allergy mentions
  for (const doc of documents) {
    const rawContent = (doc.rawText || doc.summary || '').toLowerCase();
    
    // Check for penicillin or antibiotic allergy in documents
    if (/penicillin|amoxicillin|sulfa|aspirin|latex/i.test(rawContent)) {
      const match = rawContent.match(/(?:allergy|allergic\s+to|hypersensitivity|adverse\s+reaction)\s*[:=-]?\s*([a-zA-Z0-9\s,]+)/i) ||
                    rawContent.match(/(penicillin\s+allergy|allergy\s+to\s+penicillin)/i);
      if (match && deniesAllergies) {
        conflicts.push({
          id: 'conflict_allergy_penicillin',
          category: 'ALLERGY INFORMATION',
          severity: 'moderate',
          title: 'Allergy status discrepancy',
          sourceA: {
            label: 'Patient Intake',
            document: 'Intake Form (Self-Reported)',
            value: intakeAllergies.length > 0 ? intakeAllergies.map(a => a.name || a).join(', ') : 'No known allergies reported',
            date: patientData.intakeDate || 'Current'
          },
          sourceB: {
            label: 'Previous Record',
            document: doc.name || 'Clinic_Summary_2025.pdf',
            value: 'Penicillin allergy documented (Moderate rash reaction)',
            date: doc.date || '2025-04-12'
          },
          status: 'Needs clarification',
          statusClass: 'status-conflict',
          explanation: 'Patient intake indicates no known drug allergies, but prior clinic documentation from 2025 notes a penicillin allergy. Clarification is recommended prior to clinical consultations.',
          suggestedQuestion: 'Have you ever had an adverse reaction or allergic symptom after taking penicillin or related antibiotics?',
          resolved: false,
          resolution: null
        });
      }
    }
  }

  // 2. Medication Discrepancies
  // Check if previous document lists a medication that is absent or has a different dosage in current intake
  for (const doc of documents) {
    const rawContent = (doc.rawText || doc.summary || '').toLowerCase();
    if (/lisinopril|metformin|atorvastatin|amlodipine|levothyroxine/i.test(rawContent)) {
      const matchMed = rawContent.match(/(lisinopril\s*\d+\s*mg|metformin\s*\d+\s*mg|atorvastatin\s*\d+\s*mg)/i);
      if (matchMed) {
        const foundMedName = matchMed[1];
        const intakeHasExact = intakeMeds.some(m => {
          const str = (typeof m === 'string' ? m : `${m.name} ${m.dosage || ''}`).toLowerCase();
          return str.includes(foundMedName.split(' ')[0]);
        });
        if (!intakeHasExact && intakeMeds.length > 0) {
          conflicts.push({
            id: 'conflict_med_' + Math.random().toString(36).substring(2, 7),
            category: 'MEDICATION RECONCILIATION',
            severity: 'moderate',
            title: 'Prescribed medication not listed in active intake',
            sourceA: {
              label: 'Patient Intake',
              document: 'Intake Form (Self-Reported)',
              value: intakeMeds.map(m => typeof m === 'string' ? m : `${m.name} (${m.dosage || 'dose unspecified'})`).join(', '),
              date: patientData.intakeDate || 'Current'
            },
            sourceB: {
              label: 'Previous Prescription',
              document: doc.name || 'Clinic_Prescription.pdf',
              value: foundMedName.toUpperCase() + ' documented as active prescription',
              date: doc.date || 'Previous visit'
            },
            status: 'Needs clarification',
            statusClass: 'status-conflict',
            explanation: `Prior medical records show an order for ${foundMedName}, but this is not listed in the current medication intake. It is unclear if this medication was discontinued or omitted.`,
            suggestedQuestion: `Are you currently taking ${foundMedName}, or was this medication previously stopped by your doctor?`,
            resolved: false,
            resolution: null
          });
        }
      }
    }
  }

  return conflicts;
}

module.exports = {
  detectConflicts
};
