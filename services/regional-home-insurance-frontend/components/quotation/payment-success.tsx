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
  Share2,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

// ── Constants ─────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 4_000    // 4 s between each status check
const POLL_TIMEOUT_MS  = 300_000  // 5 min total before giving up

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  // Keys are lowercase so the lookup is case-insensitive
  const map: Record<string, string> = {
    pds:        "Product Disclosure Statement",
    epolicy:    "ePolicy Certificate",
    taxinvoice: "Tax Invoice",
    other:      "Policy Document",
  }
  return map[fileType.toLowerCase()] ?? fileType
}

// ── Document Card ─────────────────────────────────────────────────────────────

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
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-sm text-gray-900">{labelForFileType(doc.fileType)}</p>
          <p className="text-xs text-gray-500">{doc.fileName}</p>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={isDownloading}
        onClick={() => onDownload(doc)}
        className="shrink-0"
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

// ── Document Skeleton (while polling) ─────────────────────────────────────────

function DocumentSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-40" />
          <div className="h-2 bg-gray-200 rounded animate-pulse w-56" />
        </div>
      </div>
      <div className="h-8 w-28 bg-gray-200 rounded animate-pulse shrink-0" />
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function PaymentSuccess() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const t            = useTranslations("quotation")

  // ── URL params (from Stripe redirect) ──────────────────────────────────────
  const proposalIdFromUrl  = searchParams.get("proposalId")
  const policyNumFromUrl   = searchParams.get("policy")

  // Resolve proposalId: URL first, then localStorage fallback
  const proposalId = proposalIdFromUrl ?? getProposalId() ?? ""

  // ── State ──────────────────────────────────────────────────────────────────
  const [showConfetti,   setShowConfetti]   = useState(true)
  const [isLoadingData,  setIsLoadingData]  = useState(true)
  const [proposal,       setProposal]       = useState<GetProposalData | null>(null)
  const [paymentResult,  setPaymentResult]  = useState<PaymentResult | null>(null)
  const [dataError,      setDataError]      = useState<string | null>(null)

  // Document polling
  const [docStatus,      setDocStatus]      = useState<"polling" | "ready" | "error" | "timeout">("polling")
  const [documents,      setDocuments]      = useState<PolicyDocumentInfo[]>([])
  const [policyNumber,   setPolicyNumber]   = useState(policyNumFromUrl ?? "")
  const [docModalOpen,   setDocModalOpen]   = useState(false)

  // Per-file download loading (tracks which fileType is in-flight)
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [downloadError,    setDownloadError]    = useState<string | null>(null)

  // Ref so the poll loop knows when the component has unmounted
  const cancelPollRef = useRef(false)

  // ── Confetti ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(t)
  }, [])

  // ── Load proposal data ─────────────────────────────────────────────────────
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

  // ── Document polling loop ──────────────────────────────────────────────────
  useEffect(() => {
    cancelPollRef.current = false
    if (!proposalId) { setDocStatus("error"); return }

    async function poll() {
      const start = Date.now()

      while (!cancelPollRef.current) {
        // Timeout guard
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
            setDocModalOpen(true)  // auto-open modal
            return
          }
        } catch {
          if (!cancelPollRef.current) setDocStatus("error")
          return
        }

        // Wait before next attempt
        await new Promise<void>((resolve) => {
          const timer = setTimeout(resolve, POLL_INTERVAL_MS)
          // If cancelled mid-wait, resolve immediately via the cancel check on next loop
          if (cancelPollRef.current) { clearTimeout(timer); resolve() }
        })
      }
    }

    poll()
    return () => { cancelPollRef.current = true }
  }, [proposalId])

  // ── Download handlers ──────────────────────────────────────────────────────

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
    // Retriggering the effect by remounting isn't straightforward; easiest is
    // to just re-call poll inline here
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

  // ── Derived values ─────────────────────────────────────────────────────────
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
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#0056b3]" />
          <p className="text-sm">{t("summary.loadingProposal")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Confetti ── */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0">
            {[["left-1/4","yellow"],["left-1/2","blue","0.5s"],["right-1/4","green","1s"],["left-1/3","red","1.5s"],["right-1/3","purple","2s"]].map(([pos, color, delay], i) => (
              <div
                key={i}
                className={`absolute top-0 ${pos} w-2 h-2 bg-${color}-500 rounded-full animate-bounce`}
                style={delay ? { animationDelay: delay as string } : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Success Header ── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("success.title")}</h1>
        <p className="text-lg text-gray-600 mb-4">{t("success.subtitle")}</p>
        {q && (
          <Badge variant="default" className="bg-green-600 text-white px-4 py-2">
            {t("success.policyActiveFrom")} {q.coverageStartDate}
          </Badge>
        )}
      </div>

      {/* ── Email notice ── */}
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Mail className="h-4 w-4" />
        <AlertDescription>
          <strong>{t("success.emailNoticeStrong")}</strong> {t("success.emailNoticeDesc")}
        </AlertDescription>
      </Alert>

      {/* ── Non-fatal data load error ── */}
      {dataError && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-yellow-800">{dataError}</AlertDescription>
        </Alert>
      )}

      {/* ── Document Status Section ── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#0056b3]" />
            Policy Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {docStatus === "polling" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4 text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <p className="text-sm">Preparing your policy documents… This usually takes about 30 seconds.</p>
              </div>
              <DocumentSkeleton />
              <DocumentSkeleton />
              <DocumentSkeleton />
            </div>
          )}

          {docStatus === "ready" && (
            <div className="space-y-3">
              <p className="text-sm text-green-600 font-medium mb-3 flex items-center gap-2">
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
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{downloadError}</AlertDescription>
                </Alert>
              )}
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full border-[#0056b3] text-[#0056b3] hover:bg-blue-50"
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
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <p className="text-sm text-gray-600">
                {docStatus === "timeout"
                  ? "Document generation is taking longer than expected. Please refresh or contact support."
                  : "Could not load documents. Please try again or contact support."}
              </p>
              <Button variant="outline" size="sm" onClick={handleRetryPoll}>
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Policy Summary Card ── */}
      <Card className="mb-6 border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <FileText className="h-5 w-5" />
            {t("success.policySummaryTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t("success.policyNumber")}</span>
                <span className="font-medium">{displayPolicyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("success.coverageType")}</span>
                <span className="font-medium">{q ? formatPlanType(q.planType) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("success.policyPeriod")}</span>
                <span className="font-medium">
                  {q ? `${q.coverageStartDate} ${t("success.to")} ${q.expiryDate}` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("success.annualPremium")}</span>
                <span className="font-medium">{q ? fmtCurrency(q.annualPremium) : "—"}</span>
              </div>
            </div>

            <div className="space-y-3">
              {q && q.buildingSum > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("success.buildingCoverage")}</span>
                  <span className="font-medium">{fmtCurrency(q.buildingSum)}</span>
                </div>
              )}
              {q && q.contentsSum > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("success.contentsCoverage")}</span>
                  <span className="font-medium">{fmtCurrency(q.contentsSum)}</span>
                </div>
              )}
              {paymentResult && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("success.paymentMethod")}</span>
                  <span className="font-medium">{paymentResult.gatewayName || paymentResult.paymentMethod}</span>
                </div>
              )}
              {paymentResult && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("success.transactionId")}</span>
                  <span className="font-medium text-sm">{paymentResult.referenceNumber}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Policyholder + What's Next ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              {t("success.policyholderInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">{t("success.name")}</p>
              <p className="font-medium">{pd?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("success.email")}</p>
              <p className="font-medium">{pd?.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("success.phone")}</p>
              <p className="font-medium">{pd?.mobileNumber ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("success.propertyAddress")}</p>
              <p className="font-medium text-sm">{pa ? formatAddress(pa) : "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
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
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">{n}</span>
                </div>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Button variant="outline" onClick={() => router.push("/dashboard/policies")}>
          <Eye className="h-4 w-4 mr-2" /> {t("success.viewAllPolicies")}
        </Button>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" /> {t("success.sharePolicy")}
        </Button>
        <Button variant="outline">
          <Phone className="h-4 w-4 mr-2" /> {t("success.contactSupport")}
        </Button>
      </div>

      {/* ── Support ── */}
      <Card className="border-gray-200">
        <CardHeader><CardTitle>{t("success.needHelp")}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold mb-1">{t("success.customerService")}</h4>
              <p className="text-sm text-gray-600">1-300-13-8420</p>
              <p className="text-xs text-gray-500">{t("success.available247")}</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold mb-1">{t("success.emailSupport")}</h4>
              <p className="text-sm text-gray-600">support@etiqa.com</p>
              <p className="text-xs text-gray-500">{t("success.responseTime")}</p>
            </div>
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold mb-1">{t("success.claimsHotline")}</h4>
              <p className="text-sm text-gray-600">1-800-22-3372</p>
              <p className="text-xs text-gray-500">{t("success.emergencyClaims")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Return to Dashboard ── */}
      <div className="text-center mt-8">
        <Button onClick={() => router.push("/dashboard")} size="lg" className="bg-[#0056b3] hover:bg-[#004494] text-white">
          <Home className="h-5 w-5 mr-2" />
          {t("success.returnToDashboard")}
        </Button>
      </div>

      {/* ── Document Ready Modal (auto-opens when isReady:true) ── */}
      <Dialog open={docModalOpen} onOpenChange={setDocModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              🎉 Your Policy is Ready
              {policyNumber && (
                <span className="text-sm font-normal text-gray-500">— {policyNumber}</span>
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
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{downloadError}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4 pt-3 border-t">
            <Button
              className="w-full bg-[#0056b3] hover:bg-[#004494] text-white"
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
