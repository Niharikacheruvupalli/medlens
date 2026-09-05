const { normalizeTestName, normalizeUnit } = require('./normalizer');
const { analyzeReferenceRange } = require('./reference_range');

/**
 * Robust Clinical Report Information Extractor
 * Extracts laboratory tests, values, reference ranges, and observations from
 * tabular, colon-separated, or unstructured medical reports.
 */
function extractFromReportText(rawText, docMeta = {}) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return {
      success: false,
      error: 'Empty report text provided.',
      labResults: [],
      observations: []
    };
  }

  const documentName = docMeta.name || 'Uploaded_Document.pdf';
  const pageNumber = docMeta.page || 'Page 1';
  const reportDate = docMeta.date || new Date().toISOString().split('T')[0];

  const lines = rawText.split(/\r?\n/);
  const labResults = [];
  const observations = [];
  let extractedPatientName = null;
  let extractedAge = null;
  let extractedReportDate = reportDate;

  // Regex patterns for header fields
  const patientRegex = /(?:patient|name|patient\s+name)\s*[:=-]\s*([A-Za-z\s.]+)/i;
  const ageRegex = /(?:age|years|age\/sex)\s*[:=-]\s*(\d{1,3})/i;
  const dateRegex = /(?:date|collection\s+date|report\s+date)\s*[:=-]\s*([0-9A-Za-z\s,/-]+)/i;

  // Pattern A: Tabular or multi-column line
  // e.g. "Hemoglobin   10.2   g/dL   13.0 - 17.0"
  // e.g. "WBC: 8100 /mcL (4000-11000)"
  // e.g. "Hb .......... 10.2 gm/dl .......... 13 - 17"
  const lineTestPattern = /^\s*([A-Za-z0-9\s()\/,.-]+?)\s*[:=|\t.]{1,10}\s*([<>]?\s*[\d,.]+)\s*([A-Za-z%µ\/^0-9-]+)?(?:\s*(?:ref(?:\.|erence)?\s*(?:range)?[:\s]*)?\(?([<>\d.\s–—to-]+)\)?)?/i;

  // Secondary flexible pattern
  const loosePattern = /([A-Za-z\s()\/.-]{2,35})\s+([<>]?\s*[\d,.]+)\s*([A-Za-z%µ\/^0-9-]+)?(?:\s+([<>\d.\s–—to-]+))?$/;

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const line = rawLine.trim();
    if (!line) continue;

    // Check for document level metadata
    if (!extractedPatientName && patientRegex.test(line)) {
      const match = line.match(patientRegex);
      if (match && match[1]) extractedPatientName = match[1].trim();
    }
    if (!extractedAge && ageRegex.test(line)) {
      const match = line.match(ageRegex);
      if (match && match[1]) extractedAge = parseInt(match[1].trim(), 10);
    }
    if (dateRegex.test(line)) {
      const match = line.match(dateRegex);
      if (match && match[1]) extractedReportDate = match[1].trim();
    }

    // Skip obvious header rows
    if (/^(test\s+name|investigation|parameter|analyte|test\s+description)\s+/i.test(line)) {
      continue;
    }

    // Try matching test patterns
    let testName = null;
    let valStr = null;
    let unitStr = '';
    let refRangeStr = '';

    // Check pattern A
    const matchA = line.match(lineTestPattern);
    if (matchA && matchA[1] && matchA[2]) {
      testName = matchA[1].replace(/^[•\-\*]\s*/, '').trim();
      valStr = matchA[2].trim();
      unitStr = (matchA[3] || '').trim();
      refRangeStr = (matchA[4] || '').trim();
    } else {
      // Try loose pattern
      const matchB = line.match(loosePattern);
      if (matchB && matchB[1] && matchB[2]) {
        testName = matchB[1].replace(/^[•\-\*]\s*/, '').trim();
        valStr = matchB[2].trim();
        unitStr = (matchB[3] || '').trim();
        refRangeStr = (matchB[4] || '').trim();
      }
    }

    // Filter out common false positives
    if (testName && isCommonFalsePositive(testName)) {
      testName = null;
    }

    if (testName && valStr) {
      // Terminology normalization
      const norm = normalizeTestName(testName);
      const cleanUnit = normalizeUnit(unitStr || norm.standardUnit || '');

      // Reference Range Intelligence
      const rangeAnalysis = analyzeReferenceRange(valStr, refRangeStr, cleanUnit);

      // Compute extraction confidence
      let confidenceScore = 96;
      if (norm.isNormalized) confidenceScore += 2;
      if (!refRangeStr) confidenceScore -= 8;
      if (testName.length > 25) confidenceScore -= 4;
      confidenceScore = Math.min(99, Math.max(72, confidenceScore));

      const labItem = {
        id: 'lab_' + Math.random().toString(36).substring(2, 9),
        testName: norm.canonical,
        originalTestName: norm.originalTestName,
        category: norm.category,
        value: valStr,
        unit: cleanUnit,
        referenceRange: rangeAnalysis.rawRange,
        hasReferenceRange: rangeAnalysis.hasRange,
        status: rangeAnalysis.status,
        displayStatus: rangeAnalysis.displayStatus,
        statusClass: rangeAnalysis.statusClass,
        rangeExplanation: rangeAnalysis.explanation,
        source: docMeta.sourceType || 'Laboratory Report',
        sourceDocument: documentName,
        page: pageNumber,
        reportDate: extractedReportDate,
        originalSnippet: line,
        confidence: confidenceScore,
        verificationStatus: 'Needs Verification',
        userNotes: '',
        history: [
          {
            action: 'AI_EXTRACTED',
            timestamp: new Date().toISOString(),
            details: `Extracted from "${documentName}" (${pageNumber}) with ${confidenceScore}% confidence.`
          }
        ]
      };

      labResults.push(labItem);
    } else if (line.length > 20 && !/^(page|doctor|signature|report|date|hospital|clinic)/i.test(line)) {
      // Possible clinical observation or note
      if (/(normocytic|hypochromic|adequate|clear|yellow|negative|positive|observed|impression|comment)/i.test(line)) {
        observations.push({
          id: 'obs_' + Math.random().toString(36).substring(2, 9),
          text: line,
          sourceDocument: documentName,
          page: pageNumber,
          confidence: 88,
          verificationStatus: 'AI Extracted'
        });
      }
    }
  }

  return {
    success: true,
    documentName,
    pageNumber,
    reportDate: extractedReportDate,
    extractedPatientName,
    extractedAge,
    labResults,
    observations
  };
}

function isCommonFalsePositive(str) {
  const lower = str.toLowerCase().trim();
  const blackList = [
    'page', 'date', 'doctor', 'specimen', 'collected', 'received', 'reported',
    'mrn', 'id', 'age', 'sex', 'gender', 'phone', 'hospital', 'pathology',
    'laboratory', 'ref by', 'registered', 'department'
  ];
  return blackList.includes(lower);
}

module.exports = {
  extractFromReportText
};
