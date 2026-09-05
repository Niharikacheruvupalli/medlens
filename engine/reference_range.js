/**
 * Reference Range Intelligence Engine
 * 
 * CORE PRODUCT PRINCIPLE:
 * Strictly analyzes numerical values against the range provided in THAT specific source report.
 * If no reference range was given in the document, status MUST be "Reference range unavailable".
 * NEVER invent, assume, or substitute an external arbitrary range.
 * NEVER output diagnostic conclusions (e.g. "patient is anemic").
 */

function parseRange(rawRange) {
  if (!rawRange || typeof rawRange !== 'string') {
    return null;
  }

  const cleaned = rawRange.trim();
  if (!cleaned || cleaned.toLowerCase() === 'n/a' || cleaned.toLowerCase() === 'nil' || cleaned.toLowerCase() === 'none') {
    return null;
  }

  // Case 1: Standard bounds (e.g. "13 - 17", "13.0 - 17.5", "13.0–17.0", "70 to 99")
  const standardMatch = cleaned.match(/([\d.]+)\s*(?:-|–|—|to)\s*([\d.]+)/i);
  if (standardMatch) {
    const low = parseFloat(standardMatch[1]);
    const high = parseFloat(standardMatch[2]);
    if (!isNaN(low) && !isNaN(high)) {
      return { type: 'RANGE', low, high, raw: cleaned };
    }
  }

  // Case 2: Upper bound (e.g. "< 200", "<= 200", "up to 200", "less than 200")
  const upperMatch = cleaned.match(/(?:<|<=|up\s+to|less\s+than)\s*([\d.]+)/i);
  if (upperMatch) {
    const high = parseFloat(upperMatch[1]);
    if (!isNaN(high)) {
      return { type: 'UPPER_BOUND', high, raw: cleaned };
    }
  }

  // Case 3: Lower bound (e.g. "> 60", ">= 60", "greater than 60")
  const lowerMatch = cleaned.match(/(?:>|>=|greater\s+than)\s*([\d.]+)/i);
  if (lowerMatch) {
    const low = parseFloat(lowerMatch[1]);
    if (!isNaN(low)) {
      return { type: 'LOWER_BOUND', low, raw: cleaned };
    }
  }

  return null;
}

function analyzeReferenceRange(rawObservedValue, rawReferenceRange, unit = '') {
  // If observed value cannot be evaluated numerically
  if (rawObservedValue === undefined || rawObservedValue === null || rawObservedValue === '') {
    return {
      status: 'UNKNOWN',
      displayStatus: 'Value unavailable',
      statusClass: 'status-neutral',
      explanation: 'Information unavailable in source.',
      hasRange: false,
      rawRange: rawReferenceRange || 'Not specified in source'
    };
  }

  // Clean value (strip commas if e.g. 8,100 -> 8100)
  const numStr = String(rawObservedValue).replace(/,/g, '').trim();
  const numValue = parseFloat(numStr);

  const parsed = parseRange(rawReferenceRange);

  // If source document did NOT provide a reference range
  if (!parsed) {
    return {
      status: 'UNKNOWN',
      displayStatus: 'Reference range unavailable',
      statusClass: 'status-neutral',
      explanation: 'Information unavailable in source. MedLens strictly reports source-provided ranges and does not substitute standard references.',
      hasRange: false,
      rawRange: rawReferenceRange && rawReferenceRange.trim() ? rawReferenceRange.trim() : 'Unavailable in source report'
    };
  }

  if (isNaN(numValue)) {
    return {
      status: 'UNKNOWN',
      displayStatus: 'Non-numerical result',
      statusClass: 'status-neutral',
      explanation: `Observed value "${rawObservedValue}" cannot be numerically evaluated against reported range ${parsed.raw}.`,
      hasRange: true,
      rawRange: parsed.raw
    };
  }

  const unitStr = unit ? ` ${unit}` : '';

  if (parsed.type === 'RANGE') {
    if (numValue < parsed.low) {
      return {
        status: 'LOW',
        displayStatus: 'Below reported reference range',
        statusClass: 'status-warning-low',
        explanation: `${numValue}${unitStr} is below the reference range of ${parsed.low}–${parsed.high}${unitStr} provided in the source report.`,
        hasRange: true,
        rawRange: parsed.raw,
        low: parsed.low,
        high: parsed.high,
        deltaLow: +(numValue - parsed.low).toFixed(2)
      };
    } else if (numValue > parsed.high) {
      return {
        status: 'HIGH',
        displayStatus: 'Above reported reference range',
        statusClass: 'status-warning-high',
        explanation: `${numValue}${unitStr} is above the reference range of ${parsed.low}–${parsed.high}${unitStr} provided in the source report.`,
        hasRange: true,
        rawRange: parsed.raw,
        low: parsed.low,
        high: parsed.high,
        deltaHigh: +(numValue - parsed.high).toFixed(2)
      };
    } else {
      return {
        status: 'NORMAL',
        displayStatus: 'Within reported range',
        statusClass: 'status-normal',
        explanation: `${numValue}${unitStr} is within the reference range of ${parsed.low}–${parsed.high}${unitStr} provided in the source report.`,
        hasRange: true,
        rawRange: parsed.raw,
        low: parsed.low,
        high: parsed.high
      };
    }
  } else if (parsed.type === 'UPPER_BOUND') {
    if (numValue > parsed.high) {
      return {
        status: 'HIGH',
        displayStatus: 'Above reported reference range',
        statusClass: 'status-warning-high',
        explanation: `${numValue}${unitStr} is above the reported upper limit of < ${parsed.high}${unitStr}.`,
        hasRange: true,
        rawRange: parsed.raw,
        high: parsed.high
      };
    } else {
      return {
        status: 'NORMAL',
        displayStatus: 'Within reported range',
        statusClass: 'status-normal',
        explanation: `${numValue}${unitStr} is within the reported upper limit of < ${parsed.high}${unitStr}.`,
        hasRange: true,
        rawRange: parsed.raw,
        high: parsed.high
      };
    }
  } else if (parsed.type === 'LOWER_BOUND') {
    if (numValue < parsed.low) {
      return {
        status: 'LOW',
        displayStatus: 'Below reported reference range',
        statusClass: 'status-warning-low',
        explanation: `${numValue}${unitStr} is below the reported lower limit of > ${parsed.low}${unitStr}.`,
        hasRange: true,
        rawRange: parsed.raw,
        low: parsed.low
      };
    } else {
      return {
        status: 'NORMAL',
        displayStatus: 'Within reported range',
        statusClass: 'status-normal',
        explanation: `${numValue}${unitStr} is above the reported minimum threshold of > ${parsed.low}${unitStr}.`,
        hasRange: true,
        rawRange: parsed.raw,
        low: parsed.low
      };
    }
  }

  return {
    status: 'UNKNOWN',
    displayStatus: 'Reference range unavailable',
    statusClass: 'status-neutral',
    explanation: 'Information unavailable in source.',
    hasRange: false,
    rawRange: 'Unavailable'
  };
}

module.exports = {
  analyzeReferenceRange,
  parseRange
};
