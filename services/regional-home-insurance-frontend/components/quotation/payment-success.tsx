"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  CheckCircle,
  Download,
  Eye,
  Home,
  Mail,
  Phone,
  Calendar,
  FileText,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  getProposal,
  getProposalId,
  getPaymentResult,
  clearPaymentResult,
  getPolicyDocumentStatus,
  downloadSingleFile,
  downloadPolicyDocuments,
  DocumentDownloadError,
  type GetProposalData,
  type PaymentResult,
  type PolicyDocumentInfo,
} from "@/lib/api"
import { getSession } from "@/lib/session"
import { getRegionConfig } from "@/lib/region"


const POLL_INTERVAL_MS = 4_000
const POLL_TIMEOUT_MS  = 300_000


function formatPlanType(planType: string): string {
  return planType
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" + ")
}

function formatAddress(addr: GetProposalData["propertyAddress"]): string {
  return [addr.addressLine1, addr.addressLine2, addr.city, addr.postcode, addr.state, addr.country]
    .filter(Boolean)
    .join(", ")
}

function labelForFileType(fileType: string): string {
  const map: Record<string, string> = {
    pds:        "Product Disclosure Statement",
    epolicy:    "ePolicy Certificate",
    taxinvoice: "Tax Invoice",
    other:      "Policy Document",
  }
  return map[fileType.toLowerCase()] ?? fileType
}


function DocumentCard({
  doc,
  proposalId,
  isDownloading,
  onDownload,
}: {
  doc: PolicyDocumentInfo
  proposalId: string
  isDownloading: boolean
  onDownload: (doc: PolicyDocumentInfo) => void
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] hover:shadow-md transition-colors duration-150">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FEF3DC] rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-[#F5A623]" />
        </div>
        <div>
          <p className="font-medium text-sm text-[#1A1A1A]">{labelForFileType(doc.fileType)}</p>
          <p className="text-xs text-[#555555]">{doc.fileName}</p>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={isDownloading}
        onClick={() => onDownload(doc)}
        className="shrink-0 border-[#E0E0E0] text-[#1A1A1A] hover:border-[#F5A623] hover:text-[#F5A623] hover:bg-[#FEF3DC]"
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Download className="h-4 w-4 mr-1" />
            Download PDF
          </>
        )}
      </Button>
    </div>
  )
}


function DocumentSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-[#E0E0E0] bg-[#FAFAFA]">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 bg-[#E0E0E0] rounded-lg animate-pulse shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-[#E0E0E0] rounded animate-pulse w-40" />
          <div className="h-2 bg-[#E0E0E0] rounded animate-pulse w-56" />
        </div>
      </div>
      <div className="h-8 w-28 bg-[#E0E0E0] rounded animate-pulse shrink-0" />
    </div>
  )
}


export default function PaymentSuccess() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const t            = useTranslations("quotation")

  const proposalIdFromUrl  = searchParams.get("proposalId")
  const policyNumFromUrl   = searchParams.get("policy")

  const proposalId = proposalIdFromUrl ?? getProposalId() ?? ""

  const [showConfetti,   setShowConfetti]   = useState(true)
  const [isLoadingData,  setIsLoadingData]  = useState(true)
  const [proposal,       setProposal]       = useState<GetProposalData | null>(null)
  const [paymentResult,  setPaymentResult]  = useState<PaymentResult | null>(null)
  const [dataError,      setDataError]      = useState<string | null>(null)

  const [docStatus,      setDocStatus]      = useState<"polling" | "ready" | "error" | "timeout">("polling")
  const [documents,      setDocuments]      = useState<PolicyDocumentInfo[]>([])
  const [policyNumber,   setPolicyNumber]   = useState(policyNumFromUrl ?? "")
  const [docModalOpen,   setDocModalOpen]   = useState(false)

  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [downloadError,    setDownloadError]    = useState<string | null>(null)

  const cancelPollRef = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const payment = getPaymentResult()
    if (payment) { setPaymentResult(payment); clearPaymentResult() }

    const session = getSession()
    if (!session || !proposalId) { setIsLoadingData(false); return }

    getProposal(proposalId, session.countryCode)
      .then((res) => {
        if (res.succeeded) setProposal(res.data)
        else setDataError(res.message ?? "Failed to load policy details.")
      })
      .catch(() => setDataError("Failed to load policy details."))
      .finally(() => setIsLoadingData(false))
  }, [proposalId])

  useEffect(() => {
    cancelPollRef.current = false
    if (!proposalId) { setDocStatus("error"); return }

    async function poll() {
      const start = Date.now()

      while (!cancelPollRef.current) {
        if (Date.now() - start >= POLL_TIMEOUT_MS) {
          if (!cancelPollRef.current) setDocStatus("timeout")
          return
        }

        try {
          const data = await getPolicyDocumentStatus(proposalId)
          if (cancelPollRef.current) return

          if (data.isReady) {
            setDocuments(data.documents)
            if (data.policyNumber) setPolicyNumber(data.policyNumber)
            setDocStatus("ready")
            setDocModalOpen(true)
            return
          }
        } catch {
          if (!cancelPollRef.current) setDocStatus("error")
          return
        }

        await new Promise<void>((resolve) => {
          const timer = setTimeout(resolve, POLL_INTERVAL_MS)
          if (cancelPollRef.current) { clearTimeout(timer); resolve() }
        })
      }
    }

    poll()
    return () => { cancelPollRef.current = true }
  }, [proposalId])


  const handleDownloadSingle = async (doc: PolicyDocumentInfo) => {
    setDownloadError(null)
    setDownloadingFiles((prev) => new Set(prev).add(doc.fileType))
    try {
      await downloadSingleFile(proposalId, doc.fileType, doc.fileName)
    } catch (err) {
      setDownloadError(err instanceof DocumentDownloadError ? err.message : "Download failed. Please try again.")
    } finally {
      setDownloadingFiles((prev) => {
        const next = new Set(prev)
        next.delete(doc.fileType)
        return next
      })
    }
  }

  const handleDownloadAll = async () => {
    setDownloadError(null)
    setIsDownloadingAll(true)
    try {
      await downloadPolicyDocuments(proposalId, policyNumber || undefined)
    } catch (err) {
      setDownloadError(err instanceof DocumentDownloadError ? err.message : "Download failed. Please try again.")
    } finally {
      setIsDownloadingAll(false)
    }
  }

  const handleRetryPoll = () => {
    cancelPollRef.current = false
    setDocStatus("polling")
    async function retryPoll() {
      const start = Date.now()
      while (!cancelPollRef.current) {
        if (Date.now() - start >= POLL_TIMEOUT_MS) { setDocStatus("timeout"); return }
        try {
          const data = await getPolicyDocumentStatus(proposalId)
          if (cancelPollRef.current) return
          if (data.isReady) {
            setDocuments(data.documents)
            if (data.policyNumber) setPolicyNumber(data.policyNumber)
            setDocStatus("ready")
            setDocModalOpen(true)
            return
          }
        } catch {
          if (!cancelPollRef.current) setDocStatus("error")
          return
        }
        await new Promise<void>((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
      }
    }
    retryPoll()
  }

  const { symbol } = getRegionConfig(getSession()?.countryCode ?? "")
  const fmtCurrency = (n: number) =>
    `${symbol} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const q  = proposal?.quotation
  const pd = proposal?.personalDetails
  const pa = proposal?.propertyAddress
  const displayPolicyNumber = policyNumber || policyNumFromUrl || proposal?.proposalId || "—"

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoadingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-[#555555]">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
          <p className="text-sm">{t("summary.loadingProposal")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">

      {/* ── Confetti ── */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0">
            {[["left-1/4","#F5A623"],["left-1/2","#0066CC","0.5s"],["right-1/4","#00A651","1s"],["left-1/3","#E87722","1.5s"],["right-1/3","#F5A623","2s"]].map(([pos, color, delay], i) => (
              <div
                key={i}
                className={`absolute top-0 ${pos} w-2 h-2 rounded-full animate-bounce`}
                style={{ backgroundColor: color, ...(delay ? { animationDelay: delay } : {}) }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Success Header ── */}
      <div className="text-center mb-8 pt-2">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E6F7EE] rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-[#00A651]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">{t("success.title")}</h1>
        <p className="text-base text-[#555555] mb-4">{t("success.subtitle")}</p>
        {q && (
          <span className="inline-flex items-center rounded-full bg-[#E6F7EE] text-[#00A651] border border-[#86EFAC] px-4 py-1.5 text-sm font-semibold">
            {t("success.policyActiveFrom")} {q.coverageStartDate}
          </span>
        )}
      </div>

      {/* ── Email notice ── */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#BFE3F5] bg-[#E1F5FE] p-4">
        <Mail className="h-4 w-4 mt-0.5 shrink-0 text-[#0288D1]" />
        <p className="text-sm text-[#1A1A1A]">
          <strong className="font-semibold">{t("success.emailNoticeStrong")}</strong> {t("success.emailNoticeDesc")}
        </p>
      </div>

      {/* ── Non-fatal data load error ── */}
      {dataError && (
        <div className="mb-6 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
          <p className="text-sm text-[#D97706]">{dataError}</p>
        </div>
      )}

      {/* ── Document Status Section ── */}
      <Card className="mb-6 rounded-xl border-[#E0E0E0] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1A1A1A]">
            <Package className="h-5 w-5 text-[#F5A623]" />
            Policy Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {docStatus === "polling" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4 text-[#555555]">
                <Loader2 className="h-4 w-4 animate-spin shrink-0 text-[#F5A623]" />
                <p className="text-sm">Preparing your policy documents… This usually takes about 30 seconds.</p>
              </div>
              <DocumentSkeleton />
              <DocumentSkeleton />
              <DocumentSkeleton />
            </div>
          )}

          {docStatus === "ready" && (
            <div className="space-y-3">
              <p className="text-sm text-[#00A651] font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Documents are ready
              </p>
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.fileType}
                  doc={doc}
                  proposalId={proposalId}
                  isDownloading={downloadingFiles.has(doc.fileType)}
                  onDownload={handleDownloadSingle}
                />
              ))}
              {downloadError && (
                <div className="mt-2 rounded-xl border border-[#FECACA] bg-[#FFEBEE] p-3">
                  <p className="text-sm text-[#D32F2F]">{downloadError}</p>
                </div>
              )}
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full border-[#E0E0E0] text-[#1A1A1A] hover:border-[#F5A623] hover:text-[#F5A623] hover:bg-[#FEF3DC]"
                  onClick={handleDownloadAll}
                  disabled={isDownloadingAll}
                >
                  {isDownloadingAll ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Downloading…</>
                  ) : (
                    <><Download className="h-4 w-4 mr-2" /> Download All (ZIP)</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {(docStatus === "error" || docStatus === "timeout") && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <AlertTriangle className="h-8 w-8 text-[#F59E0B]" />
              <p className="text-sm text-[#555555]">
                {docStatus === "timeout"
                  ? "Document generation is taking longer than expected. Please refresh or contact support."
                  : "Could not load documents. Please try again or contact support."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryPoll}
                className="border-[#E0E0E0] text-[#1A1A1A] hover:border-[#F5A623] hover:text-[#F5A623] hover:bg-[#FEF3DC]"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Policy Summary Card ── */}
      <Card className="mb-6 rounded-xl border-[#86EFAC] shadow-sm overflow-hidden">
        <CardHeader className="bg-[#E6F7EE]">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#00A651]">
            <FileText className="h-5 w-5" />
            {t("success.policySummaryTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#555555]">{t("success.policyNumber")}</span>
                <span className="font-medium">{displayPolicyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555555]">{t("success.coverageType")}</span>
                <span className="font-medium">{q ? formatPlanType(q.planType) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555555]">{t("success.policyPeriod")}</span>
                <span className="font-medium">
                  {q ? `${q.coverageStartDate} ${t("success.to")} ${q.expiryDate}` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555555]">{t("success.annualPremium")}</span>
                <span className="font-medium">{q ? fmtCurrency(q.annualPremium) : "—"}</span>
              </div>
            </div>

            <div className="space-y-3">
              {q && q.buildingSum > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#555555]">{t("success.buildingCoverage")}</span>
                  <span className="font-medium">{fmtCurrency(q.buildingSum)}</span>
                </div>
              )}
              {q && q.contentsSum > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#555555]">{t("success.contentsCoverage")}</span>
                  <span className="font-medium">{fmtCurrency(q.contentsSum)}</span>
                </div>
              )}
              {paymentResult && (
                <div className="flex justify-between">
                  <span className="text-[#555555]">{t("success.paymentMethod")}</span>
                  <span className="font-medium">{paymentResult.gatewayName || paymentResult.paymentMethod}</span>
                </div>
              )}
              {paymentResult && (
                <div className="flex justify-between">
                  <span className="text-[#555555]">{t("success.transactionId")}</span>
                  <span className="font-medium text-sm">{paymentResult.referenceNumber}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Policyholder + What's Next ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="rounded-xl border-[#E0E0E0] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1A1A1A]">
              <Home className="h-5 w-5 text-[#F5A623]" />
              {t("success.policyholderInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-[#555555]">{t("success.name")}</p>
              <p className="font-medium">{pd?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#555555]">{t("success.email")}</p>
              <p className="font-medium">{pd?.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#555555]">{t("success.phone")}</p>
              <p className="font-medium">{pd?.mobileNumber ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#555555]">{t("success.propertyAddress")}</p>
              <p className="font-medium text-sm">{pa ? formatAddress(pa) : "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E0E0] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1A1A1A]">
              <Calendar className="h-5 w-5 text-[#F5A623]" />
              {t("success.whatsNext")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { n: 1, title: t("success.saveDocuments"),  desc: t("success.saveDocumentsDesc") },
              { n: 2, title: t("success.markCalendar"),   desc: `${t("success.markCalendarDesc")} ${q?.expiryDate ?? "—"}` },
              { n: 3, title: t("success.stayConnected"),  desc: t("success.stayConnectedDesc") },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#FEF3DC] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-[#D4891A]">{n}</span>
                </div>
                <div>
                  <p className="font-medium text-[#1A1A1A]">{title}</p>
                  <p className="text-sm text-[#555555]">{desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/policies")}
          className="border-[#E0E0E0] text-[#1A1A1A] hover:border-[#F5A623] hover:text-[#F5A623] hover:bg-[#FEF3DC]"
        >
          <Eye className="h-4 w-4 mr-2" /> {t("success.viewAllPolicies")}
        </Button>
      </div>

      {/* ── Support ── */}
      <Card className="rounded-xl border-[#E0E0E0] shadow-sm">
        <CardHeader><CardTitle className="text-base font-semibold text-[#1A1A1A]">{t("success.needHelp")}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-2 text-[#F5A623]" />
              <h4 className="font-semibold mb-1 text-[#1A1A1A]">{t("success.customerService")}</h4>
              <p className="text-sm text-[#555555]">1-300-13-8420</p>
              <p className="text-xs text-[#9E9E9E]">{t("success.available247")}</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-[#F5A623]" />
              <h4 className="font-semibold mb-1 text-[#1A1A1A]">{t("success.emailSupport")}</h4>
              <p className="text-sm text-[#555555]">support@etiqa.com</p>
              <p className="text-xs text-[#9E9E9E]">{t("success.responseTime")}</p>
            </div>
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-[#F5A623]" />
              <h4 className="font-semibold mb-1 text-[#1A1A1A]">{t("success.claimsHotline")}</h4>
              <p className="text-sm text-[#555555]">1-800-22-3372</p>
              <p className="text-xs text-[#9E9E9E]">{t("success.emergencyClaims")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Return to Dashboard ── */}
      <div className="text-center mt-8">
        <Button onClick={() => router.push("/dashboard")} size="lg" className="bg-[#F5A623] hover:bg-[#D4891A] text-white">
          <Home className="h-5 w-5 mr-2" />
          {t("success.returnToDashboard")}
        </Button>
      </div>

      {/* ── Document Ready Modal (auto-opens when isReady:true) ── */}
      <Dialog open={docModalOpen} onOpenChange={setDocModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A]">
              🎉 Your Policy is Ready
              {policyNumber && (
                <span className="text-sm font-normal text-[#555555]">— {policyNumber}</span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.fileType}
                doc={doc}
                proposalId={proposalId}
                isDownloading={downloadingFiles.has(doc.fileType)}
                onDownload={handleDownloadSingle}
              />
            ))}
          </div>

          {downloadError && (
            <div className="mt-3 rounded-xl border border-[#FECACA] bg-[#FFEBEE] p-3">
              <p className="text-sm text-[#D32F2F]">{downloadError}</p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[#E0E0E0]">
            <Button
              className="w-full bg-[#F5A623] hover:bg-[#D4891A] text-white"
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
            >
              {isDownloadingAll ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Downloading…</>
              ) : (
                <><Download className="h-4 w-4 mr-2" /> Download All (ZIP)</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
