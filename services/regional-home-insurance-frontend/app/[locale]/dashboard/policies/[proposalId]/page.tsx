import type { Metadata } from "next"
import PolicyDetail from "@/components/policies/policy-detail"

export const metadata: Metadata = {
  title: "Policy Details | Etiqa Home Insurance",
  description: "View your insurance policy details",
}

interface Props {
  params: { proposalId: string }
}

export default function PolicyDetailPage({ params }: Props) {
  return (
    <div className="p-6">
      <PolicyDetail proposalId={params.proposalId} />
    </div>
  )
}
