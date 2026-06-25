import { CheckCircle2, Circle } from "lucide-react"
import { type ScanSession, CONFIDENCE_THRESHOLD } from "@/lib/scan-session"
import { getMappingsForStep } from "@/lib/scan-field-map"

interface Props {
  session: ScanSession
  step:    1 | 4
}

export default function ScanBanner({ session, step }: Props) {
  const mappings = getMappingsForStep(step)

  const filled:    string[] = []
  const notFilled: string[] = []

  mappings.forEach(({ aiKey, label }) => {
    const f = session.fields[aiKey]
    if (f?.filled) {
      filled.push(label)
    } else {
      notFilled.push(label)
    }
  })

  if (filled.length === 0 && notFilled.length === 0) return null

  return (
    <div className="mb-5 rounded-xl border border-[#E0E0E0] bg-white overflow-hidden">
      {}
      {filled.length > 0 && (
        <div className="flex items-start gap-2.5 px-4 py-3 border-b border-[#F5F5F5]">
          <CheckCircle2 className="h-4 w-4 text-[#00A651] shrink-0 mt-0.5" />
          <p className="text-sm text-[#1A1A1A]">
            <span className="font-semibold">{filled.length} field{filled.length > 1 ? "s" : ""}</span>
            {" "}pre-filled from your document
          </p>
        </div>
      )}

      {}
      {notFilled.length > 0 && (
        <div className="flex items-start gap-2.5 px-4 py-3">
          <Circle className="h-4 w-4 text-[#9E9E9E] shrink-0 mt-0.5" />
          <p className="text-sm text-[#555555]">
            <span className="font-medium text-[#1A1A1A]">{notFilled.length} field{notFilled.length > 1 ? "s" : ""}</span>
            {" "}still need manual input:{" "}
            <span className="text-[#9E9E9E]">{notFilled.join(" · ")}</span>
          </p>
        </div>
      )}
    </div>
  )
}
