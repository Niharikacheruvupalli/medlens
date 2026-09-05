/**
 * Sample Report Texts for quick testing & live upload simulation
 */

const SAMPLE_REPORTS = {
  cbc_report: {
    title: 'Complete Blood Count (CBC) Panel',
    filename: 'Sample_CBC_Report.pdf',
    date: '2026-03-02',
    facility: 'Metro Health Pathology Labs',
    text: `METRO HEALTH PATHOLOGY LABS
Patient Name: Priya Patel    Age: 38    Sex: Female    Date: 2026-03-02
Test Investigation: Complete Blood Examination (Page 1)

Parameter                     Value       Unit       Reference Range
----------------------------------------------------------------------
Hemoglobin (Hb)               10.5        g/dL       12.0 - 15.5
Total Leukocyte Count (WBC)   7,400       /mcL       4,000 - 11,000
Platelet Count                210,000     /mcL       150,000 - 450,000
Red Blood Cell Count (RBC)    3.9         million/mcL 4.2 - 5.4
Hematocrit (PCV)              32.4        %          37.0 - 48.0
----------------------------------------------------------------------
Note: Moderate microcytic hypochromic picture. Verified by Lab Director.`
  },
  metabolic_report: {
    title: 'Comprehensive Metabolic Panel (CMP)',
    filename: 'Metabolic_Panel_2026.pdf',
    date: '2026-02-28',
    facility: 'St. Jude Clinical Diagnostics',
    text: `ST. JUDE CLINICAL DIAGNOSTICS
Patient Name: David Chen    Age: 54    Sex: Male    Date: 2026-02-28
Department of Clinical Biochemistry (Page 1)

Test Description              Result      Unit       Reported Range
----------------------------------------------------------------------
Fasting Blood Sugar           126         mg/dL      70 - 99
Serum Creatinine              1.42        mg/dL      0.70 - 1.20
Blood Urea Nitrogen (BUN)     24          mg/dL      7 - 20
Serum Sodium                  140         mmol/L     135 - 145
Serum Potassium               4.6         mmol/L     3.5 - 5.0
----------------------------------------------------------------------
Remarks: Sample non-hemolyzed. Fasting verified at 10 hours.`
  },
  lipid_unspecified_range: {
    title: 'Lipid & Specialized Tests (With Missing Range)',
    filename: 'Cardio_Lipid_Report.pdf',
    date: '2026-01-15',
    facility: 'Valley Medical Center',
    text: `VALLEY MEDICAL CENTER - AMBULATORY LABS
Patient Name: Elena Rostova    Age: 46    Sex: Female    Date: 2026-01-15

Investigation                 Observed    Unit       Reference Range
----------------------------------------------------------------------
Total Cholesterol             228         mg/dL      Ref range not stated
Triglycerides                 165         mg/dL      < 150
HDL Cholesterol               44          mg/dL      > 50
LDL Cholesterol               142         mg/dL      < 100
Alanine Aminotransferase      34          U/L        10 - 40
----------------------------------------------------------------------
Note: Total cholesterol reference range omitted per client protocol.`
  }
};

module.exports = {
  SAMPLE_REPORTS
};
