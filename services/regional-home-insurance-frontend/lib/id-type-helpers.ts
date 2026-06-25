
export function getIdTypeOptions(
  cc: string,
): { value: string; label: string }[] {
  switch (cc.toUpperCase()) {
    case "ID":
      return [
        { value: "ktp",      label: "KTP" },
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
    default:
      return [
        { value: "mykad",    label: "MyKad" },
        { value: "passport", label: "Passport" },
        { value: "mypr",     label: "MyPR" },
      ]
  }
}

export function getDefaultNationality(cc: string): string {
  switch (cc.toUpperCase()) {
    case "ID": return "INDONESIAN"
    case "PH": return "FILIPINO"
    case "KH": return "CAMBODIAN"
    default:   return "MALAYSIAN"
  }
}
