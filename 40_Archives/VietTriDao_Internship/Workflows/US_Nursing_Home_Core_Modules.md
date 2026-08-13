---
tags: [project/viettridao, type/concept]
date: 2026-06-25
aliases:
  - Các phân hệ cốt lõi của hệ thống quản lý viện dưỡng lão
  - US Nursing Home Core Modules
---

# 🏢 US Nursing Home Core Modules

## TL;DR

This document defines the architectural breakdown of the core modules required to build a comprehensive nursing home management software (EHR/EMR & ERP system for Long-Term Care). These modules are categorized into 4 primary functional groups and must operate with a centralized data flow.

---

## Architectural Module Breakdown

### I. Clinical & Resident Care Group

This is the core clinical surface where nurses, physicians, and certified nursing assistants (CNAs) interact daily.

#### 1. Intake & Electronic Health Records (EHR) Module

- **Digital Charting:** Stores comprehensive demographics, medical history, allergy lists, emergency contacts, and Power of Attorney (POA) documentations.
- **Intake Assessments:** Digital assessment suite evaluating vitals and Activities of Daily Living (ADLs) to automatically classify the resident's Level of Care (LOC).

#### 2. Care Planning Module

- **Goal Setting:** Enables the Director of Nursing (DON) to establish person-centered care plans (daily, weekly, or monthly).
- **Automated Task Assignment:** Translates clinical care plans into actionable daily task checklists for CNAs on mobile devices or tablets.

#### 3. Electronic Medication Administration Record (eMAR) Module

- **Smart Med-Pass Scheduling:** Real-time list of residents requiring medication within specific time windows with color-coded alerts (Green: Administered, Yellow: Upcoming, Red: Overdue).
- **Advanced Verification:** Barcode scanning of resident wristbands and medication packaging to enforce the "5 Rights" of medication administration.
- **Pharmacy Integration:** Automatic refill transmission to long-term care pharmacies when medication inventory hits a predefined reorder threshold.

### II. Operations & Workforce Group

#### 4. Staff Scheduling Module

- **Mandated Staffing Ratios:** Automatically calculates the required number of nurses and CNAs based on the current resident census and acuity levels for regulatory compliance.
- **Shift Bourse:** Mobile shift picking and swapping with one-tap management approval.

#### 5. Dining & Dietary Module

- **Dietary Filter Integration:** Menu alignment with physician-ordered therapeutic diets (e.g., diabetic-friendly, mechanical soft, pureed, low-sodium).
- **Point of Sale / Tableside Ordering:** Tablet ordering that automatically blocks menu items triggering resident-specific documented allergies.

### III. Billing & Financials Group

#### 6. Billing & Revenue Cycle Management (RCM) Module

- **Multi-Payer Billing:** Automatic invoice splitting between multiple insurance payers (e.g., 80% coverage) and private family pay (20%).
- **Claims Management:** Submission of claims to public (Medicare/Medicaid) or private clearinghouses using HIPAA EDI 837 transaction codes and ingestion of EDI 835 files for denial management.

### IV. Compliance & Engagement Group

#### 7. Incident & Risk Management Module

- **Incident Reporting:** Digitalized logging of falls, injuries, or medication errors. Instantly locks the affected resident's chart at the time of incident to preserve records for surveyors.
- **Wound Management:** Secure capture of pressure ulcer (bedsore) photographs, logging of measurements, and tracking of healing progress over HIPAA-compliant storage.

#### 8. Family Portal Module

- **Operational Transparency:** Dedicated mobile app for family members to view real-time health updates, activity calendars, daily menus, and pay invoices online.

---

## 💡 Centralized Data Flow Pattern

All modules must seamlessly share data. When a resident's clinical acuity changes, the impact must propagate automatically across the system:

```text
[Module 1: EHR Intake Assessment]
        │ (Decline in mobility recorded)
        ▼
[Module 2: Care Plan Module]
        │ (Injects "Transfer Assistance" task for CNAs)
        ▼
[Module 4: Staff Scheduling Module]
        │ (Recalibrates floor staffing for higher acuity)
        ▼
[Module 6: Billing & Financials Module]
          (Dynamically updates monthly invoice to new LOC rate)
```

---

## Related Notes

- Project MOC: [[000_VietTriDao_MOC]]
- Operations Overview: [[US_Nursing_Home_Operations_Overview]]
- Intake Assessment Detail: [[US_Nursing_Home_Intake_Assessment]]
