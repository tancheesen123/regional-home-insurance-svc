// Maps AI field keys returned by /scan-document → form field names per step.
// Step 1 = quotation-form.tsx   (FormData interface)
// Step 4 = fill-details-form.tsx (PersonalData / PropertyData interfaces)
//
// Transform notes for Step 1 fields that need parsing:
//   periodFrom              → parse "DD/MM/YYYY" → Date          (coverageStartDate)
//   occupiedAs              → contains "Landed"? → "landed"|"non-landed" (propertyType)
//   constructionClassification → contains "CLASS I"? → "full-brick"|"partial-brick" (constructionType)
//   riskAddress             → split by ",", find /^\d{5}$/ segment (postcode)

export interface ScanFieldMapping {
  aiKey:   string          // key from ScanDocumentResult.fields
  step:    1 | 4
  section?: "personal" | "property"  // Step 4 sections
  formKey: string          // key in the React state object
  label:   string          // human-readable name shown in banner / badge
}

export const SCAN_FIELD_MAP: ScanFieldMapping[] = [
  // ── Step 1 — Quotation form ─────────────────────────────────────────────────
  // Direct string fields
  { aiKey: "postcode",                  step: 1, formKey: "postcode",          label: "Postcode"             },
  { aiKey: "idNumber",                  step: 1, formKey: "idNumber",          label: "ID Number"            },
  { aiKey: "dateOfBirth",               step: 1, formKey: "dateOfBirth",       label: "Date of Birth"        },

  // Parsed / derived fields (transforms applied in quotation-form.tsx useEffect)
  { aiKey: "periodFrom",                step: 1, formKey: "coverageStartDate", label: "Coverage Start Date"  },
  { aiKey: "occupiedAs",                step: 1, formKey: "propertyType",      label: "Property Type"        },
  { aiKey: "constructionClassification",step: 1, formKey: "constructionType",  label: "Construction Type"    },
  { aiKey: "riskAddress",               step: 1, formKey: "postcode",          label: "Postcode (from address)" },

  // ── Step 4 — Personal details ─────────────────────────────────────────────
  // aiKey matches the primary key the API actually returns.
  // fill-details-form.tsx useEffect handles fallback resolution (altKeys).
  { aiKey: "insuredName",  step: 4, section: "personal",  formKey: "name",             label: "Full Name"     },
  { aiKey: "nik",          step: 4, section: "personal",  formKey: "nricNumber",       label: "NIK / ID"      },
  { aiKey: "dateOfBirth",  step: 4, section: "personal",  formKey: "dateOfBirth",      label: "Date of Birth" },
  { aiKey: "gender",       step: 4, section: "personal",  formKey: "gender",           label: "Gender"        },

  // ── Step 4 — Property address ───────────────────────────────────────────────
  { aiKey: "insuredAddress", step: 4, section: "property", formKey: "propertyAddress1", label: "Address"       },
  { aiKey: "city",           step: 4, section: "property", formKey: "propertyCity",     label: "City"          },
  { aiKey: "state",          step: 4, section: "property", formKey: "propertyState",    label: "State"         },
  { aiKey: "postcode",       step: 4, section: "property", formKey: "propertyPostcode", label: "Postcode"      },
]

/** Return mappings for a specific step (and optional section). */
export function getMappingsForStep(
  step: 1 | 4,
  section?: "personal" | "property",
): ScanFieldMapping[] {
  return SCAN_FIELD_MAP.filter(
    (m) => m.step === step && (section === undefined || m.section === section),
  )
}
