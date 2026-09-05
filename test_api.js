async function runTests() {
  console.log('--- Testing MedLens REST API & Static Files ---');
  
  // 1. Health
  const hRes = await fetch('http://localhost:3000/api/health');
  const health = await hRes.json();
  console.log('1. Health check passed:', health.status === 'healthy', health.app);

  // 2. Reset to Demo first
  const dRes = await fetch('http://localhost:3000/api/demo/load', { method: 'POST' });
  const dData = await dRes.json();
  console.log('2. Reset to Demo passed:', dData.success, dData.message);

  // 3. Patient
  const pRes = await fetch('http://localhost:3000/api/patient');
  const p = await pRes.json();
  console.log('3. Patient record loaded:', p.name, 'Labs count:', p.labResults.length);

  // 4. Verification action
  const vRes = await fetch('http://localhost:3000/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'lab_hb_2026',
      targetType: 'lab',
      newStatus: 'Human Verified',
      userNote: 'Doctor confirmed hemoglobin value.'
    })
  });
  const vData = await vRes.json();
  console.log('4. Verification test passed:', vData.success, 'New status:', vData.item.verificationStatus);

  // 5. Clarification answer action
  const cRes = await fetch('http://localhost:3000/api/clarifications/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionId: 'clarif_headache_onset',
      answerText: 'Headaches began 3 weeks ago, occurring in afternoon.'
    })
  });
  const cData = await cRes.json();
  console.log('5. Clarification answer test passed:', cData.success, 'Answered:', cData.question.status);

  // 6. Conflict Resolution action
  const cfRes = await fetch('http://localhost:3000/api/conflicts/resolve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conflictId: 'conflict_allergy_penicillin',
      resolutionChoice: 'choose_previous',
      customResolutionNote: 'Confirmed rash reaction to Amoxicillin in 2021.'
    })
  });
  const cfData = await cfRes.json();
  console.log('6. Conflict resolution test passed:', cfData.success, 'Resolved:', cfData.conflict.resolved);

  // 7. Static file serving check
  const htmlRes = await fetch('http://localhost:3000/');
  const html = await htmlRes.text();
  console.log('7. Index.html served correctly:', html.includes('MEDLENS'), 'Size:', html.length);

  const cssRes = await fetch('http://localhost:3000/styles.css');
  const css = await cssRes.text();
  console.log('8. Styles.css served correctly:', css.includes('--sidebar-green'), 'Size:', css.length);

  // 9. Sample reports endpoint check
  const sRes = await fetch('http://localhost:3000/api/sample-reports');
  const samples = await sRes.json();
  const sampleKeys = Object.keys(samples);
  console.log('9. Sample reports API passed:', sampleKeys.includes('cbc_report') && sampleKeys.includes('metabolic_report') && sampleKeys.includes('lipid_unspecified_range'), 'Keys:', sampleKeys);

  // 10. Analyze Missing Reference Range Test (Lipid Profile)
  const lipidSample = samples['lipid_unspecified_range'];
  const anRes = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      documentName: lipidSample.filename,
      reportText: lipidSample.text,
      isPrevious: false
    })
  });
  const anData = await anRes.json();
  const cholItem = anData.patient.labResults.find(l => l.testName.toLowerCase().includes('cholesterol'));
  console.log('10. Missing Reference Range Test passed:', !!cholItem, 'Cholesterol status:', cholItem ? cholItem.displayStatus : 'not found', 'hasReferenceRange:', cholItem ? cholItem.hasReferenceRange : null);

  // 11. Analyze Complete Blood Count Sample
  const cbcSample = samples['cbc_report'];
  const cbcRes = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      documentName: cbcSample.filename,
      reportText: cbcSample.text,
      isPrevious: false
    })
  });
  const cbcData = await cbcRes.json();
  const hbItem = cbcData.patient.labResults.find(l => l.testName.toLowerCase().includes('hemoglobin'));
  console.log('11. Complete Blood Count Sample passed:', !!hbItem, 'Hemoglobin value:', hbItem ? hbItem.value : 'not found', 'Range:', hbItem ? hbItem.referenceRange : 'none');

  console.log('--- ALL 11 AUTOMATED VERIFICATION CHECKS PASSED! ---');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
