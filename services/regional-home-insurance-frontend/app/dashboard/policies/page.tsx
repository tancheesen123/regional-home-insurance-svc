import type { Metadata } from "next"
import PoliciesManagement from "@/components/policies/policies-management"

export const metadata: Metadata = {
  title: "Policies | Etiqa Home Insurance",
  description: "Manage your insurance policies",
}

export default function PoliciesPage() {
  return (
    <div className="p-6">
      <PoliciesManagement />
    </div>
  )
}
