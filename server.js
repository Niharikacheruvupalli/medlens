const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const { AARAV_SHARMA_DEMO } = require('./data/demo_data');
const { SAMPLE_REPORTS } = require('./data/sample_reports');
const { extractFromReportText } = require('./engine/extractor');
const { detectConflicts } = require('./engine/conflict_radar');
const { generateClarificationQuestions } = require('./engine/clarification_engine');
const { generateRecordSummary } = require('./engine/summary_generator');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// In-memory active patient record
let activePatient = JSON.parse(JSON.stringify(AARAV_SHARMA_DEMO));
activePatient.summary = generateRecordSummary(activePatient);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data, null, 2));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body) {
      if (typeof req.body === 'object') return resolve(req.body);
      try {
        return resolve(JSON.parse(req.body));
      } catch (e) {
        return resolve({});
      }
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        // Malformed JSON — resolve with empty object instead of rejecting.
        // This prevents unhandled promise rejections from crashing the serverless function.
        console.warn('[MedLens] Malformed JSON body received, defaulting to empty object:', err.message);
        resolve({});
      }
    });
    req.on('error', (err) => {
      console.warn('[MedLens] Request stream error:', err.message);
      resolve({});
    });
  });
}


async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  if (parsedUrl.query && parsedUrl.query.path) {
    pathname = '/api/' + String(parsedUrl.query.path).replace(/^\//, '');
  } else if (req.headers && req.headers['x-matched-path']) {
    pathname = req.headers['x-matched-path'];
  }
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  try {
    // API Routes
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'healthy',
        app: 'MedLens',
        tagline: 'See the record. Understand the evidence.',
        timestamp: new Date().toISOString()
      });
    }

    if (pathname === '/api/patient' && method === 'GET') {
      activePatient.summary = generateRecordSummary(activePatient);
      return sendJson(res, 200, activePatient);
    }

    if (pathname === '/api/demo/load' && method === 'POST') {
      activePatient = JSON.parse(JSON.stringify(AARAV_SHARMA_DEMO));
      activePatient.summary = generateRecordSummary(activePatient);
      return sendJson(res, 200, {
        success: true,
        message: 'Demo dataset loaded successfully for Aarav Sharma (Age 42).',
        patient: activePatient
      });
    }

    if (pathname === '/api/sample-reports' && method === 'GET') {
      return sendJson(res, 200, SAMPLE_REPORTS);
    }

    if (pathname === '/api/intake' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newPatient = {
        id: 'patient_' + Math.random().toString(36).substring(2, 9),
        name: body.name || 'Patient',
        age: body.age ? parseInt(body.age, 10) : null,
        sex: body.sex || 'Unspecified',
        intakeDate: new Date().toISOString().split('T')[0],
        symptoms: (body.symptoms || []).map(s => typeof s === 'string' ? {
          id: 'symp_' + Math.random().toString(36).substring(2, 7),
          name: s,
          duration: body.symptomDuration || 'Unspecified',
          sourceType: 'USER_PROVIDED',
          sourceDocument: 'Patient Intake Form',
          confidence: 100,
          verificationStatus: 'Human Verified'
        } : s),
        conditions: (body.conditions || []).map(c => typeof c === 'string' ? {
          id: 'cond_' + Math.random().toString(36).substring(2, 7),
          name: c,
          sourceType: 'USER_PROVIDED',
          sourceDocument: 'Patient Intake Form',
          confidence: 100,
          verificationStatus: 'Human Verified'
        } : c),
        allergies: (body.allergies || []).map(a => typeof a === 'string' ? {
          id: 'allergy_' + Math.random().toString(36).substring(2, 7),
          name: a,
          sourceType: 'USER_PROVIDED',
          sourceDocument: 'Patient Intake Form',
          confidence: 100,
          verificationStatus: 'Needs Verification'
        } : a),
        medications: (body.medications || []).map(m => typeof m === 'string' ? {
          id: 'med_' + Math.random().toString(36).substring(2, 7),
          name: m,
          dosage: body.medicationDosage || 'Dose unspecified',
          sourceType: 'USER_PROVIDED',
          sourceDocument: 'Patient Intake Form',
          confidence: 100,
          verificationStatus: 'Human Verified'
        } : m),
        documents: [],
        labResults: [],
        previousLabResults: [],
        timeline: [
          {
            id: 'time_intake_' + Date.now(),
            year: new Date().getFullYear().toString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            title: 'Patient Intake Submission',
            category: 'Patient Provided',
            source: 'MedLens Intake Portal',
            badge: 'User Input',
            keyFindings: [
              `Reported symptoms: ${(body.symptoms || []).join(', ') || 'None stated'}`,
              `Allergies: ${(body.allergies || []).join(', ') || 'No known allergies'}`
            ],
            details: 'Initial digital intake submission.'
          }
        ],
        conflicts: [],
        clarificationQuestions: [],
        auditLog: [
          {
            id: 'audit_' + Date.now(),
            timestamp: new Date().toISOString(),
            action: 'PATIENT_INTAKE_SUBMITTED',
            user: body.name || 'Patient',
            details: 'New intake registered with self-reported symptoms, allergies, and history.'
          }
        ]
      };

      activePatient = newPatient;
      activePatient.clarificationQuestions = generateClarificationQuestions(activePatient);
      activePatient.summary = generateRecordSummary(activePatient);

      return sendJson(res, 200, {
        success: true,
        patient: activePatient
      });
    }

    if (pathname === '/api/analyze' && method === 'POST') {
      const body = await parseJsonBody(req);
      const rawReportText = body.reportText || '';
      const docName = body.documentName || 'Uploaded_Report.pdf';
      const docType = body.documentType || 'Laboratory Report';
      const isPrevious = !!body.isPrevious;

      if (!rawReportText.trim()) {
        return sendJson(res, 400, {
          success: false,
          error: 'Unable to confidently extract this information. Empty report text received.'
        });
      }

      // Run clinical extraction
      const extraction = extractFromReportText(rawReportText, {
        name: docName,
        page: 'Page 1',
        sourceType: docType
      });

      const newDoc = {
        id: 'doc_' + Math.random().toString(36).substring(2, 7),
        name: docName,
        type: docType,
        date: extraction.reportDate || new Date().toISOString().split('T')[0],
        facility: 'Diagnostic Laboratory Facility',
        pageCount: 1,
        processingStatus: 'Processed & Indexed',
        isCurrent: !isPrevious,
        isPrevious: isPrevious,
        rawText: rawReportText
      };

      activePatient.documents.push(newDoc);

      if (isPrevious) {
        activePatient.previousLabResults = extraction.labResults;
      } else {
        // Append or update lab results
        activePatient.labResults = [...activePatient.labResults, ...extraction.labResults];
      }

      // Add timeline event
      activePatient.timeline.push({
        id: 'time_' + Date.now(),
        year: extraction.reportDate ? extraction.reportDate.split('-')[0] : '2026',
        date: extraction.reportDate || 'Recent',
        title: isPrevious ? `Previous Record: ${docName}` : `Clinical Investigation: ${docName}`,
        category: docType,
        source: docName,
        badge: isPrevious ? 'Previous Record' : 'Active Record',
        keyFindings: extraction.labResults.slice(0, 3).map(r => `${r.testName}: ${r.value} ${r.unit} (${r.displayStatus})`),
        details: `Extracted ${extraction.labResults.length} test parameters with provenance tracking.`
      });

      // Run Conflict Radar
      activePatient.conflicts = detectConflicts(activePatient);

      // Run Clarification Engine
      activePatient.clarificationQuestions = generateClarificationQuestions(activePatient);

      // Audit entry
      activePatient.auditLog.push({
        id: 'audit_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'REPORT_ANALYZED',
        user: 'MedLens Clinical Intelligence',
        details: `Processed "${docName}". Extracted ${extraction.labResults.length} lab tests. Identified ${activePatient.conflicts.length} conflict(s).`
      });

      // Generate updated summary
      activePatient.summary = generateRecordSummary(activePatient);

      return sendJson(res, 200, {
        success: true,
        extraction,
        patient: activePatient
      });
    }

    if (pathname === '/api/verify' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { id, targetType, newStatus, editedValue, userNote } = body;

      let foundItem = null;

      if (targetType === 'lab') {
        foundItem = activePatient.labResults.find(r => r.id === id);
        if (foundItem) {
          if (newStatus) foundItem.verificationStatus = newStatus;
          if (editedValue !== undefined && editedValue !== null) {
            foundItem.value = String(editedValue);
            foundItem.verificationStatus = 'Human Edited';
          }
          if (userNote) foundItem.userNotes = userNote;

          foundItem.history.push({
            action: foundItem.verificationStatus === 'Human Edited' ? 'HUMAN_EDITED' : 'HUMAN_VERIFIED',
            timestamp: new Date().toISOString(),
            details: `Updated by reviewer: value="${foundItem.value}", status="${foundItem.verificationStatus}". ${userNote || ''}`
          });
        }
      } else if (targetType === 'allergy') {
        foundItem = activePatient.allergies.find(a => a.id === id);
        if (foundItem) {
          if (newStatus) foundItem.verificationStatus = newStatus;
          if (editedValue) foundItem.name = editedValue;
        }
      }

      if (!foundItem) {
        return sendJson(res, 404, { success: false, error: 'Item not found for verification.' });
      }

      // Record in main audit log
      activePatient.auditLog.push({
        id: 'audit_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'HUMAN_REVIEW_ACTION',
        user: 'Reviewer / Patient',
        details: `Updated ${targetType} item [${id}]: status=${foundItem.verificationStatus || newStatus}.`
      });

      activePatient.summary = generateRecordSummary(activePatient);
      return sendJson(res, 200, { success: true, item: foundItem, patient: activePatient });
    }

    if (pathname === '/api/conflicts/resolve' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { conflictId, resolutionChoice, customResolutionNote } = body;

      const conflict = activePatient.conflicts.find(c => c.id === conflictId);
      if (!conflict) {
        return sendJson(res, 404, { success: false, error: 'Conflict not found.' });
      }

      conflict.resolved = true;
      conflict.resolution = {
        choice: resolutionChoice, // 'choose_intake', 'choose_previous', 'custom', 'acknowledged'
        note: customResolutionNote || 'Reconciled by user during review.',
        resolvedAt: new Date().toISOString(),
        statusClass: 'status-verified'
      };
      conflict.status = 'Resolved by User';

      // Update patient profile if user selected previous allergy record
      if (conflictId === 'conflict_allergy_penicillin') {
        if (resolutionChoice === 'choose_previous') {
          activePatient.allergies = [
            {
              id: 'allergy_penicillin_verified',
              name: 'Penicillin (Allergic reaction: Hives/Rash)',
              sourceType: 'HUMAN_VERIFIED',
              sourceDocument: 'Clinic_Summary_2025.pdf & Confirmed by Patient',
              confidence: 100,
              verificationStatus: 'Human Verified'
            }
          ];
        } else if (resolutionChoice === 'choose_intake') {
          activePatient.allergies = [
            {
              id: 'allergy_none_verified',
              name: 'No known drug allergies (Patient confirmed 2025 note superseded)',
              sourceType: 'HUMAN_VERIFIED',
              sourceDocument: 'Patient Intake Confirmation',
              confidence: 100,
              verificationStatus: 'Human Verified'
            }
          ];
        }
      }

      activePatient.auditLog.push({
        id: 'audit_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'CONFLICT_RESOLVED',
        user: 'Reviewer',
        details: `Conflict "${conflict.title}" resolved with choice "${resolutionChoice}".`
      });

      activePatient.summary = generateRecordSummary(activePatient);
      return sendJson(res, 200, { success: true, conflict, patient: activePatient });
    }

    if (pathname === '/api/clarifications/answer' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { questionId, answerText } = body;

      const question = activePatient.clarificationQuestions.find(q => q.id === questionId);
      if (!question) {
        return sendJson(res, 404, { success: false, error: 'Question not found.' });
      }

      question.status = 'Answered';
      question.answer = answerText;
      question.answeredAt = new Date().toISOString();

      // Append clarified detail to patient record
      if (question.topic === 'headache') {
        const headacheSymptom = activePatient.symptoms.find(s => s.name.toLowerCase().includes('headache'));
        if (headacheSymptom) {
          headacheSymptom.clarification = answerText;
          headacheSymptom.sourceType = 'CLARIFICATION_RESPONSE';
        }
      } else if (question.topic === 'fasting_state') {
        const fbs = activePatient.labResults.find(l => l.testName.toLowerCase().includes('glucose'));
        if (fbs) {
          fbs.fastingConfirmed = answerText;
          fbs.userNotes = (fbs.userNotes ? fbs.userNotes + ' | ' : '') + `Fasting clarification: "${answerText}"`;
        }
      }

      activePatient.auditLog.push({
        id: 'audit_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'CLARIFICATION_ANSWERED',
        user: 'Patient',
        details: `Provided clarification on "${question.topic}": "${answerText}".`
      });

      activePatient.summary = generateRecordSummary(activePatient);
      return sendJson(res, 200, { success: true, question, patient: activePatient });
    }

    if (pathname === '/api/export' && method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="MedLens_Record_${activePatient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json"`,
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(JSON.stringify(activePatient, null, 2));
    }

    // ---------------------------------------------------------------
    // Static File Serving (LOCAL DEVELOPMENT ONLY)
    //
    // On Vercel, static assets (index.html, styles.css, app.js) are
    // served directly by Vercel's CDN from the /public directory.
    // The serverless function (/api/index.js) only handles /api/* routes.
    //
    // If a non-API path reaches this function on Vercel, it means
    // the CDN didn't match — return a clean 404 instead of crashing.
    // ---------------------------------------------------------------

    // Detect Vercel serverless runtime environment
    const isVercel = !!(process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_REGION || process.env.NOW_REGION);

    if (isVercel) {
      // On Vercel, non-API routes should be served by the CDN, not the function.
      // Return a structured 404 instead of crashing with a filesystem error.
      return sendJson(res, 404, {
        success: false,
        error: 'Route not found.',
        hint: 'This serverless function only handles /api/* routes. Static assets are served by the CDN.'
      });
    }

    // Local development: serve static files from /public directory
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

    // Prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Access Denied');
    }

    fs.stat(filePath, (statErr, stats) => {
      if (statErr || !stats || !stats.isFile()) {
        // Fallback to index.html for SPA routing
        filePath = path.join(PUBLIC_DIR, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Internal Server Error: Could not read static file.');
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      });
    });

  } catch (apiErr) {
    console.error('Server error handling request:', apiErr);
    sendJson(res, 500, {
      success: false,
      error: 'An internal server error occurred.',
      details: apiErr.message
    });
  }
}

const server = http.createServer(handleRequest);

// Only listen if executed directly
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  MEDLENS CLINICAL INTELLIGENCE SERVER ACTIVE`);
    console.log(`  Tagline: "See the record. Understand the evidence."`);
    console.log(`  Listening on: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

module.exports = {
  server,
  handleRequest
};
