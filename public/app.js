/**
 * MEDLENS FRONTEND APPLICATION CONTROLLER
 * "See the record. Understand the evidence."
 */

let state = {
  patient: null,
  activeFilter: 'ALL',
  selectedEvidenceItem: null,
  selectedEditItem: null,
  activeConflict: null
};

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  fetchPatientData();
});

async function fetchPatientData() {
  try {
    const res = await fetch('/api/patient');
    if (!res.ok) throw new Error('Failed to fetch patient data');
    const data = await res.json();
    state.patient = data;
    renderAllViews();
  } catch (err) {
    console.error('Error loading patient data:', err);
  }
}

function renderAllViews() {
  if (!state.patient) return;
  renderOverview();
  renderConflictRadar();
  renderAISummary();
  renderClarifications();
  renderLabResults();
  renderTimeline();
  renderComparison();
}

function switchView(viewName) {
  const views = ['landing', 'intake', 'dashboard', 'timeline', 'compare'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.style.display = (v === viewName) ? 'block' : 'none';
  });

  // Update navbar active state
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`nav-${viewName}`);
  if (activeBtn) activeBtn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(sectionId) {
  switchView('dashboard');
  setTimeout(() => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function renderOverview() {
  const p = state.patient;
  if (!p) return;

  const greetingEl = document.getElementById('patient-greeting');
  if (greetingEl) {
    const firstName = p.name ? p.name.split(' ')[0] : 'Patient';
    greetingEl.textContent = `Good morning, ${firstName}.`;
  }

  const nameEl = document.getElementById('profile-name');
  if (nameEl) nameEl.textContent = p.name || 'Anonymous Patient';

  const metaEl = document.getElementById('profile-meta');
  if (metaEl) {
    metaEl.textContent = `Age: ${p.age || 'N/A'} • ${p.sex || 'Unspecified'} • Intake Date: ${p.intakeDate || 'Recent'}`;
  }

  // Symptoms
  const sympList = document.getElementById('profile-symptoms-list');
  if (sympList) {
    sympList.innerHTML = (p.symptoms || []).map(s => {
      const name = typeof s === 'string' ? s : s.name;
      const clarif = s.clarification ? ` (${s.clarification})` : '';
      return `<span class="tag" title="${s.duration || ''}">${name}${clarif}</span>`;
    }).join('') || '<span class="tag" style="color: var(--text-light)">None reported</span>';
  }

  // Conditions
  const condList = document.getElementById('profile-conditions-list');
  if (condList) {
    condList.innerHTML = (p.conditions || []).map(c => {
      const name = typeof c === 'string' ? c : c.name;
      return `<span class="tag">${name}</span>`;
    }).join('') || '<span class="tag" style="color: var(--text-light)">None reported</span>';
  }

  // Medications
  const medsList = document.getElementById('profile-meds-list');
  if (medsList) {
    medsList.innerHTML = (p.medications || []).map(m => {
      const name = typeof m === 'string' ? m : `${m.name} ${m.dosage || ''}`;
      return `<span class="tag">${name}</span>`;
    }).join('') || '<span class="tag" style="color: var(--text-light)">None reported</span>';
  }

  // Allergies
  const allergyList = document.getElementById('profile-allergies-list');
  if (allergyList) {
    allergyList.innerHTML = (p.allergies || []).map(a => {
      const name = typeof a === 'string' ? a : a.name;
      const hasConflict = (p.conflicts || []).some(c => c.category.includes('ALLERGY') && !c.resolved);
      const badgeStyle = hasConflict ? 'background: #FEF3E7; border-color: #F7D4B2; color: #99551B;' : '';
      return `<span class="tag" style="${badgeStyle}">${name}</span>`;
    }).join('') || '<span class="tag" style="color: var(--text-light)">No known allergies</span>';
  }
}
function renderConflictRadar() {
  const container = document.getElementById('conflict-radar-container');
  if (!container) return;

  const conflicts = (state.patient.conflicts || []).filter(c => !c.resolved);
  if (conflicts.length === 0) {
    container.innerHTML = '';
    return;
  }

  const c = conflicts[0]; // Active conflict
  state.activeConflict = c;

  container.innerHTML = `
    <div class="conflict-radar-card" role="region" aria-label="Conflict Radar">
      <div class="conflict-radar-header">
        <div class="conflict-title-box">
          <div class="conflict-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div>
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #99551B; letter-spacing: 0.5px;">
              CONFLICT RADAR • SIGNATURE FEATURE
            </div>
            <h4 style="font-size: 16px; font-weight: 750; color: var(--text-main);">${c.title}</h4>
          </div>
        </div>
        <span class="badge status-conflict">${c.status}</span>
      </div>

      <div class="conflict-sources-grid">
        <div class="source-col">
          <h5>${c.sourceA.label}</h5>
          <div class="source-val">${c.sourceA.value}</div>
          <div class="source-meta">${c.sourceA.document} (${c.sourceA.date})</div>
        </div>
        <div class="source-col">
          <h5>${c.sourceB.label}</h5>
          <div class="source-val">${c.sourceB.value}</div>
          <div class="source-meta">${c.sourceB.document} (${c.sourceB.date})</div>
        </div>
      </div>

      <p class="conflict-explanation">${c.explanation}</p>

      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-secondary btn-sm" onclick="openConflictModal('${c.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          Review Conflict & Clarify
        </button>
      </div>
    </div>
  `;
}

function renderAISummary() {
  const summary = state.patient.summary;
  if (!summary) return;

  const pEl = document.getElementById('summary-paragraph-text');
  if (pEl) pEl.textContent = summary.summaryParagraph;

  const hlList = document.getElementById('summary-highlights-list');
  if (hlList) {
    hlList.innerHTML = (summary.highlights || []).map(h => `
      <div class="highlight-row">
        <div class="highlight-bullet"></div>
        <div><strong>${h.category}:</strong> ${h.text}</div>
      </div>
    `).join('');
  }
}

function renderClarifications() {
  const container = document.getElementById('clarification-questions-list');
  const countBadge = document.getElementById('clarif-pending-count');
  if (!container) return;

  const questions = state.patient.clarificationQuestions || [];
  const pending = questions.filter(q => q.status === 'Unanswered');

  if (countBadge) {
    countBadge.textContent = pending.length > 0 ? `${pending.length} Questions Requiring Input` : 'All Clarified ✓';
    countBadge.className = pending.length > 0 ? 'badge status-conflict' : 'badge status-verified';
  }

  if (questions.length === 0) {
    container.innerHTML = '<p style="font-size: 13px; color: var(--text-muted);">No clarification questions pending.</p>';
    return;
  }

  container.innerHTML = questions.map(q => {
    const isAnswered = q.status === 'Answered';
    return `
      <div class="clarif-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="clarif-meta">${q.category} • Context: ${q.contextField}</div>
            <div class="clarif-question">${q.question}</div>
          </div>
          <span class="badge ${isAnswered ? 'status-verified' : 'status-neutral'}">${isAnswered ? 'Clarified' : 'Unanswered'}</span>
        </div>

        ${isAnswered ? `
          <div style="background: var(--card-bg); border-left: 3px solid var(--primary-sage-deep); padding: 8px 12px; font-size: 13px; color: var(--text-main);">
            <strong>Patient Clarification:</strong> "${q.answer}"
          </div>
        ` : `
          <div class="clarif-form">
            <input type="text" class="clarif-input" id="input-${q.id}" placeholder="Type your answer to clarify this information for your record...">
            <button class="btn btn-primary btn-sm" onclick="submitClarification('${q.id}')">Submit</button>
          </div>
        `}
      </div>
    `;
  }).join('');
}

async function submitClarification(questionId) {
  const input = document.getElementById(`input-${questionId}`);
  if (!input || !input.value.trim()) return;

  try {
    const res = await fetch('/api/clarifications/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId,
        answerText: input.value.trim()
      })
    });
    if (!res.ok) throw new Error('Failed to save answer');
    const data = await res.json();
    state.patient = data.patient;
    renderAllViews();
  } catch (e) {
    console.error('Error submitting clarification:', e);
  }
}
function filterLabResults(filterType, btn) {
  state.activeFilter = filterType;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderLabResults();
}

function renderLabResults() {
  const tbody = document.getElementById('lab-results-tbody');
  if (!tbody) return;

  const results = state.patient.labResults || [];
  let filtered = results;

  if (state.activeFilter === 'OUTSIDE') {
    filtered = results.filter(r => r.status === 'LOW' || r.status === 'HIGH');
  } else if (state.activeFilter === 'NORMAL') {
    filtered = results.filter(r => r.status === 'NORMAL');
  } else if (state.activeFilter === 'UNKNOWN') {
    filtered = results.filter(r => r.status === 'UNKNOWN');
  } else if (state.activeFilter === 'UNVERIFIED') {
    filtered = results.filter(r => r.verificationStatus === 'Needs Verification');
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-light); padding: 30px;">No laboratory tests match the selected filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    let statusBadgeClass = 'status-normal';
    if (item.status === 'LOW' || item.status === 'HIGH') statusBadgeClass = 'status-warning-low';
    if (item.status === 'UNKNOWN') statusBadgeClass = 'status-neutral';

    let verifyBadgeClass = 'status-neutral';
    if (item.verificationStatus === 'Human Verified') verifyBadgeClass = 'status-verified';
    if (item.verificationStatus === 'Human Edited') verifyBadgeClass = 'badge-sage';

    return `
      <tr>
        <td>
          <div class="test-canonical">${item.testName}</div>
          <span class="test-original">orig: "${item.originalTestName}"</span>
        </td>
        <td>
          <span class="value-bold">${item.value}</span> <span style="font-size: 11px; color: var(--text-light);">${item.unit}</span>
        </td>
        <td>
          <span style="font-size: 12px; color: var(--text-muted);">${item.referenceRange || 'Unavailable'}</span>
        </td>
        <td>
          <span class="badge ${statusBadgeClass}">${item.displayStatus}</span>
        </td>
        <td>
          <div style="font-size: 12px; font-weight: 500;">${item.sourceDocument}</div>
          <span style="font-size: 11px; color: var(--text-light);">${item.page || 'Page 1'}</span>
        </td>
        <td>
          <span class="badge badge-sage">${item.confidence}%</span>
        </td>
        <td>
          <span class="badge ${verifyBadgeClass}">${item.verificationStatus}</span>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn btn-secondary btn-sm" onclick="openEvidenceLens('${item.id}')" title="Inspect source evidence & classification rationale">
            Why? / Evidence
          </button>
          <button class="btn btn-ghost btn-sm" onclick="openEditModal('${item.id}')" title="Edit value or verify">
            Edit
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// SIGNATURE FEATURE: EVIDENCE LENS DRAWER
function openEvidenceLens(itemId) {
  const item = (state.patient.labResults || []).find(r => r.id === itemId);
  if (!item) return;

  state.selectedEvidenceItem = item;
  const drawer = document.getElementById('evidence-drawer-backdrop');
  const body = document.getElementById('lens-drawer-body');
  const actions = document.getElementById('lens-drawer-actions');
  const badge = document.getElementById('lens-source-type-badge');

  if (badge) badge.textContent = item.source || 'Laboratory Report';

  let statusBadgeClass = 'status-normal';
  if (item.status === 'LOW' || item.status === 'HIGH') statusBadgeClass = 'status-warning-low';
  if (item.status === 'UNKNOWN') statusBadgeClass = 'status-neutral';

  let verifyBadgeClass = 'status-neutral';
  if (item.verificationStatus === 'Human Verified') verifyBadgeClass = 'status-verified';
  if (item.verificationStatus === 'Human Edited') verifyBadgeClass = 'badge-sage';

  body.innerHTML = `
    <!-- Hero Stat -->
    <div class="lens-hero-stat">
      <div class="lens-param-name">${item.category} • ${item.testName}</div>
      <div class="lens-obs-value">${item.value} <span class="lens-unit">${item.unit}</span></div>
      <div style="margin-top: 8px;">
        <span class="badge ${statusBadgeClass}">${item.displayStatus}</span>
      </div>
    </div>

    <!-- Source Origin & Provenance -->
    <div class="evidence-field-box">
      <div class="evidence-field-label">Document Provenance</div>
      <div style="font-size: 14px; font-weight: 650; color: var(--text-main); margin-bottom: 2px;">
        📄 ${item.sourceDocument}
      </div>
      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">
        Location: ${item.page || 'Page 1'} • Date: ${item.reportDate || '2026'}
      </div>
      <div class="evidence-field-label">Original Extracted Line (Verbatim)</div>
      <div class="source-snippet-box">
        "${item.originalSnippet || item.originalTestName + ' ' + item.value + ' ' + item.unit}"
      </div>
    </div>

    <!-- Reported Reference Range -->
    <div class="evidence-field-box">
      <div class="evidence-field-label">Source-Reported Reference Range</div>
      <div style="font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">
        ${item.referenceRange}
      </div>
      <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5;">
        ${item.rangeExplanation}
      </p>
    </div>

    <!-- AI Model Confidence & Reasoning -->
    <div class="evidence-field-box">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <div class="evidence-field-label" style="margin-bottom: 0;">Extraction Confidence</div>
        <span class="badge badge-sage">${item.confidence}% Match</span>
      </div>
      <p style="font-size: 12px; color: var(--text-muted);">
        Matched against canonical dictionary alias "${item.originalTestName}". Verbatim text alignment verified.
      </p>
    </div>

    <!-- Verification Audit State -->
    <div class="evidence-field-box">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <div class="evidence-field-label" style="margin-bottom: 0;">Human Verification Status</div>
        <span class="badge ${verifyBadgeClass}">${item.verificationStatus}</span>
      </div>
      <div style="font-size: 12px; color: var(--text-muted);">
        ${item.userNotes ? `Reviewer Note: "${item.userNotes}"` : 'Awaiting confirmation from patient or healthcare professional.'}
      </div>
    </div>
  `;

  actions.innerHTML = `
    <button class="btn btn-secondary" style="flex: 1;" onclick="openEditModal('${item.id}')">
      Edit Field
    </button>
    <button class="btn btn-primary" style="flex: 1;" onclick="quickVerify('${item.id}')">
      ${item.verificationStatus === 'Human Verified' ? 'Verified ✓' : 'Verify Field'}
    </button>
  `;

  if (drawer) drawer.classList.add('open');
}

function openSignatureEvidenceDemo() {
  // Opens hemoglobin by default for quick demo inspection
  const hb = (state.patient.labResults || []).find(r => r.testName.toLowerCase().includes('hemoglobin')) || state.patient.labResults[0];
  if (hb) openEvidenceLens(hb.id);
}

function closeEvidenceLens() {
  const drawer = document.getElementById('evidence-drawer-backdrop');
  if (drawer) drawer.classList.remove('open');
}

function handleDrawerBackdropClick(e) {
  if (e.target.id === 'evidence-drawer-backdrop') {
    closeEvidenceLens();
  }
}
async function quickVerify(itemId) {
  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: itemId,
        targetType: 'lab',
        newStatus: 'Human Verified'
      })
    });
    if (!res.ok) throw new Error('Failed to verify');
    const data = await res.json();
    state.patient = data.patient;
    renderAllViews();
    openEvidenceLens(itemId);
  } catch (e) {
    console.error('Error verifying item:', e);
  }
}

function openEditModal(itemId) {
  const item = (state.patient.labResults || []).find(r => r.id === itemId);
  if (!item) return;

  state.selectedEditItem = item;
  document.getElementById('edit-field-label').textContent = `${item.testName} (${item.unit})`;
  document.getElementById('edit-field-val').value = item.value;
  document.getElementById('edit-field-status').value = item.verificationStatus;
  document.getElementById('edit-field-notes').value = item.userNotes || '';

  const modal = document.getElementById('edit-modal-backdrop');
  if (modal) modal.classList.add('open');
}

function closeEditModal() {
  const modal = document.getElementById('edit-modal-backdrop');
  if (modal) modal.classList.remove('open');
}

async function saveFieldEdit() {
  if (!state.selectedEditItem) return;
  const val = document.getElementById('edit-field-val').value;
  const status = document.getElementById('edit-field-status').value;
  const notes = document.getElementById('edit-field-notes').value;

  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: state.selectedEditItem.id,
        targetType: 'lab',
        editedValue: val,
        newStatus: status,
        userNote: notes
      })
    });
    if (!res.ok) throw new Error('Failed to update field');
    const data = await res.json();
    state.patient = data.patient;
    closeEditModal();
    renderAllViews();
    if (state.selectedEvidenceItem && state.selectedEvidenceItem.id === state.selectedEditItem.id) {
      openEvidenceLens(state.selectedEditItem.id);
    }
  } catch (e) {
    console.error('Error saving edit:', e);
  }
}

function openConflictModal(conflictId) {
  const c = (state.patient.conflicts || []).find(x => x.id === conflictId);
  if (!c) return;

  document.getElementById('conflict-modal-srcA-val').textContent = c.sourceA.value;
  document.getElementById('conflict-modal-srcA-meta').textContent = `${c.sourceA.document} (${c.sourceA.date})`;
  document.getElementById('conflict-modal-srcB-val').textContent = c.sourceB.value;
  document.getElementById('conflict-modal-srcB-meta').textContent = `${c.sourceB.document} (${c.sourceB.date})`;

  const modal = document.getElementById('conflict-modal-backdrop');
  if (modal) modal.classList.add('open');
}

function closeConflictModal() {
  const modal = document.getElementById('conflict-modal-backdrop');
  if (modal) modal.classList.remove('open');
}

async function submitConflictResolution() {
  if (!state.activeConflict) return;
  const choice = document.querySelector('input[name="conflict-choice"]:checked').value;
  const note = document.getElementById('conflict-note').value;

  try {
    const res = await fetch('/api/conflicts/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conflictId: state.activeConflict.id,
        resolutionChoice: choice,
        customResolutionNote: note
      })
    });
    if (!res.ok) throw new Error('Failed to resolve conflict');
    const data = await res.json();
    state.patient = data.patient;
    closeConflictModal();
    renderAllViews();
  } catch (e) {
    console.error('Error resolving conflict:', e);
  }
}

function renderTimeline() {
  const container = document.getElementById('timeline-tree-container');
  if (!container) return;

  const events = state.patient.timeline || [];
  container.innerHTML = events.map(ev => `
    <div class="timeline-node">
      <div class="timeline-marker"></div>
      <div class="timeline-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <div>
            <div class="timeline-date">${ev.year} • ${ev.date}</div>
            <h4 style="font-size: 15px; font-weight: 700; color: var(--text-main);">${ev.title}</h4>
          </div>
          <span class="badge badge-sage">${ev.badge || ev.category}</span>
        </div>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Source: ${ev.source}</p>
        <ul style="padding-left: 18px; font-size: 13px; color: var(--text-main); margin-bottom: 8px;">
          ${(ev.keyFindings || []).map(f => `<li>${f}</li>`).join('')}
        </ul>
        <div style="font-size: 11px; color: var(--text-light);">${ev.details || ''}</div>
      </div>
    </div>
  `).join('');
}

function renderComparison() {
  const tbody = document.getElementById('comparison-tbody');
  if (!tbody) return;

  const curResults = state.patient.labResults || [];
  const prevResults = state.patient.previousLabResults || [];

  if (prevResults.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No previous report uploaded for longitudinal comparison.</td></tr>`;
    return;
  }

  const rows = [];
  prevResults.forEach(prev => {
    const cur = curResults.find(c => c.testName.toLowerCase() === prev.testName.toLowerCase());
    if (cur) {
      const prevNum = parseFloat(String(prev.value).replace(/,/g, ''));
      const curNum = parseFloat(String(cur.value).replace(/,/g, ''));
      let deltaStr = 'N/A';
      let deltaBadgeClass = 'delta-neutral';

      if (!isNaN(prevNum) && !isNaN(curNum)) {
        const diff = +(curNum - prevNum).toFixed(2);
        deltaStr = diff > 0 ? `+${diff}` : `${diff}`;
        if (diff < 0) deltaBadgeClass = 'delta-neg';
        else if (diff > 0) deltaBadgeClass = 'delta-pos';
      }

      rows.push(`
        <tr>
          <td><strong style="color: var(--text-main);">${cur.testName}</strong></td>
          <td>${prev.value} ${prev.unit}</td>
          <td><strong style="color: var(--text-main);">${cur.value} ${cur.unit}</strong></td>
          <td><span class="delta-badge ${deltaBadgeClass}">${deltaStr} ${cur.unit}</span></td>
          <td><span style="font-size: 12px; color: var(--text-muted);">${prev.referenceRange}</span></td>
          <td><span style="font-size: 12px; color: var(--text-muted);">${cur.referenceRange}</span></td>
          <td>
            <span class="badge ${cur.status === 'LOW' ? 'status-warning-low' : (cur.status === 'HIGH' ? 'status-warning-high' : 'status-normal')}">
              ${prev.status} → ${cur.status}
            </span>
          </td>
          <td style="text-align: right;">
            <button class="btn btn-secondary btn-sm" onclick="openEvidenceLens('${cur.id}')">View Evidence</button>
          </td>
        </tr>
      `);
    }
  });

  tbody.innerHTML = rows.join('');
}

async function loadFictionalDemo() {
  runProcessingAnimation(async () => {
    try {
      const res = await fetch('/api/demo/load', { method: 'POST' });
      const data = await res.json();
      state.patient = data.patient;
      renderAllViews();
      switchView('dashboard');
    } catch (e) {
      console.error('Error loading demo:', e);
    }
  });
}

async function populateSampleReport(reportKey) {
  try {
    const res = await fetch('/api/sample-reports');
    const reports = await res.json();
    const rep = reports[reportKey];
    if (rep) {
      document.getElementById('report-doc-name').value = rep.filename;
      document.getElementById('report-raw-text').value = rep.text;
    }
  } catch (e) {
    console.error('Error fetching sample reports:', e);
  }
}

async function handleIntakeSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('intake-name').value;
  const age = document.getElementById('intake-age').value;
  const sex = document.getElementById('intake-sex').value;
  const symptoms = document.getElementById('intake-symptoms').value.split(',').map(s => s.trim()).filter(Boolean);
  const conditions = document.getElementById('intake-conditions').value.split(',').map(c => c.trim()).filter(Boolean);
  const allergies = document.getElementById('intake-allergies').value.split(',').map(a => a.trim()).filter(Boolean);
  const medications = document.getElementById('intake-medications').value.split(',').map(m => m.trim()).filter(Boolean);

  const docName = document.getElementById('report-doc-name').value;
  const reportText = document.getElementById('report-raw-text').value;
  const isPrevious = document.getElementById('is-previous-doc').checked;

  runProcessingAnimation(async () => {
    try {
      // 1. Submit Intake
      const intakeRes = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, sex, symptoms, conditions, allergies, medications })
      });
      const intakeData = await intakeRes.json();
      state.patient = intakeData.patient;

      // 2. Analyze Report
      if (reportText.trim()) {
        const analyzeRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentName: docName,
            reportText,
            isPrevious
          })
        });
        const analyzeData = await analyzeRes.json();
        state.patient = analyzeData.patient;
      }

      renderAllViews();
      switchView('dashboard');
    } catch (e) {
      console.error('Error submitting intake:', e);
    }
  });
}

function runProcessingAnimation(onComplete) {
  const modal = document.getElementById('processing-modal');
  const bar = document.getElementById('processing-progress-bar');
  if (!modal) return onComplete();

  modal.classList.add('open');
  const steps = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Reset steps
  steps.forEach(s => {
    const el = document.getElementById(`pstep-${s}`);
    if (el) { el.className = 'processing-step'; }
  });

  let currentStep = 0;
  function nextStep() {
    if (currentStep < steps.length) {
      const stepNum = steps[currentStep];
      const el = document.getElementById(`pstep-${stepNum}`);
      if (el) el.className = 'processing-step active';

      if (currentStep > 0) {
        const prevEl = document.getElementById(`pstep-${steps[currentStep - 1]}`);
        if (prevEl) prevEl.className = 'processing-step done';
      }

      if (bar) bar.style.width = `${Math.round(((currentStep + 1) / steps.length) * 100)}%`;
      currentStep++;
      setTimeout(nextStep, 140);
    } else {
      const lastEl = document.getElementById(`pstep-9`);
      if (lastEl) lastEl.className = 'processing-step done';
      setTimeout(() => {
        modal.classList.remove('open');
        if (onComplete) onComplete();
      }, 250);
    }
  }

  nextStep();
}

function exportPatientRecord() {
  window.open('/api/export', '_blank');
}
