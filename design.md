# AI Document Scanner — Design Document

**Feature:** Auto-fill purchase form by scanning uploaded documents (IC, property title, policy, utility bill)  
**Regions:** PH · ID · KH  
**Status:** Planning  

---

## 1. Problem Statement

Customers filling out the home insurance purchase form must manually type personal info,
property address, and property details. This is tedious and error-prone.
Most of this information already exists on documents they have at hand
(IC, property title, previous policy).

**Goal:** Let the customer upload a document at the start of the purchase journey.
The AI extracts all readable fields, pre-fills the form, highlights what was filled vs what
still needs manual input, and discards the document immediately after extraction.

---

## 2. Can We Use LLaMA?

**Yes — specifically LLaMA 3.2 Vision.**

Meta's LLaMA 3.2 Vision (11B or 90B parameter) is a multimodal model that accepts
both text and images. It can read a photo or scanned image of a document and return
structured JSON of extracted fields.

### LLaMA 3.2 Vision vs Alternatives

| | LLaMA 3.2 Vision (self-hosted) | GPT-4o Vision (OpenAI) | Google Document AI |
|---|---|---|---|
| Cost | GPU server only (no per-call fee) | ~$0.005–0.01 per page | ~$0.0015 per page |
| Privacy | Data never leaves your server ✅ | Data sent to OpenAI ❌ | Data sent to Google ❌ |
| Setup | Moderate (Ollama or vLLM) | Minutes (API key) | Minutes (GCP project) |
| Accuracy on docs | Good (11B), Very Good (90B) | Excellent | Excellent (purpose-built) |
| GPU required | Yes (min. 16 GB VRAM for 11B) | No | No |
| PDF support | Needs conversion to image first | Native | Native |
| Best for | Privacy-first, long-term cost | Fastest to ship | Structured forms |

**Recommendation for self-hosted:** Start with **LLaMA 3.2 Vision 11B** via **Ollama**
(easiest local deployment). Upgrade to 90B or switch to vLLM for higher throughput
once you have a real GPU server.

**If shipping speed matters more than privacy:** Use **GPT-4o Vision** for v1,
migrate to self-hosted later. The AI service interface is designed so swapping
the underlying model requires only changing one file.

### GPU Server Options (when you're ready)

| Provider | GPU | VRAM | Est. Cost | Good for |
|---|---|---|---|---|
| RunPod | RTX 4090 | 24 GB | ~$0.44/hr | Dev / low traffic |
| Lambda Labs | A10 | 24 GB | ~$0.60/hr | Staging |
| RunPod / Vast.ai | A100 80 GB | 80 GB | ~$1.50/hr | Production 90B |
| AWS EC2 `g4dn.xlarge` | T4 | 16 GB | ~$0.53/hr | AWS-first shops |

For **development/testing**, LLaMA 3.2 Vision 11B runs on a local machine with
a 16 GB GPU (e.g. RTX 3080/4080) or on CPU with Ollama (slow but functional for testing).

---

## 3. Architecture

### 3.1 New Repo: `doc-scanner-svc`

The AI scanner is a **separate Python microservice** — not inside ApplicationService.

**Reasons:**
- LLaMA tooling (Ollama, vLLM, LangChain, Hugging Face) is Python-native
- Can scale the GPU pod independently from the C# API
- Model swaps (LLaMA → GPT-4o → Gemini) stay isolated — zero impact on backend
- Avoids mixing AI infra concerns into the insurance business logic

### 3.2 High-Level Flow

```
Customer
  │
  │  (1) Upload document (IC / property title / policy / utility bill)
  ▼
Frontend (React/Next.js)
  │
  │  (2) POST /scan  multipart/form-data  { file, documentType, countryCode }
  ▼
doc-scanner-svc  (Python · FastAPI)
  │
  │  (3a) PDF → convert pages to images (pdf2image)
  │  (3b) Send image + extraction prompt to LLaMA 3.2 Vision
  │  (3c) Parse model response → structured JSON
  │  (3d) File discarded from memory immediately
  │
  │  (4) Return ExtractionResult JSON
  ▼
Frontend
  │
  │  (5) Map extracted fields → form fields
  │  (6) Save to session storage
  │  (7) Show filled / unfilled field status to customer
  ▼
Customer completes / corrects remaining fields → submits purchase
```

### 3.3 Service Boundaries

```
┌─────────────────────────────────┐    ┌──────────────────────────────┐
│        doc-scanner-svc          │    │      ApplicationService       │
│  (Python · FastAPI · LLaMA)     │    │       (C# · ASP.NET Core)    │
│                                 │    │                              │
│  POST /scan                     │    │  POST /api/applications      │
│  GET  /health                   │    │  PUT  /api/rateconfig/...    │
│  GET  /supported-doc-types      │    │  POST /api/rateconfig/...    │
└─────────────────────────────────┘    └──────────────────────────────┘
         ▲                                          ▲
         │                                          │
         └──────────── Frontend ───────────────────┘
```

The two services are **independent** — frontend calls each directly.
doc-scanner-svc does not call ApplicationService and vice versa.

---

## 4. doc-scanner-svc — Detail

### 4.1 Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Language | Python 3.11+ | LLaMA ecosystem is Python-native |
| Framework | FastAPI | Async, fast, auto OpenAPI docs |
| Model runtime | Ollama (dev) / vLLM (prod) | Ollama: easiest local setup; vLLM: higher throughput |
| Model | LLaMA 3.2 Vision 11B → 90B | Multimodal, good at structured extraction |
| PDF handling | `pdf2image` + `poppler` | Converts PDF pages to PNG before sending to vision model |
| Image handling | Pillow | Resize/optimise image before inference |
| Prompt framework | LangChain (optional) | Structured output parsing, retry logic |
| Containerisation | Docker + docker-compose | GPU passthrough via `--gpus all` |

### 4.2 Folder Structure

```
doc-scanner-svc/
├── app/
│   ├── main.py                  # FastAPI app, routes
│   ├── config.py                # Settings (model name, Ollama URL, max file size)
│   ├── routers/
│   │   └── scan.py              # POST /scan endpoint
│   ├── services/
│   │   ├── extractor.py         # Calls LLaMA, parses response → ExtractionResult
│   │   ├── pdf_converter.py     # pdf2image wrapper
│   │   └── image_utils.py       # Resize, validate, sanitise
│   ├── models/
│   │   ├── extraction_result.py # Pydantic response schema
│   │   └── document_type.py     # Enum: IC, PROPERTY_TITLE, POLICY, UTILITY_BILL
│   └── prompts/
│       ├── ic_passport.txt      # Extraction prompt for IC / passport
│       ├── property_title.txt   # Extraction prompt for property title
│       ├── policy.txt           # Extraction prompt for insurance policy
│       └── utility_bill.txt     # Extraction prompt for utility bill
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

### 4.3 API Contract

#### `POST /scan`

**Request:** `multipart/form-data`

| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | File | ✅ | PDF, JPG, PNG, WEBP — max 10 MB |
| `documentType` | string | ✅ | `IC` \| `PROPERTY_TITLE` \| `POLICY` \| `UTILITY_BILL` |
| `countryCode` | string | ✅ | `PH` \| `ID` \| `KH` — affects field expectations |

**Response `200 OK`:**

```json
{
  "documentType": "IC",
  "countryCode": "PH",
  "confidence": 0.91,
  "fields": {
    "fullName":        { "value": "Juan dela Cruz",  "confidence": 0.97, "filled": true  },
    "dateOfBirth":     { "value": "1990-05-14",      "confidence": 0.95, "filled": true  },
    "idNumber":        { "value": "123-456-789-000", "confidence": 0.93, "filled": true  },
    "gender":          { "value": "Male",            "confidence": 0.98, "filled": true  },
    "nationality":     { "value": "Filipino",        "confidence": 0.99, "filled": true  },
    "addressLine1":    { "value": "123 Rizal St",    "confidence": 0.82, "filled": true  },
    "city":            { "value": "Makati",          "confidence": 0.88, "filled": true  },
    "state":           { "value": "Metro Manila",    "confidence": 0.85, "filled": true  },
    "postcode":        { "value": null,              "confidence": 0.00, "filled": false },
    "email":           { "value": null,              "confidence": 0.00, "filled": false },
    "phone":           { "value": null,              "confidence": 0.00, "filled": false },
    "propertyAddress": { "value": null,              "confidence": 0.00, "filled": false },
    "floorArea":       { "value": null,              "confidence": 0.00, "filled": false },
    "yearBuilt":       { "value": null,              "confidence": 0.00, "filled": false }
  },
  "warnings": [
    "Postcode not found on document — customer must enter manually."
  ]
}
```

**Error responses:**

| Code | Scenario |
|---|---|
| `400` | Unsupported file type, file too large, missing fields |
| `422` | Model returned unparseable response (will include raw output in dev mode) |
| `503` | LLaMA model not loaded / Ollama not running |

#### `GET /supported-doc-types`

Returns which document types are supported per country code.
Frontend uses this to show/hide upload options per region.

#### `GET /health`

Returns `{ "status": "ok", "model": "llama3.2-vision:11b", "modelLoaded": true }`.

### 4.4 Field Extraction Map

| Form Field | IC / Passport | Property Title | Previous Policy | Utility Bill |
|---|---|---|---|---|
| fullName | ✅ | ✅ (owner name) | ✅ (policyholder) | ✅ |
| dateOfBirth | ✅ | ❌ | ❌ | ❌ |
| idNumber | ✅ | ❌ | ❌ | ❌ |
| gender | ✅ | ❌ | ❌ | ❌ |
| nationality | ✅ | ❌ | ❌ | ❌ |
| addressLine1 | ✅ | ✅ (property addr) | ✅ (risk address) | ✅ |
| city | ✅ | ✅ | ✅ | ✅ |
| state / province | ✅ | ✅ | ✅ | ✅ |
| postcode | sometimes | ✅ | ✅ | ✅ |
| propertyType | ❌ | sometimes | ✅ | ❌ |
| floorArea | ❌ | sometimes | sometimes | ❌ |
| yearBuilt | ❌ | sometimes | sometimes | ❌ |
| constructionType | ❌ | ❌ | sometimes | ❌ |
| sumInsured | ❌ | ❌ | ✅ | ❌ |

### 4.5 LLaMA Prompting Strategy

Each `documentType` has a dedicated prompt template in `app/prompts/`.  
The prompt instructs the model to:

1. Read the image carefully
2. Extract **only** the fields listed in the schema
3. Return a **strict JSON object** — no prose, no markdown, no extra keys
4. Set field value to `null` if not found or not readable
5. Include a `confidence` float (0.0–1.0) per field

Example prompt structure (`ic_passport.txt`):
```
You are an insurance document scanner. Extract fields from this identity document.
Return ONLY valid JSON matching this schema — no markdown, no explanation.

Schema:
{
  "fullName": string | null,
  "dateOfBirth": "YYYY-MM-DD" | null,
  "idNumber": string | null,
  "gender": "Male" | "Female" | null,
  "nationality": string | null,
  "addressLine1": string | null,
  "city": string | null,
  "state": string | null,
  "postcode": string | null
}

Country context: {countryCode}
Document type: IC / Passport
```

**Robustness:** The extractor service wraps the model call with:
- JSON parse validation (retry once if invalid JSON returned)
- Field-level confidence defaulting to 0 if absent
- Timeout (30 s for 11B, 60 s for 90B)

---

## 5. Frontend Plan

### 5.1 Upload Flow — Step-by-Step

```
Purchase Journey — Step 1: Personal Details
┌─────────────────────────────────────────────────────┐
│  📄 Save time — scan your document                  │
│                                                     │
│  [ IC / Passport ]  [ Property Title ]              │
│  [ Insurance Policy ] [ Utility Bill ]              │
│                                                     │
│  [ Upload & Auto-fill ↑ ]   or   [ Fill manually ] │
└─────────────────────────────────────────────────────┘
         │ customer clicks "Upload & Auto-fill"
         ▼
┌─────────────────────────────────────────────────────┐
│  File picker (PDF, JPG, PNG — max 10 MB)            │
│  Customer selects file                              │
└─────────────────────────────────────────────────────┘
         │ file selected
         ▼
 Show loading spinner: "Scanning your document…"
         │ POST /scan → doc-scanner-svc
         ▼
┌─────────────────────────────────────────────────────┐
│  ✅ 8 of 11 fields filled automatically             │
│                                                     │
│  Full Name       Juan dela Cruz        ✅ filled    │
│  Date of Birth   14 May 1990          ✅ filled    │
│  ID Number       123-456-789-000      ✅ filled    │
│  Address         123 Rizal St, Makati ✅ filled    │
│  Postcode        [ Enter manually ]   ⚠️ not found │
│  Email           [ Enter manually ]   ⚠️ not found │
│  Phone           [ Enter manually ]   ⚠️ not found │
│                                                     │
│  [ Continue → ]                                     │
└─────────────────────────────────────────────────────┘
```

### 5.2 Session Storage Schema

After a successful scan, save to `sessionStorage` (cleared when tab closes):

```ts
interface ScannedData {
  scannedAt: string;           // ISO timestamp
  documentType: string;        // "IC" | "PROPERTY_TITLE" | "POLICY" | "UTILITY_BILL"
  fields: {
    [fieldKey: string]: {
      value: string | null;
      confidence: number;      // 0.0 – 1.0
      filled: boolean;
      source: "scanned" | "manual";  // updated when customer edits
    };
  };
}

// Key: "scanResult"
sessionStorage.setItem("scanResult", JSON.stringify(data));
```

### 5.3 Form Auto-fill Logic

```ts
// After scan result received:
function applyScannedData(result: ScanResult, formMethods: UseFormReturn) {
  Object.entries(result.fields).forEach(([fieldKey, field]) => {
    if (field.filled && field.value !== null) {
      // Only auto-fill if field is currently empty — don't overwrite customer's input
      const current = formMethods.getValues(fieldKey);
      if (!current) {
        formMethods.setValue(fieldKey, field.value, { shouldValidate: true });
      }
    }
  });
}
```

### 5.4 Field Status Indicators

Each form field shows a badge:
- ✅ **Green** — filled by scan (confidence ≥ 0.80)
- 🟡 **Yellow** — filled by scan but low confidence (< 0.80) — prompt user to verify
- ⚠️ **Grey** — not found in document — customer must type
- ✏️ **Blue** — customer manually edited a scanned value

### 5.5 Multiple Document Uploads

Customer can upload more than one document in sequence.
Each new scan **merges** into the session — new fields fill empty slots,
existing filled fields are not overwritten (unless customer re-scans same type).

```ts
function mergeScannedData(existing: ScannedData, newResult: ScanResult): ScannedData {
  const merged = { ...existing };
  Object.entries(newResult.fields).forEach(([key, field]) => {
    if (field.filled && !existing.fields[key]?.filled) {
      merged.fields[key] = { ...field, source: "scanned" };
    }
  });
  return merged;
}
```

### 5.6 What Frontend Does NOT Send to Backend

- The raw file is uploaded **only** to `doc-scanner-svc`, never to `ApplicationService`
- `ApplicationService` receives only the final form values when the customer submits
- No document bytes ever touch the insurance backend

---

## 6. Privacy & Security

| Concern | Decision |
|---|---|
| Document storage | Never stored — processed in memory, discarded immediately after extraction |
| PII in logs | Suppress field values in server logs (log field keys + confidence only) |
| File size limit | 10 MB max per upload |
| Allowed file types | PDF, JPG, JPEG, PNG, WEBP only — validate MIME type server-side |
| HTTPS | All traffic TLS — including frontend ↔ doc-scanner-svc |
| Auth on /scan | Require the same JWT bearer token as ApplicationService (same auth server) |
| Session data | Stored in `sessionStorage` only — never `localStorage`, never sent to any server unless customer submits |

---

## 7. Phased Rollout

### Phase 1 — Foundation (build this first)
- [ ] Create `doc-scanner-svc` repo (FastAPI + Ollama + LLaMA 3.2 Vision 11B)
- [ ] Implement `POST /scan` for IC / Passport only
- [ ] Frontend: upload UI + field status badges + sessionStorage
- [ ] Test on PH IC format

### Phase 2 — More document types
- [ ] Add prompts for Property Title, Previous Policy, Utility Bill
- [ ] Frontend: multi-document merge logic
- [ ] Test across PH, ID, KH document formats

### Phase 3 — Production hardening
- [ ] Decide and provision GPU server (RunPod / Lambda / AWS)
- [ ] Deploy vLLM for higher throughput
- [ ] Add request queue (Redis) if concurrent uploads expected
- [ ] Upgrade to LLaMA 3.2 Vision 90B if 11B accuracy insufficient

### Phase 4 — Accuracy improvements (optional)
- [ ] Fine-tune LLaMA on regional document samples (PH PhilSys, ID KTP, KH CCCD)
- [ ] Add OCR pre-processing (Tesseract) for low-quality scans before vision model

---

## 8. Decisions

| # | Question | Decision |
|---|---|---|
| 1 | Ollama vs vLLM for dev? | **Ollama** — free, simpler setup, sufficient for dev |
| 2 | Auth strategy for /scan? | **Same JWT** as ApplicationService — bearer token required on every request |
| 3 | Fallback if model fails? | **Show error + manual fill only** — no cloud fallback |
| 4 | Max pages for PDF? | **First 3 pages only** — discard the rest before inference |
| 5 | Low-confidence threshold? | **0.80** — below this, field shown in yellow "please verify" state |
