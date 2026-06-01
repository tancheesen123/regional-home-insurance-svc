// ─── ID type / nationality helpers shared across quotation forms ──────────────

/**
 * Returns the available ID type options for the given country code.
 * Values are lower-case to match the quotation-form submit payload convention.
 * fill-details-form uses upper-case variants defined locally.
 */
export function getIdTypeOptions(
  cc: string,
): { value: string; label: string }[] {
  switch (cc.toUpperCase()) {
    case "ID":
      return [
        { value: "ktp",      label: "KTP (Kartu Tanda Penduduk)" },
        { value: "passport", label: "Passport" },
      ]
    case "PH":
      return [
        { value: "philid",   label: "PhilID" },
        { value: "passport", label: "Passport" },
      ]
    case "KH":
      return [
        { value: "khmerid",  label: "Khmer Identity Card" },
        { value: "passport", label: "Passport" },
      ]
    default: // MY
      return [
        { value: "mykad",    label: "MyKad" },
        { value: "passport", label: "Passport" },
        { value: "mypr",     label: "MyPR" },
      ]
  }
}

/**
 * Default nationality string when the customer selects a non-passport ID type.
 * Matches the NATIONALITIES list used in quotation-form.
 */
export function getDefaultNationality(cc: string): string {
  switch (cc.toUpperCase()) {
    case "ID": return "INDONESIAN"
    case "PH": return "FILIPINO"
    case "KH": return "CAMBODIAN"
    default:   return "MALAYSIAN"
  }
}
