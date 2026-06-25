import { CheckCircle2, AlertTriangle, PenLine } from "lucide-react"
import { type ScanSessionField, isAutoFilled, isLowConfidence } from "@/lib/scan-session"

interface Props {
  field: ScanSessionField | undefined
}

export default function ScanFieldBadge({ field }: Props) {
  if (!field) return null

  if (field.source === "manual") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#0066CC] bg-[#E8F1FB] px-1.5 py-0.5 rounded ml-1.5">
        <PenLine className="h-2.5 w-2.5" />
        Edited
      </span>
    )
  }

  if (isAutoFilled(field)) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#00A651] bg-[#E6F7EE] px-1.5 py-0.5 rounded ml-1.5">
        <CheckCircle2 className="h-2.5 w-2.5" />
        Auto-filled
      </span>
    )
  }

  if (isLowConfidence(field)) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#D4891A] bg-[#FDF0E6] px-1.5 py-0.5 rounded ml-1.5">
        <AlertTriangle className="h-2.5 w-2.5" />
        Please verify
      </span>
    )
  }

  return null
}
