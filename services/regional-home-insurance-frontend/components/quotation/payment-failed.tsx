"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  XCircle,
  Home,
  Mail,
  Phone,
  FileText,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cancelPayment } from "@/lib/api"

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Maps known gateway response codes / reasons to a friendly message.
 * Falls back to a generic message when the code is unrecognized or absent.
 */
function reasonForCode(code: string | null, message: string | null, reason: string | null): string {
  if (message) return message

  if (reason === "cancelled") {
    return "You cancelled the payment before it was completed. No funds have been deducted from your account."
  }

  switch (code) {
    case "CANCELLED":
    case "GR099":
      return "The payment was cancelled before it could be completed."
    case "TIMEOUT":
      return "The payment session timed out. Please try again."
    case "INSUFFICIENT_FUNDS":
      return "The payment was declined due to insufficient funds."
    default:
      return "Your payment could not be processed. No funds have been deducted from your account."
  }
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function PaymentFailed() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const t            = useTranslations("quotation")

  const code      = searchParams.get("code")
  const reference = searchParams.get("ref")
  const message   = searchParams.get("message")
  const reasonParam = searchParams.get("reason")

  const isCancelled = reasonParam === "cancelled" || code === "CANCELLED" || code === "GR099"
  const reason = reasonForCode(code, message, reasonParam)

  // When Stripe redirects here after a user-initiated cancel, the Payment record is
  // still "PENDING" in the backend (Stripe never notified us). Mark it CANCELLED so
  // the proposal isn't blocked by the "pending payment already exists" guard on retry.
  const cancelNotified = useRef(false)
  useEffect(() => {
    if (reasonParam === "cancelled" && reference && !cancelNotified.current) {
      cancelNotified.current = true
      cancelPayment(reference).catch(() => {
        // Best-effort — if this fails, the user can still retry; the backend
        // guard will surface a clear error if the old payment is still pending.
      })
    }
  }, [reasonParam, reference])

  const handleRetry = () => router.push("/dashboard/quotation/summary")

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">

      {/* ── Failure Header ── */}
      <div className="text-center mb-8 pt-2">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFEBEE] rounded-full mb-4">
          <XCircle className="h-12 w-12 text-[#D32F2F]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          {isCancelled ? t("failed.cancelledTitle") : t("failed.title")}
        </h1>
        <p className="text-base text-[#555555] mb-4">{t("failed.subtitle")}</p>
      </div>

      {/* ── Reason notice ── */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#FECACA] bg-[#FFEBEE] p-4">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-[#D32F2F]" />
        <div className="text-sm text-[#1A1A1A]">
          <p>{reason}</p>
          {reference && (
            <p className="mt-1 text-xs text-[#555555]">
              {t("failed.reference")} <span className="font-medium">{reference}</span>
            </p>
          )}
          {code && (
            <p className="mt-0.5 text-xs text-[#9E9E9E]">
              {t("failed.errorCode")} {code}
            </p>
          )}
        </div>
      </div>

      {/* ── What to do next ── */}
      <Card className="mb-6 rounded-xl border-[#E0E0E0] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1A1A1A]">
            <FileText className="h-5 w-5 text-[#F5A623]" />
            {t("failed.whatNext")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { n: 1, title: t("failed.step1Title"), desc: t("failed.step1Desc") },
            { n: 2, title: t("failed.step2Title"), desc: t("failed.step2Desc") },
            { n: 3, title: t("failed.step3Title"), desc: t("failed.step3Desc") },
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

      {/* ── Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Button
          onClick={handleRetry}
          size="lg"
          className="bg-[#F5A623] hover:bg-[#D4891A] text-white"
        >
          <RefreshCw className="h-5 w-5 mr-2" /> {t("failed.tryAgain")}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          size="lg"
          className="border-[#E0E0E0] text-[#1A1A1A] hover:border-[#F5A623] hover:text-[#F5A623] hover:bg-[#FEF3DC]"
        >
          <Home className="h-5 w-5 mr-2" /> {t("failed.returnToDashboard")}
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

    </div>
  )
}
