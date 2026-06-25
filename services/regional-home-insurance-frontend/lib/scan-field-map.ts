
export interface ScanFieldMapping {
  aiKey:   string
  step:    1 | 4
  section?: "personal" | "property"
  formKey: string
  label:   string
}

export const SCAN_FIELD_MAP: ScanFieldMapping[] = [
  { aiKey: "postcode",                  step: 1, formKey: "postcode",          label: "Postcode"             },
  { aiKey: "idNumber",                  step: 1, formKey: "idNumber",          label: "ID Number"            },
  { aiKey: "dateOfBirth",               step: 1, formKey: "dateOfBirth",       label: "Date of Birth"        },

  { aiKey: "periodFrom",                step: 1, formKey: "coverageStartDate", label: "Coverage Start Date"  },
  { aiKey: "occupiedAs",                step: 1, formKey: "propertyType",      label: "Property Type"        },
  { aiKey: "constructionClassification",step: 1, formKey: "constructionType",  label: "Construction Type"    },
  { aiKey: "riskAddress",               step: 1, formKey: "postcode",          label: "Postcode (from address)" },

  { aiKey: "insuredName",  step: 4, section: "personal",  formKey: "name",             label: "Full Name"     },
  { aiKey: "nik",          step: 4, section: "personal",  formKey: "nricNumber",       label: "NIK / ID"      },
  { aiKey: "dateOfBirth",  step: 4, section: "personal",  formKey: "dateOfBirth",      label: "Date of Birth" },
  { aiKey: "gender",       step: 4, section: "personal",  formKey: "gender",           label: "Gender"        },

  { aiKey: "insuredAddress", step: 4, section: "property", formKey: "propertyAddress1", label: "Address"          },
  { aiKey: "city",           step: 4, section: "property", formKey: "propertyCity",     label: "City"             },
  { aiKey: "state",          step: 4, section: "property", formKey: "propertyState",    label: "State"            },
  { aiKey: "postcode",       step: 4, section: "property", formKey: "propertyPostcode", label: "Postcode"         },
  { aiKey: "kecamatan",      step: 4, section: "property", formKey: "propertyDistrict", label: "Kecamatan"        },
  { aiKey: "kelurahan",      step: 4, section: "property", formKey: "propertyVillage",  label: "Kelurahan / Desa" },
]

export function getMappingsForStep(
  step: 1 | 4,
  section?: "personal" | "property",
): ScanFieldMapping[] {
  return SCAN_FIELD_MAP.filter(
    (m) => m.step === step && (section === undefined || m.section === section),
  )
}
