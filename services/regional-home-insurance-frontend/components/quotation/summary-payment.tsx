"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getProposal, getProposalId, initiatePayment, savePaymentResult, type GetProposalData } from "@/lib/api"
import { getSession } from "@/lib/session"
import QuotationStepper from "./quotation-stepper"
import SummaryBar, { type SummaryBreakdown } from "./summary-bar"

export default function SummaryPayment() {
  const t = useTranslations("quotation")
  const [isLoading,        setIsLoading]        = useState(true)
  const [isProcessing,     setIsProcessing]      = useState(false)
  const [agreementChecked, setAgreementChecked]  = useState(false)
  const [marketingConsent, setMarketingConsent]  = useState(false)
  const [proposal,         setProposal]          = useState<GetProposalData | null>(null)
  const [error,            setError]             = useState<string | null>(null)

  useEffect(() => {
    const session    = getSession()
    const proposalId = getProposalId()

    if (!session)    { setError(t("common.sessionExpired"));    setIsLoading(false); return }
    if (!proposalId) { setError(t("summary.proposalNotFound")); setIsLoading(false); return }

    getProposal(proposalId, session.countryCode)
      .then((res) => {
        if (!res.succeeded) { setError(res.message ?? t("summary.failedToLoad")); return }
        setProposal(res.data)
      })
      .catch(() => setError(t("summary.failedToLoad")))
      .finally(() => setIsLoading(false))
  }, [])

  const handlePay = async () => {
    if (!agreementChecked) {
      setError(t("summary.agreementRequired"))
      return
    }

    const session    = getSession()
    const proposalId = getProposalId()
    if (!session || !proposalId) { setError(t("common.sessionExpired")); return }

    setError(null)
    setIsProcessing(true)

    try {
      const response = await initiatePayment(
        { proposalId, paymentMethod: "card" },
        session.countryCode,
      )

      if (!response.succeeded) {
        setError(response.message ?? t("summary.failedPayment"))
        return
      }

      savePaymentResult({
        paymentId:       response.data.paymentId,
        referenceNumber: response.data.referenceNumber,
        paymentMethod:   response.data.paymentMethod,
        gatewayName:     response.data.gatewayName,
        amount:          response.data.amount,
        currency:        response.data.currency,
      })

      if (response.data.stripeSession?.checkoutUrl) {
        window.location.href = response.data.stripeSession.checkoutUrl
      } else {
        setError("Payment gateway did not return a checkout URL.")
      }
    } catch (err) {
      console.error("[InitiatePayment Error]", err)
      setError(t("common.somethingWentWrong"))
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-[#555555]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0056b3]" />
          <p className="text-sm">{t("summary.loadingProposal")}</p>
        </div>
      </div>
    )
  }

  const q = proposal?.quotation

  const PLAN_LABEL: Record<string, string> = {
    "building-contents": "Building + Contents",
    "building-only":     "Building Only",
    "content-only":      "Content Only",
  }

  const buildBreakdown = (): SummaryBreakdown | undefined => {
    if (!q) return undefined
    const pb    = q.premiumBreakdown
    const gross = pb?.grossPremium ?? 0
    const pct   = gross > 0 && pb ? Math.round((pb.discountAmount / gross) * 100) : undefined
    const valuables = q.valuableItems.map((v) => ({ label: v.description || v.category, value: v.value }))
    return {
      planLabel:        PLAN_LABEL[q.planType] ?? q.planType,
      coveragePeriod:   `${q.coverageStartDate} – ${q.expiryDate}`,
      coverageType:     `${q.propertyType === "landed" ? "Landed" : "Non-landed"}, ${q.numberOfStorey}-storey`,
      constructionType: q.constructionType === "full-brick" ? "Full Brick" : "Partial Brick",
      buildingSum:      q.buildingSum  > 0 ? q.buildingSum  : undefined,
      contentsSum:      q.contentsSum  > 0 ? q.contentsSum  : undefined,
      grossPremium:     pb?.grossPremium,
      discountAmount:   pb?.discountAmount,
      discountRatePct:  pct,
      serviceTaxRate:   pb?.taxRate,
      serviceTaxAmount: pb?.taxAmount,
      stampDuty:        pb?.stampDuty,
      valuables:        valuables.length ? valuables : undefined,
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 pb-6">
        <QuotationStepper currentStep={4} />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">

          {/* Personal Details */}
          {proposal && (
            <Card>
              <CardHeader><CardTitle>{t("summary.personalDetails")}</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-[#555555]">Name</span>
                  <span>{proposal.personalDetails.name}</span>

                  <span className="text-[#555555]">ID Type</span>
                  <span>{proposal.personalDetails.idType}</span>

                  <span className="text-[#555555]">ID Number</span>
                  <span>{proposal.personalDetails.idNumber}</span>

                  {proposal.personalDetails.nationality && (
                    <>
                      <span className="text-[#555555]">Nationality</span>
                      <span>{proposal.personalDetails.nationality}</span>
                    </>
                  )}

                  <span className="text-[#555555]">Gender</span>
                  <span>{proposal.personalDetails.gender}</span>

                  <span className="text-[#555555]">Date of Birth</span>
                  <span>{proposal.personalDetails.dateOfBirth}</span>

                  <span className="text-[#555555]">Mobile</span>
                  <span>{proposal.personalDetails.mobileNumber}</span>

                  <span className="text-[#555555]">Email</span>
                  <span>{proposal.personalDetails.email}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Property Address */}
          {proposal && (
            <Card>
              <CardHeader><CardTitle>{t("summary.propertyAddress")}</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>{proposal.propertyAddress.addressLine1}</p>
                {proposal.propertyAddress.addressLine2 && (
                  <p>{proposal.propertyAddress.addressLine2}</p>
                )}
                <p>{proposal.propertyAddress.city}, {proposal.propertyAddress.postcode}</p>
                <p>{proposal.propertyAddress.state}, {proposal.propertyAddress.country}</p>
              </CardContent>
            </Card>
          )}

          {/* Declaration & Aqad */}
          <Card>
            <CardHeader><CardTitle>{t("summary.declarationAqad")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreement"
                  checked={agreementChecked}
                  onCheckedChange={(checked) => setAgreementChecked(checked as boolean)}
                  className="mt-1"
                />
                <div className="text-sm">
                  <Label htmlFor="agreement" className="cursor-pointer">
                    {t("summary.agreeText")}{" "}
                    <a href="#" className="text-blue-600 underline">{t("summary.importantNotice")}</a>,{" "}
                    <a href="#" className="text-blue-600 underline">{t("summary.declarationLink")}</a>,{" "}
                    <a href="#" className="text-blue-600 underline">{t("summary.certificateContract")}</a>,{" "}
                    <a href="#" className="text-blue-600 underline">{t("summary.privacyNotice")}</a> and{" "}
                    <a href="#" className="text-blue-600 underline">{t("summary.productDisclosure")}</a>.
                  </Label>
                </div>
              </div>
              <div className="text-sm text-[#555555] bg-gray-50 p-3 rounded">
                {t("summary.pidmText")}{" "}
                <a href="#" className="text-blue-600 underline">{t("summary.pidmBrochure")}</a>{" "}
                {t("summary.pidmContact")}
              </div>
            </CardContent>
          </Card>

          {/* Marketing Consent */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("summary.marketingConsent")}{" "}
                <span className="text-sm font-normal text-[#555555]">{t("summary.marketingOptional")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketing"
                  checked={marketingConsent}
                  onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="marketing" className="cursor-pointer text-sm">
                  {t("summary.marketingText")}
                </Label>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <SummaryBar
        total={q?.totalPremium}
        totalBeforeDiscount={q?.premiumBreakdown?.totalBeforeDiscount ?? null}
        monthly={q?.monthlyPremium}
        breakdown={buildBreakdown()}
        onProceed={handlePay}
        proceedLabel={t("customize.proceed")}
        proceedLoading={isProcessing}
        proceedDisabled={!agreementChecked || isProcessing}
      />
    </>
  )
}
