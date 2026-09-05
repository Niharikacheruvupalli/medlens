// Medical Dictionary for terminology normalization and alias resolution
// Preserves original terms for clinical auditability

const MEDICAL_DICTIONARY = [
  {
    canonical: 'Hemoglobin',
    category: 'Hematology',
    aliases: ['hb', 'hgb', 'hemoglobin', 'haemoglobin', 'hb count'],
    standardUnit: 'g/dL',
    description: 'Oxygen-carrying protein in red blood cells'
  },
  {
    canonical: 'White Blood Cell Count',
    category: 'Hematology',
    aliases: ['wbc', 'wbc count', 'white blood cell', 'white blood cells', 'leukocyte count', 'total leukocyte count', 'tlc'],
    standardUnit: '/mcL',
    description: 'Immune cells that fight infection'
  },
  {
    canonical: 'Platelet Count',
    category: 'Hematology',
    aliases: ['plt', 'platelets', 'platelet count', 'thrombocyte count'],
    standardUnit: '/mcL',
    description: 'Cell fragments essential for blood clotting'
  },
  {
    canonical: 'Red Blood Cell Count',
    category: 'Hematology',
    aliases: ['rbc', 'rbc count', 'red blood cell', 'erythrocyte count'],
    standardUnit: 'million/mcL',
    description: 'Cells that transport oxygen throughout the body'
  },
  {
    canonical: 'Hematocrit',
    category: 'Hematology',
    aliases: ['hct', 'hematocrit', 'haematocrit', 'pcv', 'packed cell volume'],
    standardUnit: '%',
    description: 'Proportion of red blood cells in the blood'
  },
  {
    canonical: 'Fasting Blood Glucose',
    category: 'Metabolic / Glycemic',
    aliases: ['fbs', 'fasting glucose', 'fasting blood sugar', 'glucose fasting', 'blood sugar fasting', 'fbg', 'glucose, fasting', 'blood glucose'],
    standardUnit: 'mg/dL',
    description: 'Blood sugar measured after overnight fasting'
  },
  {
    canonical: 'Serum Creatinine',
    category: 'Renal / Kidney',
    aliases: ['creatinine', 'serum creatinine', 'creat', 's. creatinine', 'sr. creatinine'],
    standardUnit: 'mg/dL',
    description: 'Metabolic waste product filtered by the kidneys'
  },
  {
    canonical: 'Blood Urea Nitrogen (BUN)',
    category: 'Renal / Kidney',
    aliases: ['bun', 'blood urea nitrogen', 'urea nitrogen', 'urea'],
    standardUnit: 'mg/dL',
    description: 'Waste product formed from protein breakdown'
  },
  {
    canonical: 'Total Cholesterol',
    category: 'Lipid Profile',
    aliases: ['total cholesterol', 'tchol', 'cholesterol total', 'cholesterol', 't. chol'],
    standardUnit: 'mg/dL',
    description: 'Overall measure of cholesterol in the blood'
  },
  {
    canonical: 'Triglycerides',
    category: 'Lipid Profile',
    aliases: ['triglycerides', 'triglyceride', 'tg', 'trigs'],
    standardUnit: 'mg/dL',
    description: 'Common type of fat circulating in the bloodstream'
  },
  {
    canonical: 'HDL Cholesterol',
    category: 'Lipid Profile',
    aliases: ['hdl', 'hdl cholesterol', 'high density lipoprotein', 'good cholesterol', 'hdl-c'],
    standardUnit: 'mg/dL',
    description: 'High-density lipoprotein cholesterol'
  },
  {
    canonical: 'LDL Cholesterol',
    category: 'Lipid Profile',
    aliases: ['ldl', 'ldl cholesterol', 'low density lipoprotein', 'bad cholesterol', 'ldl-c'],
    standardUnit: 'mg/dL',
    description: 'Low-density lipoprotein cholesterol'
  },
  {
    canonical: 'Alanine Aminotransferase (ALT)',
    category: 'Hepatic / Liver',
    aliases: ['alt', 'sgpt', 'alanine aminotransferase', 's.g.p.t.'],
    standardUnit: 'U/L',
    description: 'Enzyme found primarily in the liver'
  },
  {
    canonical: 'Aspartate Aminotransferase (AST)',
    category: 'Hepatic / Liver',
    aliases: ['ast', 'sgot', 'aspartate aminotransferase', 's.g.o.t.'],
    standardUnit: 'U/L',
    description: 'Enzyme found in liver and heart tissues'
  },
  {
    canonical: 'Thyroid Stimulating Hormone (TSH)',
    category: 'Endocrine / Thyroid',
    aliases: ['tsh', 'thyroid stimulating hormone', 's. tsh', 'tsh ultra'],
    standardUnit: 'uIU/mL',
    description: 'Pituitary hormone regulating thyroid function'
  },
  {
    canonical: 'Serum Potassium',
    category: 'Electrolytes',
    aliases: ['potassium', 'k+', 'serum potassium', 'potassium (k)'],
    standardUnit: 'mmol/L',
    description: 'Essential electrolyte for nerve and muscle function'
  },
  {
    canonical: 'Serum Sodium',
    category: 'Electrolytes',
    aliases: ['sodium', 'na+', 'serum sodium', 'sodium (na)'],
    standardUnit: 'mmol/L',
    description: 'Electrolyte regulating fluid balance'
  }
];

module.exports = { MEDICAL_DICTIONARY };
