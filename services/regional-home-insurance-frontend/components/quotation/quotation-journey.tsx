"use client"

import { useState } from "react"
import DocumentScanner from "./document-scanner"
import QuotationForm from "./quotation-form"
import type { ScanDocumentResult } from "@/lib/api/scan-document"

export default function QuotationJourney() {
  const [scanResult,  setScanResult]  = useState<ScanDocumentResult | null>(null)
  const [scannerDone, setScannerDone] = useState(false)

  return (
    <div className="space-y-6">
      {}
      <DocumentScanner
        onScanComplete={(result) => {
          setScanResult(result)
          setScannerDone(true)
        }}
        onSkip={() => setScannerDone(true)}
        onReopen={() => setScannerDone(false)}
        collapsed={scannerDone}
      />

      {}
      <QuotationForm scanResult={scanResult} />
    </div>
  )
}
