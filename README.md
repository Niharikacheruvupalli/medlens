# MedLens 🌿
> *"See the record. Understand the evidence."*

MedLens is an AI-powered clinical information intelligence and patient intake web application. It transforms fragmented medical records—patient history, symptoms, allergies, medications, laboratory reports, prescriptions, and prior files—into a **structured, traceable, understandable, and reviewable** patient health record.

MedLens is **not** a diagnosis system. It never attempts to replace healthcare professionals or prescribe treatments. Its mission is anchored in a core philosophy:

> **"AI organizes the information. Evidence explains the information. Humans remain in control."**

---

## 🌟 Key Product Differentiators

MedLens is an **evidence-first clinical system**, answering three critical questions for every piece of information:
- **WHAT?** → What was extracted?
- **WHERE FROM?** → Where did it come from (document, page, exact verbatim snippet)?
- **HOW SURE?** → What is its extraction confidence and verification status?

### 🔬 1. Signature Feature — The Evidence Lens
The visual and conceptual centerpiece of MedLens. Clicking **"Why? / Evidence"** on any laboratory result opens a calm slide-over panel providing:
- Extracted observed value and unit
- Source document name and page number (e.g. `Blood_Report_2026.pdf (Page 1)`)
- Verbatim extracted snippet with raw table line alignment
- Source-reported reference range
- Rigorous classification explanation based *strictly* on source data
- Extraction confidence percentage ($96\%$)
- Full human verification audit history with inline **[Verify]** and **[Edit]** capabilities.

### ⚖️ 2. Strict Reference Range Intelligence
- Evaluates values strictly against the reference interval provided in **that specific source report**.
- If a source document does not provide a reference range (e.g., Total Cholesterol in the demo panel), status is explicitly marked:
  > **"Reference range unavailable — Information unavailable in source."**
- MedLens **never** invents reference ranges, never substitutes arbitrary external standards, and never converts lab results into speculative diagnoses.
### 🚨 3. Conflict Radar
- Flags cross-source contradictions calmly without making unilateral decisions.
- **Fictional Demo Scenario:**
  - *Source A (Patient Intake):* "No known allergies"
  - *Source B (Prior Clinic Note 2025):* "Penicillin allergy documented (hives/rash)"
  - *Status:* "Needs clarification"
- Provides human-in-the-loop resolution: keep previous clinical notes, confirm current intake, or flag for doctor discussion.

### ❓ 4. Clarification Engine
- Generates 3–5 context-aware questions identifying missing timeframes, frequency patterns, or test preparation states (e.g. fasting duration prior to glucose tests).
- Answers directly enrich the structured record tagged as *"Clarification response (User provided)"*.

### 📈 5. Longitudinal Report Comparison
- Compares Current Report (2026) vs Baseline Report (2024) across extracted parameters (Hemoglobin, WBC, Platelets, Fasting Blood Glucose, Creatinine).
- Displays previous value, current value, numerical deltas, reported ranges, and status shifts.

### 📅 6. Chronological Medical Timeline
- Clean interactive timeline tracing events across 2024 (Baseline CBC), 2025 (Clinic prescription), 2026 (Comprehensive panel), and 2026 (Intake submission).

### 📝 7. "Your Record, Simplified" AI Summary
- Concise, objective synthesis of findings, reference range variances, and items requiring clarification.
- Permanent disclaimer: *"AI-generated summary — verify against source records. MedLens does not provide diagnosis or treatment recommendations."*

---

## 🎨 Soothing Botanical Visual Identity
MedLens avoids frightening hospital interfaces, neon gradients, or robotic AI tropes. It uses a calming, daylight aesthetic:
- **70% Warm White & Pure White:** `#FAFBF7`, `#FFFFFF`
- **20% Pale Sage:** `#E8F0DC`, `#F3F7EC`
- **10% Soft Sage Green Accents:** `#B8CF8A`, `#4E6E3B`
- **Typography & High Contrast:** `#26332A` (Deep Green-Gray)

---

## 💻 Tech Stack & Architecture

- **Backend:** Node.js HTTP/REST API server (zero heavy dependencies, native execution)
- **Clinical Engines:**
  - `engine/extractor.js` (Text extraction preserving verbatim citations)
  - `engine/normalizer.js` (Clinical terminology dictionary e.g. Hb = Hemoglobin = HGB)
  - `engine/reference_range.js` (Strict source-contained range analyzer)
  - `engine/conflict_radar.js` (Cross-document discrepancy detection)
  - `engine/clarification_engine.js` (Context-aware clinical follow-up questions)
  - `engine/summary_generator.js` (Patient-friendly objective synthesis)
- **Frontend:** Semantic, accessible SPA (Warm White & Sage CSS Design System)
- **Data Export:** Standards-compliant JSON structured record download with immutable audit trail.

---

## 🚀 Quickstart & Local Execution

Clone the repository and launch MedLens:

```bash
git clone https://github.com/Niharikacheruvupalli/medlens.git
cd medlens
node server.js
```

Or run `start.cmd` on Windows. The application will be available at:
👉 **`http://localhost:3000`**

Click **[Explore Demo]** to immediately experience the complete interactive Aarav Sharma (42) scenario.
