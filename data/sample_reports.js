/**
 * Sample Report Texts for quick testing & live upload simulation
 * Includes medically plausible parameters, demographics, units, and reference ranges.
 */

const SAMPLE_REPORTS = {
  cbc_report: {
    title: 'Complete Blood Count (CBC) Panel',
    filename: 'Sample_Complete_Blood_Count.pdf',
    date: '2026-03-02',
    facility: 'Metro Health Pathology Labs',
    text: `METRO HEALTH PATHOLOGY LABS
Patient Name: Priya Patel    Age: 38    Sex: Female    Date: 2026-03-02
Test Investigation: Complete Blood Count (CBC) (Page 1)

Parameter                     Value       Unit        Reference Range
----------------------------------------------------------------------
Hemoglobin                    10.5        g/dL        12.0 - 15.5
Total Leukocyte Count (WBC)   7,400       /mcL        4,000 - 11,000
Platelet Count                210,000     /mcL        150,000 - 450,000
Red Blood Cell Count (RBC)    3.9         million/mcL 4.2 - 5.4
Hematocrit                    32.4        %           37.0 - 48.0
----------------------------------------------------------------------
Observations: Mild microcytic hypochromic red blood cell morphology. Verified by Lab Director.`
  },
  metabolic_report: {
    title: 'Comprehensive Metabolic Panel (CMP)',
    filename: 'Sample_Comprehensive_Metabolic_Panel.pdf',
    date: '2026-02-28',
    facility: 'St. Jude Clinical Diagnostics',
    text: `ST. JUDE CLINICAL DIAGNOSTICS
Patient Name: David Chen    Age: 54    Sex: Male    Date: 2026-02-28
Test Investigation: Comprehensive Metabolic Panel (CMP) (Page 1)

Test Description              Result      Unit        Reported Reference Range
----------------------------------------------------------------------
Fasting Blood Glucose         126         mg/dL       70 - 99
Serum Creatinine              1.42        mg/dL       0.70 - 1.20
Blood Urea Nitrogen (BUN)     24          mg/dL       7 - 20
Serum Sodium                  140         mmol/L      135 - 145
Serum Potassium               4.6         mmol/L      3.5 - 5.0
----------------------------------------------------------------------
Observations: Fasting state verified at 10 hours. Sample non-hemolyzed. Verified by Pathologist.`
  },
  lipid_unspecified_range: {
    title: 'Lipid Profile (Missing Reference Range Test)',
    filename: 'Sample_Lipid_Panel_Missing_Range.pdf',
    date: '2026-01-15',
    facility: 'Valley Medical Center Diagnostic Laboratories',
    text: `VALLEY MEDICAL CENTER - DIAGNOSTIC LABORATORIES
Patient Name: Elena Rostova    Age: 46    Sex: Female    Date: 2026-01-15
Test Investigation: Lipid & Metabolic Profile (Page 1)

Parameter                     Observed    Unit        Reported Reference Range
----------------------------------------------------------------------
Total Cholesterol             228         mg/dL       Ref range not stated
Triglycerides                 165         mg/dL       < 150
HDL Cholesterol               44          mg/dL       > 50
LDL Cholesterol               142         mg/dL       < 100
Alanine Aminotransferase      34          U/L         10 - 40
----------------------------------------------------------------------
Note: Total Cholesterol reference range omitted per client protocol. Information unavailable in source.`
  }
};

module.exports = {
  SAMPLE_REPORTS
};
