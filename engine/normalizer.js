const { MEDICAL_DICTIONARY } = require('../data/medical_dictionary');

/**
 * Normalizes clinical laboratory test names using the medical dictionary
 * while strictly preserving original verbatim wording.
 */
function normalizeTestName(rawTestName) {
  if (!rawTestName || typeof rawTestName !== 'string') {
    return {
      canonical: 'Unspecified Test',
      originalTestName: rawTestName || 'N/A',
      category: 'General',
      isNormalized: false
    };
  }

  const cleaned = rawTestName.trim();
  const lower = cleaned.toLowerCase();

  // Try exact match first on aliases
  for (const entry of MEDICAL_DICTIONARY) {
    for (const alias of entry.aliases) {
      if (lower === alias.toLowerCase()) {
        return {
          canonical: entry.canonical,
          originalTestName: cleaned,
          category: entry.category,
          standardUnit: entry.standardUnit,
          description: entry.description,
          isNormalized: entry.canonical.toLowerCase() !== lower
        };
      }
    }
  }

  // Try boundary/word match (e.g., "Hemoglobin (Hb)" or "Serum Creatinine Level")
  for (const entry of MEDICAL_DICTIONARY) {
    for (const alias of entry.aliases) {
      const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower)) {
        return {
          canonical: entry.canonical,
          originalTestName: cleaned,
          category: entry.category,
          standardUnit: entry.standardUnit,
          description: entry.description,
          isNormalized: true
        };
      }
    }
  }

  // If no canonical entry matches, preserve original name safely
  return {
    canonical: cleaned,
    originalTestName: cleaned,
    category: 'Other / Specialized',
    standardUnit: '',
    description: 'Extracted clinical measurement',
    isNormalized: false
  };
}

/**
 * Normalizes common clinical unit variations
 */
function normalizeUnit(rawUnit) {
  if (!rawUnit) return '';
  const u = rawUnit.trim().toLowerCase();
  if (u === 'gm/dl' || u === 'g/dl' || u === 'g/100ml') return 'g/dL';
  if (u === 'mg/dl' || u === 'mg%') return 'mg/dL';
  if (u === 'cells/cumm' || u === '/cumm' || u === 'cells/ul' || u === '/ul' || u === '/mcl') return '/mcL';
  if (u === 'u/l' || u === 'iu/l' || u === 'units/l') return 'U/L';
  if (u === 'meq/l' || u === 'mmol/l') return 'mmol/L';
  if (u === 'uiu/ml' || u === 'uu/ml' || u === 'microu/ml') return 'uIU/mL';
  return rawUnit.trim();
}

module.exports = {
  normalizeTestName,
  normalizeUnit
};
