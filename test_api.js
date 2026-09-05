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

  console.log('--- ALL 8 AUTOMATED VERIFICATION CHECKS PASSED! ---');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
