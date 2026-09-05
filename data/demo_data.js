/**
 * Fictional Demo Patient & Document Suite
 * Patient: Aarav Sharma, Age 42
 * Strictly fictional data created for evaluation.
 */

const AARAV_SHARMA_DEMO = {
  id: 'patient_aarav_sharma_001',
  name: 'Aarav Sharma',
  age: 42,
  sex: 'Male',
  intakeDate: '2026-03-04',
  symptoms: [
    {
      id: 'symp_1',
      name: 'Fatigue',
      duration: 'Several weeks, worsening in afternoon',
      severity: 'Moderate',
      sourceType: 'USER_PROVIDED',
      sourceDocument: 'Patient Intake Form',
      confidence: 100,
      verificationStatus: 'Human Verified'
    },
    {
      id: 'symp_2',
      name: 'Headache',
      duration: 'Unspecified onset',
      severity: 'Mild to moderate throbbing',
      sourceType: 'USER_PROVIDED',
      sourceDocument: 'Patient Intake Form',
      confidence: 100,
      verificationStatus: 'Human Verified'
    }
  ],
  conditions: [
    {
      id: 'cond_1',
      name: 'Essential Hypertension',
      diagnosedYear: '2023',
      status: 'Ongoing management',
      sourceType: 'USER_PROVIDED',
      sourceDocument: 'Patient Intake Form',
      confidence: 100,
      verificationStatus: 'Human Verified'
    }
  ],
  allergies: [
    {
      id: 'allergy_1',
      name: 'No known allergies',
      reaction: 'None reported during intake',
      sourceType: 'USER_PROVIDED',
      sourceDocument: 'Patient Intake Form',
      confidence: 98,
      verificationStatus: 'Needs Verification'
    }
  ],
  medications: [
    {
      id: 'med_1',
      name: 'Medication A (Lisinopril)',
      dosage: '10 mg once daily',
      purpose: 'Blood pressure control',
      sourceType: 'USER_PROVIDED',
      sourceDocument: 'Patient Intake Form',
      confidence: 96,
      verificationStatus: 'Human Verified'
    }
  ],
  documents: [
    {
      id: 'doc_2026_blood',
      name: 'Blood_Report_2026.pdf',
      type: 'Laboratory Report (Comprehensive Screen)',
      date: '2026-03-02',
      facility: 'Apex Diagnostic Pathology Labs',
      pageCount: 2,
      processingStatus: 'Processed & Indexed',
      isCurrent: true,
      summary: 'Automated hematology & biochemical panel showing low hemoglobin and elevated fasting glucose.',
      rawText: `APEX DIAGNOSTIC PATHOLOGY LABS
Patient Name: Aarav Sharma   Age: 42   Sex: Male   Date: 2026-03-02
Referring Physician: Dr. K. Sharma   Sample ID: BLD-8921-26

COMPLETE BLOOD EXAMINATION & BIOCHEMISTRY (Page 1)
----------------------------------------------------------------------------------
Test Name                      Observed Value   Unit        Reported Reference Range
----------------------------------------------------------------------------------
Hemoglobin                     10.2             g/dL        13.0 - 17.0
White Blood Cell Count (WBC)   8,100            /mcL        4,000 - 11,000
Platelet Count                 240,000          /mcL        150,000 - 450,000
Fasting Blood Glucose          118              mg/dL       70 - 99
Serum Creatinine               0.95             mg/dL       0.70 - 1.30
Total Cholesterol              210              mg/dL       Ref range not stated
----------------------------------------------------------------------------------
Observations: Red blood cells show mild hypochromia. No abnormal leukemic cells seen.
Technician: R. Nathan   Verified by: Dr. S. Rao, MD (Pathology)`
    },
    {
      id: 'doc_2024_cbc',
      name: 'Previous_CBC_2024.pdf',
      type: 'Laboratory Report (Baseline CBC)',
      date: '2024-02-14',
      facility: 'City Health Diagnostic Centre',
      pageCount: 1,
      processingStatus: 'Processed & Indexed',
      isPrevious: true,
      summary: 'Baseline Complete Blood Count from previous annual health checkup.',
      rawText: `CITY HEALTH DIAGNOSTIC CENTRE
Patient Name: Aarav Sharma   Age: 40   Sex: Male   Date: 2024-02-14
ROUTINE HEMATOLOGY PANEL (Page 1)
----------------------------------------------------------------------------------
Test Name                      Observed Value   Unit        Reported Reference Range
----------------------------------------------------------------------------------
Hemoglobin                     11.1             g/dL        13.0 - 17.0
White Blood Cell Count (WBC)   7,200            /mcL        4,000 - 11,000
Platelet Count                 230,000          /mcL        150,000 - 450,000
Fasting Blood Glucose          95               mg/dL       70 - 99
Serum Creatinine               0.92             mg/dL       0.70 - 1.30
----------------------------------------------------------------------------------
Impression: Mild baseline microcytic trend noted. Advised clinical correlation.`
    },
    {
      id: 'doc_2025_clinic',
      name: 'Clinic_Summary_2025.pdf',
      type: 'Outpatient Clinic Record & Prescription',
      date: '2025-04-12',
      facility: 'Metro Wellness Clinic - Dr. Ananya Mehra',
      pageCount: 1,
      processingStatus: 'Processed & Indexed',
      summary: 'Followup consultation notes documenting penicillin allergy history and hypertension management.',
      rawText: `METRO WELLNESS CLINIC - CONSULTATION NOTE
Patient: Aarav Sharma (41M)   Date: 2025-04-12
Attending Physician: Dr. Ananya Mehra, MD (Internal Medicine)
Subjective: Patient presents for annual review of blood pressure. Feeling reasonably well.
Documented Allergies: Penicillin allergy documented (Patient experienced hives and maculopapular rash following Amoxicillin course in 2021). Avoid beta-lactams.
Current Regimen: Lisinopril 10mg PO QD for hypertension.
Plan: Continue Lisinopril. Repeat routine metabolic panel next spring.`
    }
  ],
  labResults: [
    {
      id: 'lab_hb_2026',
      testName: 'Hemoglobin',
      originalTestName: 'Hemoglobin',
      category: 'Hematology',
      value: '10.2',
      unit: 'g/dL',
      referenceRange: '13.0 - 17.0',
      hasReferenceRange: true,
      status: 'LOW',
      displayStatus: 'Below reported reference range',
      statusClass: 'status-warning-low',
      rangeExplanation: '10.2 g/dL is below the reference range of 13.0–17.0 g/dL provided in the source report.',
      source: 'Laboratory Report',
      sourceDocument: 'Blood_Report_2026.pdf',
      page: 'Page 1',
      reportDate: '2026-03-02',
      originalSnippet: 'Hemoglobin                     10.2             g/dL        13.0 - 17.0',
      confidence: 96,
      verificationStatus: 'Needs Verification',
      userNotes: '',
      history: [
        { action: 'AI_EXTRACTED', timestamp: '2026-03-04T08:15:00Z', details: 'Extracted from Blood_Report_2026.pdf (Page 1) with 96% confidence.' }
      ]
    },
    {
      id: 'lab_wbc_2026',
      testName: 'White Blood Cell Count',
      originalTestName: 'White Blood Cell Count (WBC)',
      category: 'Hematology',
      value: '8,100',
      unit: '/mcL',
      referenceRange: '4,000 - 11,000',
      hasReferenceRange: true,
      status: 'NORMAL',
      displayStatus: 'Within reported range',
      statusClass: 'status-normal',
      rangeExplanation: '8,100 /mcL is within the reference range of 4,000–11,000 /mcL provided in the source report.',
      source: 'Laboratory Report',
      sourceDocument: 'Blood_Report_2026.pdf',
      page: 'Page 1',
      reportDate: '2026-03-02',
      originalSnippet: 'White Blood Cell Count (WBC)   8,100            /mcL        4,000 - 11,000',
      confidence: 97,
      verificationStatus: 'Human Verified',
      userNotes: 'Verified against Apex Diagnostic physical slip.',
      history: [
        { action: 'AI_EXTRACTED', timestamp: '2026-03-04T08:15:00Z', details: 'Extracted with 97% confidence.' },
        { action: 'HUMAN_VERIFIED', timestamp: '2026-03-04T08:20:00Z', details: 'Verified by patient/clinician.' }
      ]
    },
    {
      id: 'lab_plt_2026',
      testName: 'Platelet Count',
      originalTestName: 'Platelet Count',
      category: 'Hematology',
      value: '240,000',
      unit: '/mcL',
      referenceRange: '150,000 - 450,000',
      hasReferenceRange: true,
      status: 'NORMAL',
      displayStatus: 'Within reported range',
      statusClass: 'status-normal',
      rangeExplanation: '240,000 /mcL is within the reference range of 150,000–450,000 /mcL provided in the source report.',
      source: 'Laboratory Report',
      sourceDocument: 'Blood_Report_2026.pdf',
      page: 'Page 1',
      reportDate: '2026-03-02',
      originalSnippet: 'Platelet Count                 240,000          /mcL        150,000 - 450,000',
      confidence: 96,
      verificationStatus: 'AI Extracted',
      userNotes: '',
      history: [
        { action: 'AI_EXTRACTED', timestamp: '2026-03-04T08:15:00Z', details: 'Extracted with 96% confidence.' }
      ]
    },
    {
      id: 'lab_fbs_2026',
      testName: 'Fasting Blood Glucose',
      originalTestName: 'Fasting Blood Glucose',
      category: 'Metabolic / Glycemic',
      value: '118',
      unit: 'mg/dL',
      referenceRange: '70 - 99',
      hasReferenceRange: true,
      status: 'HIGH',
      displayStatus: 'Above reported reference range',
      statusClass: 'status-warning-high',
      rangeExplanation: '118 mg/dL is above the reference range of 70–99 mg/dL provided in the source report.',
      source: 'Laboratory Report',
      sourceDocument: 'Blood_Report_2026.pdf',
      page: 'Page 1',
      reportDate: '2026-03-02',
      originalSnippet: 'Fasting Blood Glucose          118              mg/dL       70 - 99',
      confidence: 98,
      verificationStatus: 'Needs Verification',
      userNotes: '',
      history: [
        { action: 'AI_EXTRACTED', timestamp: '2026-03-04T08:15:00Z', details: 'Extracted with 98% confidence.' }
      ]
    },
    {
      id: 'lab_creat_2026',
      testName: 'Serum Creatinine',
      originalTestName: 'Serum Creatinine',
      category: 'Renal / Kidney',
      value: '0.95',
      unit: 'mg/dL',
      referenceRange: '0.70 - 1.30',
      hasReferenceRange: true,
      status: 'NORMAL',
      displayStatus: 'Within reported range',
      statusClass: 'status-normal',
      rangeExplanation: '0.95 mg/dL is within the reference range of 0.70–1.30 mg/dL provided in the source report.',
      source: 'Laboratory Report',
      sourceDocument: 'Blood_Report_2026.pdf',
      page: 'Page 1',
      reportDate: '2026-03-02',
      originalSnippet: 'Serum Creatinine               0.95             mg/dL       0.70 - 1.30',
      confidence: 95,
      verificationStatus: 'AI Extracted',
      userNotes: '',
      history: [
        { action: 'AI_EXTRACTED', timestamp: '2026-03-04T08:15:00Z', details: 'Extracted with 95% confidence.' }
      ]
    },
    {
      id: 'lab_chol_2026',
      testName: 'Total Cholesterol',
      originalTestName: 'Total Cholesterol',
      category: 'Lipid Profile',
      value: '210',
      unit: 'mg/dL',
      referenceRange: 'Unavailable in source report',
      hasReferenceRange: false,
      status: 'UNKNOWN',
      displayStatus: 'Reference range unavailable',
      statusClass: 'status-neutral',
      rangeExplanation: 'Information unavailable in source. MedLens strictly evaluates against source-reported ranges and does not substitute external standards.',
      source: 'Laboratory Report',
      sourceDocument: 'Blood_Report_2026.pdf',
      page: 'Page 1',
      reportDate: '2026-03-02',
      originalSnippet: 'Total Cholesterol              210              mg/dL       Ref range not stated',
      confidence: 89,
      verificationStatus: 'Needs Verification',
      userNotes: '',
      history: [
        { action: 'AI_EXTRACTED', timestamp: '2026-03-04T08:15:00Z', details: 'Extracted value without reference range.' }
      ]
    }
  ],
  previousLabResults: [
    {
      testName: 'Hemoglobin',
      value: '11.1',
      unit: 'g/dL',
      referenceRange: '13.0 - 17.0',
      status: 'LOW',
      date: '2024-02-14',
      sourceDocument: 'Previous_CBC_2024.pdf',
      page: 'Page 1'
    },
    {
      testName: 'White Blood Cell Count',
      value: '7,200',
      unit: '/mcL',
      referenceRange: '4,000 - 11,000',
      status: 'NORMAL',
      date: '2024-02-14',
      sourceDocument: 'Previous_CBC_2024.pdf',
      page: 'Page 1'
    },
    {
      testName: 'Platelet Count',
      value: '230,000',
      unit: '/mcL',
      referenceRange: '150,000 - 450,000',
      status: 'NORMAL',
      date: '2024-02-14',
      sourceDocument: 'Previous_CBC_2024.pdf',
      page: 'Page 1'
    },
    {
      testName: 'Fasting Blood Glucose',
      value: '95',
      unit: 'mg/dL',
      referenceRange: '70 - 99',
      status: 'NORMAL',
      date: '2024-02-14',
      sourceDocument: 'Previous_CBC_2024.pdf',
      page: 'Page 1'
    },
    {
      testName: 'Serum Creatinine',
      value: '0.92',
      unit: 'mg/dL',
      referenceRange: '0.70 - 1.30',
      status: 'NORMAL',
      date: '2024-02-14',
      sourceDocument: 'Previous_CBC_2024.pdf',
      page: 'Page 1'
    }
  ],
  timeline: [
    {
      id: 'time_1',
      year: '2024',
      date: 'Feb 14, 2024',
      title: 'Baseline Laboratory Panel (CBC & Routine)',
      category: 'Diagnostic Report',
      source: 'Previous_CBC_2024.pdf',
      badge: 'Previous Record',
      keyFindings: [
        'Hemoglobin observed at 11.1 g/dL (Below reported 13–17 g/dL range)',
        'WBC 7,200 /mcL (Normal)',
        'Fasting Glucose 95 mg/dL (Normal)'
      ],
      details: 'City Health Diagnostic Centre routine health checkup.'
    },
    {
      id: 'time_2',
      year: '2025',
      date: 'Apr 12, 2025',
      title: 'Hypertension Consultation & Allergy Record',
      category: 'Clinic Record',
      source: 'Clinic_Summary_2025.pdf',
      badge: 'Clinical Encounter',
      keyFindings: [
        'Documented Penicillin allergy (adverse reaction to Amoxicillin in 2021)',
        'Prescribed Lisinopril 10mg daily for blood pressure maintenance'
      ],
      details: 'Dr. Ananya Mehra, Metro Wellness Clinic.'
    },
    {
      id: 'time_3',
      year: '2026',
      date: 'Mar 02, 2026',
      title: 'Comprehensive Diagnostic Examination',
      category: 'Current Report',
      source: 'Blood_Report_2026.pdf',
      badge: 'Active Record',
      keyFindings: [
        'Hemoglobin 10.2 g/dL (Below reported 13–17 g/dL range)',
        'Fasting Glucose 118 mg/dL (Above reported 70–99 mg/dL range)',
        'Total Cholesterol 210 mg/dL (Reference range unavailable)'
      ],
      details: 'Apex Diagnostic Pathology Labs investigation.'
    },
    {
      id: 'time_4',
      year: '2026',
      date: 'Mar 04, 2026',
      title: 'Digital Patient Intake Submission',
      category: 'Patient Provided',
      source: 'MedLens Intake Portal',
      badge: 'User Input',
      keyFindings: [
        'Reported symptoms: Fatigue and recurring headache',
        'Intake allergy status: Stated "No known allergies"'
      ],
      details: 'Completed by Aarav Sharma prior to clinical visit.'
    }
  ],
  conflicts: [
    {
      id: 'conflict_allergy_penicillin',
      category: 'ALLERGY INFORMATION',
      severity: 'moderate',
      title: 'Allergy status contradiction detected',
      sourceA: {
        label: 'Patient Intake',
        document: 'Intake Form (Self-Reported)',
        value: 'No known allergies',
        date: '2026-03-04'
      },
      sourceB: {
        label: 'Previous Record',
        document: 'Clinic_Summary_2025.pdf (Page 1)',
        value: 'Penicillin allergy documented (Hives/rash to Amoxicillin)',
        date: '2025-04-12'
      },
      status: 'Needs clarification',
      statusClass: 'status-conflict',
      explanation: 'Patient intake form states "No known allergies", whereas Dr. Mehra\'s consultation note from April 2025 documents an allergic reaction to Penicillin/Amoxicillin. MedLens does not decide which source is correct and flags this for clarification.',
      suggestedQuestion: 'Have you ever experienced an allergic reaction to penicillin, or has a doctor advised you to avoid beta-lactam antibiotics?',
      resolved: false,
      resolution: null
    }
  ],
  clarificationQuestions: [
    {
      id: 'clarif_headache_onset',
      topic: 'headache',
      category: 'Symptom Characterization',
      question: 'When did your headaches begin, and how frequently do they occur (e.g., daily, weekly, or following specific activities)?',
      rationale: 'Headache was reported during intake without onset timeframe or frequency pattern.',
      contextField: 'symptoms',
      status: 'Unanswered',
      answer: null
    },
    {
      id: 'clarif_fatigue_pattern',
      topic: 'fatigue',
      category: 'Symptom Characterization',
      question: 'Does the fatigue you reported improve after a full night of sleep, or does it persist regardless of rest?',
      rationale: 'Fatigue characteristics help describe the symptom for clinical review.',
      contextField: 'symptoms',
      status: 'Unanswered',
      answer: null
    },
    {
      id: 'clarif_allergy_reconcile',
      topic: 'allergy',
      category: 'Allergy Reconciliation',
      question: 'Could you clarify whether you have experienced an allergic reaction to penicillin in the past, or whether the 2025 clinic record may be in error?',
      rationale: 'Direct contradiction between intake submission and 2025 clinic notes.',
      contextField: 'allergies',
      status: 'Unanswered',
      answer: null
    },
    {
      id: 'clarif_glucose_fasting',
      topic: 'fasting_state',
      category: 'Test Preparation Context',
      question: 'Were you fasting for at least 8 to 12 hours prior to the blood draw for the Fasting Glucose test on March 2, 2026?',
      rationale: 'Fasting state is necessary to evaluate blood glucose values against the reported 70–99 mg/dL reference range.',
      contextField: 'labResults',
      status: 'Unanswered',
      answer: null
    }
  ],
  auditLog: [
    {
      id: 'audit_01',
      timestamp: '2026-03-04T08:14:00Z',
      action: 'PATIENT_INTAKE_SUBMITTED',
      user: 'Aarav Sharma (Patient)',
      details: 'Initial digital intake completed with symptoms, conditions, and medication declarations.'
    },
    {
      id: 'audit_02',
      timestamp: '2026-03-04T08:15:20Z',
      action: 'DOCUMENTS_INGESTED',
      user: 'MedLens Ingestion Service',
      details: 'Indexed Blood_Report_2026.pdf, Previous_CBC_2024.pdf, and Clinic_Summary_2025.pdf.'
    },
    {
      id: 'audit_03',
      timestamp: '2026-03-04T08:15:25Z',
      action: 'AI_EXTRACTION_COMPLETED',
      user: 'MedLens Clinical Intelligence Engine',
      details: 'Extracted 6 current lab parameters, 5 longitudinal comparison parameters, and detected 1 cross-source allergy conflict.'
    },
    {
      id: 'audit_04',
      timestamp: '2026-03-04T08:20:10Z',
      action: 'FIELD_VERIFIED',
      user: 'Reviewer (Aarav / Intake Staff)',
      details: 'Verified White Blood Cell Count (8,100 /mcL).'
    }
  ]
};

module.exports = {
  AARAV_SHARMA_DEMO
};
