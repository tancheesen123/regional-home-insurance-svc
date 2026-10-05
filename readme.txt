================================================================================
  REGIONAL HOME INSURANCE ONLINE PURCHASE SYSTEM (RhiOPs)
  Developer Reference
================================================================================

OVERVIEW
--------
Monorepo with three services:

  Service                           Tech                      Default port
  --------------------------------  ------------------------  -----------------------------
  ApplicationService (backend)      C# / ASP.NET Core 9       see Properties/launchSettings.json
  doc-scanner-svc (AI scanning)     Python / FastAPI          see .env.example / app config
  regional-home-insurance-frontend  Next.js 15 / React 19     http://localhost:3000

Regions: PH (Philippines) · ID (Indonesia) · KH (Cambodia)
Each region has its own SQL Server database (PH, ID, KH).


================================================================================
  1. ApplicationService (C# / ASP.NET Core 9)
================================================================================

PREREQUISITES
  - .NET 9 SDK
  - SQL Server (local or remote)
  - A Gmail account with an App Password (for sending email)
  - A Stripe account in test mode (for payments)

SOLUTION
  services/ApplicationService/ApplicationService.sln

PROJECT LAYERS
  ApplicationService.Core.Domain                 Entities
  ApplicationService.Core.Application            Features (CQRS via MediatR), service interfaces, DTOs
  ApplicationService.Infrastructure.Persistence  EF Core DbContexts, migrations, repositories
  ApplicationService.Infrastructure.Shared       Email, PDF generation, HTTP clients
  ApplicationService.WebAPI                      Controllers, DI wiring, entry point

REGION ROUTING
  Every API request must include the header:
    X-Country-Code: PH   (or ID or KH)
  The backend uses it to select the matching regional DbContext.


CONFIGURATION
-------------
Do NOT commit real secrets. Keep committed config files to placeholders only.

Option A: environment variables (recommended)
  1. Copy services/ApplicationService/ApplicationService.WebAPI/.env.example to .env
  2. Fill in your local values (.env is gitignored)

Option B: .NET user secrets (per machine, outside the repo)
  cd services/ApplicationService/ApplicationService.WebAPI
  dotnet user-secrets set "JwtSettings:Secret" "<min 32 chars>"
  dotnet user-secrets set "EmailSettings:Password" "<gmail app password>"
  dotnet user-secrets set "StripeSettings:SecretKey" "sk_test_..."

Settings used (see appsettings.json for the full list):
  ConnectionStrings:PHUnityDb / IDUnityDb / KHUnityDb   SQL Server connection strings
  JwtSettings:Secret                                    Must be at least 32 characters
  EmailSettings:Username / Password                     Gmail address and App Password
  StripeSettings:SecretKey / PublishableKey / WebhookSecret


DATABASE SETUP (EF Core migrations)
-----------------------------------
Run from services/ApplicationService. Repeat for PH, ID and KH contexts.

  dotnet ef database update --context PHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI
  dotnet ef database update --context IDApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI
  dotnet ef database update --context KHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI

To add a new migration (example name "AddPaymentFields"):

  dotnet ef migrations add AddPaymentFields --context PHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI
  dotnet ef migrations add AddPaymentFields --context IDApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI
  dotnet ef migrations add AddPaymentFields --context KHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI

Then run the three `database update` commands above.


TEST DATA
---------
Create your own test users through the Register page, or insert sample rows
using clearly fake data (e.g. names like "Test User One", emails on
example.com, and placeholder ID numbers). Never commit real customer data.


STRIPE SETUP
------------
1. Get test keys from https://dashboard.stripe.com/test/apikeys
     sk_test_...   -> StripeSettings:SecretKey
     pk_test_...   -> StripeSettings:PublishableKey
2. Create a webhook endpoint in the Stripe dashboard pointing to
     https://<your-public-host>/api/payment/Callback
   Events:
     - checkout.session.completed
     - checkout.session.expired
3. Copy the signing secret (whsec_...) -> StripeSettings:WebhookSecret


ADDING A NEW API ENDPOINT
-------------------------
1. Create a controller in WebAPI/Controllers
2. Create the query or command inside its feature folder in Core.Application
3. Create the response DTO
4. Create the service and its interface
5. Create the repository (interface in Core.Application, implementation in Persistence)
6. Register new services in WebAPI/Extensions/ApplicationServiceExtensions.cs
   and new repositories in WebAPI/Extensions/PersistenceServiceExtensions.cs
7. Register AutoMapper profiles if the endpoint maps DTOs

Public endpoints (e.g. registration) must opt out of the global authorization filter:

  [AllowAnonymous]
  [HttpPost("[action]")]
  public async Task<IActionResult> Register(...) { }


================================================================================
  2. doc-scanner-svc (Python / FastAPI)
================================================================================

  cd services/doc-scanner-svc
  cp .env.example .env        # fill in local values
  pip install -r requirements.txt
  uvicorn app.main:app --reload

Settings: Groq API key (cloud) or local Ollama (llama3.2-vision).
JWT secret, issuer and audience must match ApplicationService.


================================================================================
  3. Frontend (Next.js 15)
================================================================================

  cd services/regional-home-insurance-frontend
  npm install        # or pnpm install
  npm run dev        # http://localhost:3000

The frontend calls ApplicationService with the header X-Country-Code and a JWT
Bearer token. Point it at the backend URL configured in its environment file.


================================================================================
  SECURITY NOTES
================================================================================
  - Never commit appsettings*.json values, .env files, API keys or passwords.
  - Rotate any credential that has been committed to git history.
  - Use test-mode Stripe keys and sample data only in development.
