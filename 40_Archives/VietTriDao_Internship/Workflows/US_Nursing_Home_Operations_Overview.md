---
tags: [project/viettridao, type/concept]
date: 2026-06-25
aliases:
  - Tổng quan vận hành viện dưỡng lão Mỹ
  - US Nursing Home Operations Overview
---

# 🏥 US Nursing Home Operations Overview

## TL;DR

This document provides a comprehensive overview of the core operational workflows for nursing homes in the United States, typically divided into Assisted Living and Skilled Nursing Facilities. It details the operational requirements across the regulatory triad: Clinical Care, Compliance, and Billing & Finance.

---

## Core Operational Workflows

### 1. Intake & Resident Care Management

This workflow determines billing rates and establishes customized care protocols utilizing Electronic Health/Medical Record (EHR/EMR) systems:

- **Intake Assessment:** Evaluation of the resident's ability to perform Activities of Daily Living (ADLs) such as bathing, eating, transferring, and toileting.
- **Person-Centered Care Plan:** Individualized care plans generated from assessment results detailing dietary, physical therapy, and medical supervision requirements.
- **Medication Management:** Highly regulated workflow utilizing Electronic Medication Administration Record (**eMAR**) systems linked directly with pharmacies to ensure accuracy and prevent drug interactions.

### 2. Staff Scheduling & Human Resource Management

Labor costs account for approximately 30% of a nursing home's total operating expenses in the U.S. Key optimization workflows include:

- **Mandated Staffing Ratios:** Federal and state regulations governing the maximum resident-to-nurse/CNA ratio per shift. Understaffing leads to heavy fines or license revocation.
- **Credentialing & In-service Training:** Mandatory annual continuing education hours for administrators and nursing staff (e.g., dementia care, fall prevention). The management software must trigger alerts when credentials near expiration.

### 3. Billing, Financials & Insurance Management

Medical billing is exceptionally complex, involving Private Pay, Medicare, and Medicaid:

| Payer Source                          | Operational & Billing Characteristics                                                                                   |
| :------------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| **Medicare**                          | Covers short-term post-acute clinical care (Skilled Nursing) following a hospital discharge, capped at **100 days**.    |
| **Medicaid**                          | Covers long-term care for low-income seniors. Involves asset spend-down verification according to state-specific rules. |
| **Private Insurance / Out of Pocket** | Billed directly to the family based on the "Level of Care" (LOC) rate tier.                                             |

The billing system utilizes medical coding standards (ICD-10, EDI 835/837 transaction codes) to submit claims to insurance clearinghouses and manage denials.

### 4. Risk Management & Regulatory Compliance

Facilities are subject to unannounced state and federal surveys (inspections) by the Department of Health and Human Services (HHS) and state agencies:

- **Incident Reporting:** Digital logging of falls, injuries, or medication errors. Requires a root cause analysis and submission to state bodies within 24 to 48 hours.
- **HIPAA Compliance:** Secure, HIPAA-compliant storage of medical charts, wound photographs, and financial data. Personal devices are prohibited for recording resident data.
- **Infection Control:** Mandatory Infection Preventionist role to manage commercial laundry, dining room disinfection, and isolation protocols during outbreaks.

### 5. Hospitality & Resident Experience Management

- **Dining Management:** Dynamic menu customization based on physician orders (e.g., dysphagia texture adjustments, low-sodium, diabetic friendly) using tableside tablet ordering.
- **Family Portal:** Secure online portal for family members to track meal logs, recreation logs, vital signs, and pay invoices.

---

## Related Notes

- Project MOC: [[000_VietTriDao_MOC]]
- Tech Stack Decisions: [[Tech_Stack_Decisions]]
- Core Modules Guide: [[US_Nursing_Home_Core_Modules]]
