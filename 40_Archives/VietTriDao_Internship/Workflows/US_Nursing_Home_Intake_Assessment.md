---
tags: [project/viettridao, type/concept]
date: 2026-06-25
aliases:
  - Phân hệ đánh giá nhập viện dưỡng lão Mỹ
  - US Nursing Home Intake Assessment
---

# 📝 US Nursing Home Intake Assessment

## TL;DR

The Intake Assessment operation is the critical legal and financial gateway for U.S. nursing homes. This document outlines the two assessment phases (Pre-admission & Post-admission), the 5 core pillars of the clinical assessment suite, and the downstream outputs generated for workflows, billing, and insurance.

---

## 1. The Two Assessment Phases

To ensure legal and clinical safety, the intake process is divided into two distinct steps:

- **Pre-admission Screening:** Conducted _before_ admission (at the hospital or private residence). The goal is to verify if the facility's equipment and staffing can support the applicant's clinical needs. If an applicant's needs exceed the facility's licensed capability (e.g., severe acute psychiatric needs in Assisted Living), the facility must legally deny admission.
- **Comprehensive Post-admission Assessment:** Conducted within the **first 14 days** of arrival. Skilled Nursing Facilities (SNFs) are federally mandated to use the **Minimum Data Set (MDS)** assessment tool.

---

## 2. The 5 Core Pillars of the Assessment Suite

An interdisciplinary team (Director of Nursing, dietary specialists, and physical therapists) evaluates the resident across 5 categories:

### A. Activities of Daily Living (ADLs & IADLs) Assessment

Directly determines service fees based on scores ranging from "Independent" to "Total Dependence":

- **ADLs (Basic):** Eating, bathing, hygiene, dressing, mobility/transferring, and toileting/continence.
- **IADLs (Instrumental):** Ability to manage phone calls, personal finances, or self-administer medications under supervision.

### B. Cognitive & Neurological Status Assessment

- Orientation screening using standardized tests like **BIMS (Brief Interview for Mental Status)** or **MMSE (Mini-Mental State Examination)** to screen for Dementia or Alzheimer’s.
- Logging of behavioral risks (wandering, agitation, or combative behavior).

### C. Clinical Risk Assessments

- **Fall Risk:** Evaluated using the Morse Fall Scale or Hendrich II Scale. High scores trigger automated safety protocols (low-height beds, alarm mats).
- **Pressure Ulcer Risk:** Evaluated using the **Braden Scale** (skin integrity, moisture, nutrition, mobility).
- **Dysphagia Screening:** Identifies swallowing difficulty to mandate food texture modifications.

### D. Mood & Behavioral Health Status

- Evaluates clinical depression signs using the **PHQ-9 (Patient Health Questionnaire)**.

### E. Financial & Legal Status Verification

- Verifies legal documentations such as **Medical Power of Attorney (POA)** and **Living Wills** specifying **DNR (Do Not Resuscitate)** orders.

---

## 3. Downstream Outputs of the Intake Assessment Module

Data inputs automatically generate three vital operational outputs:

```text
[Intake Assessment Data Input]
           │
           ├───> 1. Auto-populates Care Plan Tasks (Clinical Workflows)
           │
           ├───> 2. Classifies Government Payer Groups (RUGs/PDPM)
           │
           └───> 3. Determines Private Pay Tiers (Level of Care Pricing)
```

1. **Automated Care Plan Generation:** A high-risk score triggers auto-injection of tasks (e.g., a Braden Score of 12 automatically schedules a "Reposition resident every 2 hours" task for floor CNAs).
2. **Service Rate Optimization:** Higher ADL dependency scores dynamically assign the resident to a higher private pay rate tier (e.g., Tier 1: $4,000/mo vs. Tier 4: $7,500/mo).
3. **Federal Reimbursement Alignment:** For SNFs, MDS data categorizes the resident into a clinical group under the **PDPM (Patient-Driven Payment Model)**, determining the fixed daily rate (Per Diem Rate) reimbursed by Medicare.

---

## ⚠️ Strict Regulatory Compliance & Auditing

In the U.S., assessment data carries heavy legal weight:

- Falsifying data to inflate resident acuity to maximize Medicare/Medicaid reimbursement is classified as **Federal Fraud**, carrying severe criminal penalties and multi-million dollar fines.
- Assessments must be re-run periodically (every 90 days) or whenever a resident experiences a **Significant Change in Status**.

---

## Related Notes

- Project MOC: [[000_VietTriDao_MOC]]
- Operations Overview: [[US_Nursing_Home_Operations_Overview]]
- Core Modules Guide: [[US_Nursing_Home_Core_Modules]]
