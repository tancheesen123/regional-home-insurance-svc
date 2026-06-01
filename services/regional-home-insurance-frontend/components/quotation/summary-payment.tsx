"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { getProposal, getProposalId, initiatePayment, savePaymentResult, type GetProposalData } from "@/lib/api"
import { getSession } from "@/lib/session"
import { getRegionConfig } from "@/lib/region"
import QuotationStepper from "./quotation-stepper"

export default function SummaryPayment() {
  const router = useRouter()
  const t = useTranslations("quotation")
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreementChecked, setAgreementChecked] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  const [proposal, setProposal] = useState<GetProposalData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const session = getSession()
    const proposalId = getProposalId()

    if (!session) { setError(t("common.sessionExpired")); setIsLoading(false); return }
    if (!proposalId) { setError(t("summary.proposalNotFound")); setIsLoading(false); return }

    getProposal(proposalId, session.countryCode)
      .then((res) => {
        if (!res.succeeded) { setError(res.message ?? t("summary.failedToLoad")); return }
        console.log("[GetProposal Response]", res.data)
        setProposal(res.data)
      })
      .catch(() => setError(t("summary.failedToLoad")))
      .finally(() => setIsLoading(false))
  }, [t])

  const handlePay = async () => {
    if (!agreementChecked) {
      setError(t("summary.agreementRequired"))
      return
    }

    const session = getSession()
    const proposalId = getProposalId()
    if (!session || !proposalId) { setError(t("common.sessionExpired")); return }

    setError(null)
    setIsProcessing(true)

    try {
      const response = await initiatePayment(
        { proposalId, paymentMethod: "card" },
        session.countryCode
      )

      console.log("[InitiatePayment Response]", response)

      if (!response.succeeded) {
        setError(response.message ?? t("summary.failedPayment"))
        return
      }

      // Persist payment info so the success page can display it
      savePaymentResult({
        paymentId:     response.data.paymentId,
        referenceNumber: response.data.referenceNumber,
        paymentMethod: response.data.paymentMethod,
        gatewayName:   response.data.gatewayName,
        amount:        response.data.amount,
        currency:      response.data.currency,
      })

      // Redirect to Stripe checkout
      window.location.href = response.data.stripeSession.checkoutUrl
    } catch (err) {
      console.error("[InitiatePayment Error]", err)
      setError(t("common.somethingWentWrong"))
    } finally {
      setIsProcessing(false)
    }
  }

  const { symbol } = getRegionConfig(getSession()?.countryCode ?? "")
  const formatCurrency = (amount: number) =>
    `${symbol} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#0056b3]" />
          <p className="text-sm">{t("summary.loadingProposal")}</p>
        </div>
      </div>
    )
  }

  const q = proposal?.quotation

  return (
    <div className="max-w-6xl mx-auto">
      <QuotationStepper currentStep={4} />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Declaration + Payment */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Details */}
          {proposal && (
            <Card>
              <CardHeader><CardTitle>{t("summary.personalDetails")}</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-500">Name</span><span>{proposal.personalDetails.name}</span>
                  <span className="text-gray-500">ID Type</span><span>{proposal.personalDetails.idType}</span>
                  <span className="text-gray-500">ID Number</span><span>{proposal.personalDetails.idNumber}</span>
                  <span className="text-gray-500">Nationality</span><span>{proposal.personalDetails.nationality}</span>
                  <span className="text-gray-500">Gender</span><span>{proposal.personalDetails.gender}</span>
                  <span className="text-gray-500">Date of Birth</span><span>{proposal.personalDetails.dateOfBirth}</span>
                  <span className="text-gray-500">Mobile</span><span>{proposal.personalDetails.mobileNumber}</span>
                  <span className="text-gray-500">Email</span><span>{proposal.personalDetails.email}</span>
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
                {proposal.propertyAddress.addressLine2 && <p>{proposal.propertyAddress.addressLine2}</p>}
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
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
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
                {t("summary.marketingConsent")} <span className="text-sm font-normal text-gray-500">{t("summary.marketingOptional")}</span>
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

          {/* Pay Button */}
          <Button
            onClick={handlePay}
            disabled={!agreementChecked || isProcessing}
            className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-semibold py-4 text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t("summary.redirecting")}</span>
              </div>
            ) : (
              `${t("summary.pay")} ${q ? formatCurrency(q.totalPremium) : ""}`
            )}
          </Button>
        </div>

        {/* Right: Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader className="cursor-pointer" onClick={() => setSummaryExpanded(!summaryExpanded)}>
              <CardTitle className="flex items-center justify-between">
                <span>{t("summary.summaryTitle")}</span>
                {summaryExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            {summaryExpanded && q && (
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-semibold text-lg capitalize">{q.planType.replace("-", " + ")}</h4>
                    <Badge variant="outline">{q.region}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("summary.coveragePeriod")}</span>
                      <span>{q.coverageStartDate} – {q.expiryDate}</span>
                    </div>
                    {q.buildingSum > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("summary.buildingSum")}</span>
                        <span>{symbol} {q.buildingSum.toLocaleString()}</span>
                      </div>
                    )}
                    {q.contentsSum > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("summary.contentsSum")}</span>
                        <span>{symbol} {q.contentsSum.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add-ons */}
                {Object.entries(q.addOns).some(([, v]) => v) && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-2">{t("summary.addons")}</p>
                    <div className="space-y-1 text-sm">
                      {q.addOns.riotStrike && <p className="text-gray-600">{t("summary.riotStrikeAddon")}</p>}
                      {q.addOns.extendedTheft && <p className="text-gray-600">{t("summary.extendedTheftAddon")}</p>}
                      {q.addOns.alternativeAccommodation && <p className="text-gray-600">{t("summary.altAccommodationAddon")}</p>}
                      {q.addOns.publicLiability && <p className="text-gray-600">{t("summary.publicLiabilityAddon")}</p>}
                    </div>
                  </div>
                )}

                {/* Valuables */}
                {q.valuableItems.length > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-2">{t("summary.declaredValuables")}</p>
                    <div className="space-y-1 text-sm">
                      {q.valuableItems.map((item) => (
                        <div key={item.itemId} className="flex justify-between">
                          <span className="text-gray-600">{item.description}</span>
                          <span>{symbol} {item.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Premium */}
                <div className="bg-[#0056b3] text-white p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{t("summary.totalPremium")}</span>
                    <span className="text-xl font-bold">{formatCurrency(q.totalPremium)}</span>
                  </div>
                  <p className="text-xs text-blue-200">{t("summary.monthly")}: {formatCurrency(q.monthlyPremium)}</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
