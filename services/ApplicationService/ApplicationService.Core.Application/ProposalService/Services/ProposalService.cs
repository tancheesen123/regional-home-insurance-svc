using ApplicationService.Core.Application.InforcePolicyService.DTOs;
using ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services;
using ApplicationService.Core.Application.ProposalService.DTOs;
using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using ApplicationService.Core.Application.ProposalService.Settings;
using ApplicationService.Core.Application.QuotationService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Polly;
using PollyPolicy = Polly.Policy;
using System.IO.Compression;
using System.Security.Claims;
using System.Text;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Xsl;

namespace ApplicationService.Core.Application.ProposalService.Services
{
    public class ProposalService : IProposalService
    {
        private readonly ILogger<ProposalService>    _logger;
        private readonly IProposalRepository         _proposalRepository;
        private readonly IQuotationRepository        _quotationRepository;
        private readonly IPdfService                 _pdfService;
        private readonly INotificationEmailService   _emailService;
        private readonly ISmsService                 _smsService;
        private readonly DocumentSettings            _docSettings;
        private readonly IProposalErrorService       _errorService;
        private readonly IServiceScopeFactory        _scopeFactory;

        // Product type variants present in the XSL file names (INS = conventional insurance)
        private const string ProductType = "INS";
        // Language variant: EV = English Version, BV = Bahasa Version
        private const string LangVariant = "EV";

        // ── Security: allowlist of valid region codes ─────────────────────────
        // FIX #3 — Path traversal: region is used directly in file paths;
        // validate it against a strict allowlist before any file I/O.
        private static readonly HashSet<string> AllowedRegions =
            new(StringComparer.OrdinalIgnoreCase) { "PH", "ID", "KH" };

        public ProposalService(
            ILogger<ProposalService>          logger,
            IProposalRepository               proposalRepository,
            IQuotationRepository              quotationRepository,
            IPdfService                       pdfService,
            INotificationEmailService         emailService,
            ISmsService                       smsService,
            IOptions<DocumentSettings>        docOptions,
            IProposalErrorService             errorService,
            IServiceScopeFactory              scopeFactory)
        {
            _logger              = logger;
            _proposalRepository  = proposalRepository;
            _quotationRepository = quotationRepository;
            _pdfService          = pdfService;
            _emailService        = emailService;
            _smsService          = smsService;
            _docSettings         = docOptions.Value;
            _errorService        = errorService;
            _scopeFactory        = scopeFactory;
        }

        // ── GetProposal ───────────────────────────────────────────────────────

        public async Task<GetProposalResponse> GetProposalAsync(GetProposalRequest request, ClaimsPrincipal user)
        {
            _logger.LogInformation("=== ProposalService.GetProposalAsync ===");

            // FIX #1 — IDOR: verify the caller owns this proposal before returning any data.
            var callerId = user.FindFirst("customerId")?.Value
                ?? throw new UnauthorizedAccessException("Missing identity claim. Please log in again.");

            var proposal = await _proposalRepository.GetByIdWithDetailsAsync(request.ProposalId);
            if (proposal == null)
                throw new KeyNotFoundException($"Proposal '{request.ProposalId}' not found.");

            if (proposal.CustomerId != callerId)
                throw new UnauthorizedAccessException("You do not have access to this proposal.");

            var q = proposal.Quotation;

            return new GetProposalResponse
            {
                ProposalId  = proposal.ProposalId,
                Status      = proposal.Status,
                CustomerId  = proposal.CustomerId,

                PersonalDetails = new ProposalPersonalDetailsDto
                {
                    Name         = proposal.Name,
                    IdType       = proposal.IdType,
                    IdNumber     = proposal.IdNumber,
                    Nationality  = proposal.Nationality,
                    Race         = proposal.Race,
                    Gender       = proposal.Gender,
                    DateOfBirth  = proposal.DateOfBirth,
                    MobileNumber = proposal.MobileNumber,
                    Email        = proposal.Email
                },

                PropertyAddress = new ProposalAddressDto
                {
                    AddressLine1 = proposal.PropAddressLine1,
                    AddressLine2 = proposal.PropAddressLine2,
                    City         = proposal.PropCity,
                    Postcode     = proposal.PropPostcode,
                    State        = proposal.PropState,
                    Country      = proposal.PropCountry
                },

                MailingAddress = new ProposalMailingAddressDto
                {
                    SameAsPropertyAddress = proposal.MailingSameAsProperty,
                    AddressLine1          = proposal.MailAddressLine1,
                    AddressLine2          = proposal.MailAddressLine2,
                    City                  = proposal.MailCity,
                    Postcode              = proposal.MailPostcode,
                    State                 = proposal.MailState,
                    Country               = proposal.MailCountry
                },

                BankDetails = new ProposalBankDetailsDto
                {
                    BankName      = proposal.BankName,
                    AccountNumber = proposal.BankAccountNumber
                },

                Quotation = q == null ? null : new QuotationSnapshotDto
                {
                    QuotationId     = q.QuotationId,
                    QuotationStatus = q.Status,
                    Region          = q.Region,
                    OwnershipType      = q.OwnershipType,
                    PropertyType       = q.PropertyType,
                    PropertySubType    = q.PropertySubType,
                    NumberOfStorey     = q.NumberOfStorey,
                    ConstructionType   = q.ConstructionType,
                    Postcode           = q.Postcode,
                    CurrentFlooding    = q.CurrentFlooding,
                    UnoccupiedProperty = q.UnoccupiedProperty,
                    PreviousLoss       = q.PreviousLoss,
                    PlanType    = q.PlanType,
                    BuildingSum = q.BuildingSum,
                    ContentsSum = q.ContentsSum,
                    AddOns = new AddOnSelectionDto
                    {
                        RiotStrike               = q.HasRiotStrike,
                        ExtendedTheft            = q.HasExtendedTheft,
                        AlternativeAccommodation = q.HasAlternativeAccommodation,
                        PublicLiability          = q.HasPublicLiability
                    },
                    TotalPremium   = q.Premium,
                    AnnualPremium  = q.Premium,
                    MonthlyPremium = Math.Round(q.Premium / 12, 2),
                    PremiumBreakdown = q.QuotationPremium == null ? null : new PremiumBreakdownDto
                    {
                        PlanPremium         = q.QuotationPremium.PlanPremium,
                        AddOnPremium        = q.QuotationPremium.AddOnPremium,
                        GrossPremium        = q.QuotationPremium.GrossPremium,
                        DiscountAmount      = q.QuotationPremium.DiscountAmount,
                        NetPremium          = q.QuotationPremium.NetPremium,
                        TaxRate             = q.QuotationPremium.TaxRate,
                        TaxAmount           = q.QuotationPremium.TaxAmount,
                        StampDuty           = q.QuotationPremium.StampDuty,
                        TotalPremium        = q.QuotationPremium.TotalPremium,
                        TotalBeforeDiscount = q.QuotationPremium.TotalBeforeDiscount
                    },
                    CoverageStartDate = q.CoverageStartDate.ToString("dd/MM/yyyy"),
                    ExpiryDate        = q.ExpiryDate.ToString("dd/MM/yyyy"),
                    ValuableItems = q.ValuableItems?
                        .Select(v => new ValuableItemSnapshotDto
                        {
                            ItemId      = v.ItemId,
                            Category    = v.Category,
                            Description = v.Description,
                            Value       = v.Value
                        }).ToList() ?? new()
                }
            };
        }

        // ── CreateProposal ────────────────────────────────────────────────────

        public async Task<CreateProposalResponse> CreateProposalAsync(CreateProposalRequest request, ClaimsPrincipal user)
        {
            _logger.LogInformation("=== ProposalService.CreateProposalAsync ===");

            // FIX #1 — IDOR: verify the caller owns this quotation before creating a proposal.
            var callerId = user.FindFirst("customerId")?.Value
                ?? throw new UnauthorizedAccessException("Missing identity claim. Please log in again.");

            var quotation = await _quotationRepository.GetByIdAsync(request.QuotationId);
            if (quotation == null)
                throw new KeyNotFoundException($"Quotation '{request.QuotationId}' not found.");

            if (quotation.CustomerId != callerId)
                throw new UnauthorizedAccessException("You do not have access to this quotation.");

            if (quotation.Status == "LOCKED")
                throw new InvalidOperationException("A proposal has already been created for this quotation.");
            if (quotation.Status == "CONVERTED")
                throw new InvalidOperationException("This quotation has already been converted to a policy.");
            if (quotation.Status != "QUOTED")
                throw new InvalidOperationException($"Quotation is in '{quotation.Status}' status and cannot be proposed.");

            var existingProposal = await _proposalRepository.GetByQuotationIdAsync(request.QuotationId);
            if (existingProposal != null)
                throw new InvalidOperationException($"A proposal '{existingProposal.ProposalId}' already exists for this quotation.");

            var mailing  = request.MailingAddress;
            var prop     = request.PropertyAddress;

            var proposal = new Proposal
            {
                ProposalId            = Guid.NewGuid().ToString(),
                Status                = "PENDING",
                CustomerId            = quotation.CustomerId,
                QuotationId           = quotation.QuotationId,
                Name                  = request.PersonalDetails.Name,
                IdType                = request.PersonalDetails.IdType,
                IdNumber              = request.PersonalDetails.IdNumber,
                Nationality           = request.PersonalDetails.Nationality,
                Race                  = request.PersonalDetails.Race,
                Gender                = request.PersonalDetails.Gender,
                DateOfBirth           = request.PersonalDetails.DateOfBirth,
                MobileNumber          = request.PersonalDetails.MobileNumber,
                Email                 = request.PersonalDetails.Email,
                PropAddressLine1      = prop.AddressLine1,
                PropAddressLine2      = prop.AddressLine2,
                PropCity              = prop.City,
                PropPostcode          = prop.Postcode,
                PropState             = prop.State,
                PropCountry           = prop.Country,
                MailingSameAsProperty = mailing.SameAsPropertyAddress,
                MailAddressLine1      = mailing.SameAsPropertyAddress ? prop.AddressLine1 : mailing.AddressLine1,
                MailAddressLine2      = mailing.SameAsPropertyAddress ? prop.AddressLine2 : mailing.AddressLine2,
                MailCity              = mailing.SameAsPropertyAddress ? prop.City         : mailing.City,
                MailPostcode          = mailing.SameAsPropertyAddress ? prop.Postcode     : mailing.Postcode,
                MailState             = mailing.SameAsPropertyAddress ? prop.State        : mailing.State,
                MailCountry           = mailing.SameAsPropertyAddress ? prop.Country      : mailing.Country,
                BankName              = request.BankDetails.BankName,
                BankAccountNumber     = request.BankDetails.AccountNumber,
                CreatedAt             = DateTime.UtcNow
            };

            await _proposalRepository.CreateProposalAndLockQuotationAsync(proposal);
            await _proposalRepository.SaveChangesAsync();

            return new CreateProposalResponse
            {
                ProposalId        = proposal.ProposalId,
                QuotationId       = quotation.QuotationId,
                Status            = proposal.Status,
                QuotationStatus   = "LOCKED",
                Premium           = quotation.Premium,
                CoverageStartDate = quotation.CoverageStartDate.ToString("dd/MM/yyyy"),
                ExpiryDate        = quotation.ExpiryDate.ToString("dd/MM/yyyy"),
                Message           = "Proposal created successfully. Quotation is now locked."
            };
        }

        public void ExecuteCallInBackend(BackendInvokeRequest request)
        {
            _logger.LogInformation(
                "=== ProposalService.ExecuteCallInBackend | ProposalId={ProposalId} PolicyNumber={PolicyNumber} ===",
                request.ProposalId, request.PolicyNumber);

            // FIX #3 — Path traversal: validate region against the allowlist before it is
            // used in any file path construction inside the background task.
            if (!AllowedRegions.Contains(request.Region))
            {
                _logger.LogError(
                    "ExecuteCallInBackend rejected: invalid region '{Region}' for ProposalId={ProposalId}.",
                    request.Region, request.ProposalId);
                return;
            }

            _ = Task.Run(async () =>
            {
                using var scope = _scopeFactory.CreateScope();
                var repo        = scope.ServiceProvider.GetRequiredService<IProposalRepository>();

                try
                {
                    var proposal = await repo.GetByIdWithDetailsAsync(request.ProposalId, request.Region);

                    if (proposal == null)
                    {
                        _logger.LogError(
                            "ExecuteCallInBackend: Proposal '{ProposalId}' not found — aborting.", request.ProposalId);
                        return;
                    }

                    _logger.LogInformation("Proposal retrieved. Starting GeneratePdfEmailSms.");
                    await GeneratePdfEmailSmsAsync(request, proposal, repo);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex,
                        "Background processing failed for ProposalId={ProposalId}", request.ProposalId);
                }
            });
        }

        private async Task GeneratePdfEmailSmsAsync(
            BackendInvokeRequest request, Proposal proposal, IProposalRepository repo)
        {
            _logger.LogInformation("GeneratePdfEmailSms START | ProposalId={ProposalId}", request.ProposalId);

            var pdfSuccess = await ExecutePdfAsync(request, proposal, repo);

            if (!pdfSuccess)
            {
                _logger.LogWarning(
                    "PDF generation failed for ProposalId={ProposalId} — email/SMS skipped.", request.ProposalId);
                return;
            }

            if (request.SendEmail)
                await SendEmailAsync(request, proposal);

            if (request.SendSms)
                await SendSmsAsync(request, proposal);

            _logger.LogInformation("GeneratePdfEmailSms COMPLETE | ProposalId={ProposalId}", request.ProposalId);
        }


        private async Task<bool> ExecutePdfAsync(
            BackendInvokeRequest request, Proposal proposal, IProposalRepository repo)
        {
            _logger.LogInformation("ExecutePdf START | PolicyNumber={PolicyNumber}", request.PolicyNumber);

            var status  = true;
            var message = "";
            var savedDocuments = new List<PolicyDocument>();

            // ── 1. PDS Form ───────────────────────────────────────────────────
            if (status)
            {
                var (pdfPDSForm, pdsDoc) = await HomePDSFormAsync(request, proposal);
                if (!pdfPDSForm.status)
                {
                    status  = false;
                    message = $"PDF Generate Fail - {pdfPDSForm.ReferenceId}, {pdfPDSForm.Token}";
                }
                else if (pdsDoc != null)
                    savedDocuments.Add(pdsDoc);
            }

            //// ── 2. ePolicy Form ───────────────────────────────────────────────
            //if (status)
            //{
            //    var (pdfPolicyForm, policyDoc) = await HomeEPolicyFormAsync(request, proposal);
            //    if (!pdfPolicyForm.status)
            //    {
            //        status  = false;
            //        message = $"PDF Generate Fail - {pdfPolicyForm.ReferenceId}, {pdfPolicyForm.Token}";
            //    }
            //    else if (policyDoc != null)
            //        savedDocuments.Add(policyDoc);
            //}

            //// ── 3. Tax Invoice Form ───────────────────────────────────────────
            //if (status)
            //{
            //    var (pdfTaxInvoiceForm, taxDoc) = await HomeTaxInvoiceFormAsync(request, proposal);
            //    if (!pdfTaxInvoiceForm.status)
            //    {
            //        status  = false;
            //        message = $"PDF Generate Fail - {pdfTaxInvoiceForm.ReferenceId}, {pdfTaxInvoiceForm.Token}";
            //    }
            //    else if (taxDoc != null)
            //        savedDocuments.Add(taxDoc);
            //}

            if (!status)
            {
                _logger.LogError("ExecutePdf FAILED | PolicyNumber={PolicyNumber} Reason={Message}",
                    request.PolicyNumber, message);

                await repo.AddPolicyDocumentsAsync(new List<PolicyDocument>(), request.PolicyId, false, request.Region);
                await repo.SaveChangesAsync(request.Region);
                return false;
            }

            await repo.AddPolicyDocumentsAsync(savedDocuments, request.PolicyId, true, request.Region);
            await repo.SaveChangesAsync(request.Region);

            _logger.LogInformation("ExecutePdf SUCCESS | PolicyNumber={PolicyNumber}", request.PolicyNumber);
            return true;
        }


        private async Task<(PDFStatusResponse response, PolicyDocument? doc)> HomePDSFormAsync(
            BackendInvokeRequest request, Proposal proposal)
        {
            var response = new PDFStatusResponse();
            var file     = $"{request.PolicyNumber} - Product Disclosure Sheet.pdf";
            response.PDFFileName = file;

            var region   = request.Region.ToUpper();
            var entity   = _docSettings.Entity;
            var xslPath  = Path.Combine(_docSettings.DocsPath, region, "Home", "XSL", $"HOHH_PDS_{entity}_EN.xsl");
            var storeDir = Path.Combine(_docSettings.StoragePath, region, "Home", request.PolicyId);
            var filePath = Path.Combine(storeDir, file);

            int retryCount = _docSettings.PdfRetryCount;
            int waitTime   = 3;

            // FIX #11 — Polly: exclude fatal CLR exceptions from the retry predicate.
            var retryPolicy = PollyPolicy
                .Handle<Exception>(ex => ex is not OutOfMemoryException
                                      and not StackOverflowException
                                      and not AccessViolationException)
                .WaitAndRetryAsync(
                    retryCount: retryCount,
                    sleepDurationProvider: retryAttempt =>
                    {
                        var timeToWait = TimeSpan.FromSeconds(waitTime);
                        _logger.LogInformation("HomePDSForm retry — waiting {Seconds}s", timeToWait.TotalSeconds);
                        return timeToWait;
                    },
                    onRetry: (ex, timeSpan, context) =>
                    {
                        _logger.LogError("HomePDSForm retry error: {Message}", ex.Message);
                    });

            PolicyDocument? policyDoc = null;

            try
            {
                await retryPolicy.ExecuteAsync(async () =>
                {
                    try
                    {
                        var status = false;

                        var pdsFormHTML = BuildProposalXml(proposal, request.PolicyNumber, xslPath, region);
                        if (pdsFormHTML != null)
                        {
                            var sourceReferenceId = $"HOMESDKPDFPDSFORM{DateTime.Now.Ticks}";
                            _logger.LogInformation("HomePDSForm PDF Ref ({PolicyNumber}): {Ref}",
                                request.PolicyNumber, sourceReferenceId);

                            var pdfBytes = await _pdfService.HtmlToPdfAsync(
                                pdsFormHTML,
                                new PdfMargin { Top = 8, Left = 12, Right = 12, Bottom = 8 });

                            response.ReferenceId = sourceReferenceId;

                            if (pdfBytes != null && pdfBytes.Length > 0)
                            {
                                // FIX #2 — Encrypt PDF before writing to disk (via IPdfService.EncryptPdf)
                                var password  = BuildPdfPassword(proposal);
                                var encrypted = _pdfService.EncryptPdf(pdfBytes, password);

                                Directory.CreateDirectory(storeDir);
                                if (File.Exists(filePath)) File.Delete(filePath);
                                await File.WriteAllBytesAsync(filePath, encrypted);

                                policyDoc = new PolicyDocument
                                {
                                    DocumentId = Guid.NewGuid().ToString(),
                                    FileName   = file,
                                    FileUrl    = $"{_docSettings.BaseUrl}/documents/{region}/Home/{request.PolicyId}/{file}",
                                    UploadedAt = DateTime.UtcNow,
                                    FileType   = "PDS",
                                    PolicyId   = request.PolicyId,
                                    CreatedAt  = DateTime.UtcNow
                                };
                                status = true;
                            }
                            else
                            {
                                _logger.LogError("HomePDSForm ({ProposalId}): PDF service returned empty bytes",
                                    proposal.ProposalId);
                            }
                        }

                        response.status = status;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("HomePDSForm ({ProposalId}): {Message}", proposal.ProposalId, ex.Message);
                        response.status = false;
                    }

                    if (!response.status)
                        throw new InvalidOperationException("HomePDSForm not created successfully.");
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                await _errorService.LogErrorAsync(proposal.ProposalId, "HomePDSForm", ex);
            }

            return (response, policyDoc);
        }


        private async Task<(PDFStatusResponse response, PolicyDocument? doc)> HomeEPolicyFormAsync(
            BackendInvokeRequest request, Proposal proposal)
        {
            var response = new PDFStatusResponse();
            var file     = $"{request.PolicyNumber} - ePolicy.pdf";
            response.PDFFileName = file;

            var region   = request.Region.ToUpper();
            var xslPath  = Path.Combine(_docSettings.DocsPath, region, "Home", "XSL", $"EpolicyForm_{ProductType}_EV.xsl");
            var storeDir = Path.Combine(_docSettings.StoragePath, region, "Home", request.PolicyId);
            var filePath = Path.Combine(storeDir, file);

            int retryCount = _docSettings.PdfRetryCount;
            int waitTime   = 3;

            // FIX #11 — exclude fatal CLR exceptions from retry
            var retryPolicy = PollyPolicy
                .Handle<Exception>(ex => ex is not OutOfMemoryException
                                      and not StackOverflowException
                                      and not AccessViolationException)
                .WaitAndRetryAsync(
                    retryCount: retryCount,
                    sleepDurationProvider: retryAttempt =>
                    {
                        var timeToWait = TimeSpan.FromSeconds(waitTime);
                        _logger.LogInformation("HomeEPolicyForm retry — waiting {Seconds}s", timeToWait.TotalSeconds);
                        return timeToWait;
                    },
                    onRetry: (ex, timeSpan, context) =>
                    {
                        _logger.LogError("HomeEPolicyForm retry error: {Message}", ex.Message);
                    });

            PolicyDocument? policyDoc = null;

            try
            {
                await retryPolicy.ExecuteAsync(async () =>
                {
                    try
                    {
                        var status = false;

                        var policyFormHTML = BuildProposalXml(proposal, request.PolicyNumber, xslPath, region);
                        if (policyFormHTML != null)
                        {
                            var sourceReferenceId = $"HOMESDKPDFEPOLICYFORM{DateTime.Now.Ticks}";
                            _logger.LogInformation("HomeEPolicyForm PDF Ref ({PolicyNumber}): {Ref}",
                                request.PolicyNumber, sourceReferenceId);

                            var pdfBytes = await _pdfService.HtmlToPdfAsync(
                                policyFormHTML,
                                new PdfMargin { Top = 10, Left = 0, Right = 0, Bottom = 0 });

                            response.ReferenceId = sourceReferenceId;

                            if (pdfBytes != null && pdfBytes.Length > 0)
                            {
                                // FIX #2 — Encrypt PDF before writing to disk
                                var password  = BuildPdfPassword(proposal);
                                var encrypted = _pdfService.EncryptPdf(pdfBytes, password);

                                Directory.CreateDirectory(storeDir);
                                if (File.Exists(filePath)) File.Delete(filePath);
                                await File.WriteAllBytesAsync(filePath, encrypted);

                                policyDoc = new PolicyDocument
                                {
                                    DocumentId = Guid.NewGuid().ToString(),
                                    FileName   = file,
                                    FileUrl    = $"{_docSettings.BaseUrl}/documents/{region}/Home/{request.PolicyId}/{file}",
                                    UploadedAt = DateTime.UtcNow,
                                    FileType   = "EPolicy",
                                    PolicyId   = request.PolicyId,
                                    CreatedAt  = DateTime.UtcNow
                                };
                                status = true;
                            }
                            else
                            {
                                _logger.LogError("HomeEPolicyForm ({ProposalId}): PDF service returned empty bytes",
                                    proposal.ProposalId);
                            }
                        }

                        response.status = status;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("HomeEPolicyForm ({ProposalId}): {Message}", proposal.ProposalId, ex.Message);
                        response.status = false;
                    }

                    if (!response.status)
                        throw new InvalidOperationException("HomeEPolicyForm not created successfully.");
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                await _errorService.LogErrorAsync(proposal.ProposalId, "HomeEPolicyForm", ex);
            }

            return (response, policyDoc);
        }


        private async Task<(PDFStatusResponse response, PolicyDocument? doc)> HomeTaxInvoiceFormAsync(
            BackendInvokeRequest request, Proposal proposal)
        {
            var response = new PDFStatusResponse();
            var file     = $"{request.PolicyNumber} - Tax Invoice.pdf";
            response.PDFFileName = file;

            var region   = request.Region.ToUpper();
            var xslPath  = Path.Combine(_docSettings.DocsPath, region, "Home", "XSL", $"TaxInvoice_{ProductType}_EV.xsl");
            var storeDir = Path.Combine(_docSettings.StoragePath, region, "Home", request.PolicyId);
            var filePath = Path.Combine(storeDir, file);

            int retryCount = _docSettings.PdfRetryCount;
            int waitTime   = 3;

            // FIX #11 — exclude fatal CLR exceptions from retry
            var retryPolicy = PollyPolicy
                .Handle<Exception>(ex => ex is not OutOfMemoryException
                                      and not StackOverflowException
                                      and not AccessViolationException)
                .WaitAndRetryAsync(
                    retryCount: retryCount,
                    sleepDurationProvider: retryAttempt =>
                    {
                        var timeToWait = TimeSpan.FromSeconds(waitTime);
                        _logger.LogInformation("HomeTaxInvoiceForm retry — waiting {Seconds}s", timeToWait.TotalSeconds);
                        return timeToWait;
                    },
                    onRetry: (ex, timeSpan, context) =>
                    {
                        _logger.LogError("HomeTaxInvoiceForm retry error: {Message}", ex.Message);
                    });

            PolicyDocument? policyDoc = null;

            try
            {
                await retryPolicy.ExecuteAsync(async () =>
                {
                    try
                    {
                        var status = false;

                        var taxFormHTML = BuildProposalXml(proposal, request.PolicyNumber, xslPath, region);
                        if (taxFormHTML != null)
                        {
                            var sourceReferenceId = $"HOMESDKPDFTAXINVOICE{DateTime.Now.Ticks}";
                            _logger.LogInformation("HomeTaxInvoiceForm PDF Ref ({PolicyNumber}): {Ref}",
                                request.PolicyNumber, sourceReferenceId);

                            var pdfBytes = await _pdfService.HtmlToPdfAsync(
                                taxFormHTML,
                                new PdfMargin { Top = 10, Left = 0, Right = 0, Bottom = 0 });

                            response.ReferenceId = sourceReferenceId;

                            if (pdfBytes != null && pdfBytes.Length > 0)
                            {
                                // FIX #2 — Encrypt PDF before writing to disk
                                var password  = BuildPdfPassword(proposal);
                                var encrypted = _pdfService.EncryptPdf(pdfBytes, password);

                                Directory.CreateDirectory(storeDir);
                                if (File.Exists(filePath)) File.Delete(filePath);
                                await File.WriteAllBytesAsync(filePath, encrypted);

                                policyDoc = new PolicyDocument
                                {
                                    DocumentId = Guid.NewGuid().ToString(),
                                    FileName   = file,
                                    FileUrl    = $"{_docSettings.BaseUrl}/documents/{region}/Home/{request.PolicyId}/{file}",
                                    UploadedAt = DateTime.UtcNow,
                                    FileType   = "TaxInvoice",
                                    PolicyId   = request.PolicyId,
                                    CreatedAt  = DateTime.UtcNow
                                };
                                status = true;
                            }
                            else
                            {
                                _logger.LogError("HomeTaxInvoiceForm ({ProposalId}): PDF service returned empty bytes",
                                    proposal.ProposalId);
                            }
                        }

                        response.status = status;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("HomeTaxInvoiceForm ({ProposalId}): {Message}", proposal.ProposalId, ex.Message);
                        response.status = false;
                    }

                    if (!response.status)
                        throw new InvalidOperationException("HomeTaxInvoiceForm not created successfully.");
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                await _errorService.LogErrorAsync(proposal.ProposalId, "HomeTaxInvoiceForm", ex);
            }

            return (response, policyDoc);
        }


        private async Task<bool> SendEmailAsync(BackendInvokeRequest request, Proposal proposal)
        {
            _logger.LogInformation("SendEmail START | ProposalId={ProposalId}", request.ProposalId);

            if (string.IsNullOrWhiteSpace(proposal.Email))
            {
                _logger.LogWarning("SendEmail skipped — no email address on proposal {ProposalId}.", request.ProposalId);
                return false;
            }

            try
            {
                var region   = request.Region.ToUpper();
                var entity   = _docSettings.Entity.ToLower();
                var docLang  = "en";
                var emailXsl = Path.Combine(
                    _docSettings.DocsPath, region, "Home", "Email",
                    $"{entity}_hohh_success_{docLang}.xsl");

                string htmlBody;
                var emailHtml = BuildProposalXml(proposal, request.PolicyNumber, emailXsl, region);
                if (emailHtml != null)
                {
                    htmlBody = emailHtml;
                }
                else
                {
                    _logger.LogWarning("Email XSL not found or failed at {Path} — using plain text fallback.", emailXsl);
                    htmlBody = BuildFallbackEmailHtml(proposal, request.PolicyNumber);
                }

                // ── 2. Zip the generated PDFs ─────────────────────────────────
                var storeDir    = Path.Combine(_docSettings.StoragePath, region, "Home", request.PolicyId);
                var zipBytes    = ZipPolicyDocuments(storeDir, request.PolicyNumber);
                var attachments = new List<EmailAttachment>();

                if (zipBytes != null)
                {
                    attachments.Add(new EmailAttachment
                    {
                        FileName    = $"{request.PolicyNumber}-AllDocuments.zip",
                        Content     = zipBytes,
                        ContentType = "application/zip"
                    });
                }

                var subject = $"Home Insurance : Your ePolicy is ready ({request.PolicyNumber})";
                var refId   = $"HOMESDK-Email-{DateTime.UtcNow.Ticks}";

                // FIX #4 — PII logging: mask email address before writing to log.
                _logger.LogInformation("Sending policy email | Ref={RefId} To={Email}",
                    refId, MaskEmail(proposal.Email));

                var sent = await _emailService.SendPolicyEmailAsync(
                    toEmail:     proposal.Email,
                    toName:      proposal.Name ?? string.Empty,
                    subject:     subject,
                    htmlBody:    htmlBody,
                    attachments: attachments);

                if (sent)
                    _logger.LogInformation("SendEmail SUCCESS | Ref={RefId}", refId);
                else
                    _logger.LogWarning("SendEmail returned false | Ref={RefId}", refId);

                return sent;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SendEmail FAILED | ProposalId={ProposalId}", request.ProposalId);
                return false;
            }
        }

        private async Task SendSmsAsync(BackendInvokeRequest request, Proposal proposal)
        {
            _logger.LogInformation("SendSms START | ProposalId={ProposalId}", request.ProposalId);

            if (string.IsNullOrWhiteSpace(proposal.MobileNumber))
            {
                _logger.LogWarning("SendSms skipped — no mobile number on proposal {ProposalId}.", request.ProposalId);
                return;
            }

            try
            {
                // ── 1. Load SMS template ──────────────────────────────────────
                var region  = request.Region.ToUpper();
                var entity  = _docSettings.Entity.ToLower();
                var smsFile = Path.Combine(
                    _docSettings.DocsPath, region, "Home", "SMS",
                    $"{entity}_en_sms.txt");

                string smsText;
                if (File.Exists(smsFile))
                {
                    smsText = await File.ReadAllTextAsync(smsFile);

                    var policySuffix = request.PolicyNumber.Length >= 3
                        ? request.PolicyNumber[^3..]
                        : request.PolicyNumber;

                    smsText = ReplaceSmsPlaceholders(smsText, new Dictionary<string, string>
                    {
                        ["<PolicyNo>"]     = request.PolicyNumber,
                        ["<PolicySuffix>"] = policySuffix,
                        ["<Name>"]         = proposal.Name ?? string.Empty,
                    });
                }
                else
                {
                    _logger.LogWarning("SMS template not found at {Path} — using fallback.", smsFile);
                    smsText = $"Your Home Insurance policy {request.PolicyNumber} has been issued. Thank you.";
                }

                // ── 2. Send SMS ───────────────────────────────────────────────
                var refId = $"HOMESDK-SMS-{DateTime.UtcNow.Ticks}";

                // FIX #4 — PII logging: mask mobile number before writing to log.
                _logger.LogInformation("Sending SMS | Ref={RefId} To={Mobile}",
                    refId, MaskMobile(proposal.MobileNumber));

                var sent = await _smsService.SendSmsAsync(
                    mobileNumber: proposal.MobileNumber,
                    countryCode:  region,
                    message:      smsText,
                    sourceRefId:  refId);

                if (sent)
                    _logger.LogInformation("SendSms SUCCESS | Ref={RefId}", refId);
                else
                    _logger.LogWarning("SendSms returned false | Ref={RefId}", refId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SendSms FAILED | ProposalId={ProposalId}", request.ProposalId);
            }
        }

        /// <summary>
        /// Builds the XML data tree for a proposal, applies the XSL transform, and returns the resulting HTML.
        /// </summary>
        /// <param name="proposal">Proposal entity (with Quotation + QuotationPremium loaded).</param>
        /// <param name="policyNumber">Formatted policy number, e.g. "HI-ID-2025-123456".</param>
        /// <param name="xslPath">Absolute or app-relative path to the XSL stylesheet.</param>
        /// <param name="region">Two-letter region code used to resolve the correct image assets.</param>
        private string? BuildProposalXml(Proposal proposal, string policyNumber, string xslPath, string region)
        {
            try
            {
                var q        = proposal.Quotation;
                var qp       = q?.QuotationPremium;
                var docsPath = _docSettings.DocsPath;
                var entity   = _docSettings.Entity;

                var coverageAmount   = Math.Round((q?.BuildingSum ?? 0) + (q?.ContentsSum ?? 0), 2).ToString("N2");
                var planPremium      = (qp?.PlanPremium    ?? 0).ToString("N2");
                var discountRate     = string.Empty;
                var discountAmount   = (qp?.DiscountAmount ?? 0).ToString("N2");
                var commissionRate   = "0";
                var commissionAmount = "0.00";
                var netPremium       = (qp?.NetPremium     ?? 0).ToString("N2");
                var serviceTaxRate   = ((int)((qp?.TaxRate ?? 0) * 100)).ToString();
                var serviceTaxAmount = (qp?.TaxAmount      ?? 0).ToString("N2");
                var stampDuty        = (qp?.StampDuty      ?? 0).ToString("N2");
                var totalPremium     = (qp?.TotalPremium   ?? 0).ToString("N2");

                bool isBanca            = false;
                bool isAgency           = false;
                bool isCommissionAgency = false;
                bool isCommissionBanca  = false;

                var addOnList = new List<(string Name, string Premium)>();
                if (q?.HasRiotStrike               == true) addOnList.Add(("Riot & Strike",             "0.00"));
                if (q?.HasExtendedTheft            == true) addOnList.Add(("Extended Theft",            "0.00"));
                if (q?.HasAlternativeAccommodation == true) addOnList.Add(("Alternative Accommodation", "0.00"));
                if (q?.HasPublicLiability          == true) addOnList.Add(("Public Liability",          "0.00"));
                bool hasAddOn = addOnList.Count > 0;

                // FIX #7 — Use AppContext.BaseDirectory (stable) instead of
                // Directory.GetCurrentDirectory() (can change at runtime).
                // FIX #6 — Use the actual region code instead of the hardcoded "/ID/" path.
                // FIX #7 — Use Path.Combine instead of string concatenation with "/" to
                // correctly handle cross-platform separators.
                var baseDir = AppContext.BaseDirectory;

                string ImgPath(string fileName) =>
                    Path.Combine(baseDir, docsPath, region, "Home", "Images", fileName);

                string LoadImage(string fileName)
                {
                    var bytes = File.ReadAllBytes(ImgPath(fileName));
                    return "data:image/png;base64," + Convert.ToBase64String(bytes);
                }

                var egibHeaderEnImage  = LoadImage("EGIB-ENG.png");
                var egibHeaderBmImage  = LoadImage("EGIB-BM.png");
                var logoImageBase64    = egibHeaderEnImage;

                var blackCircledNumber1 = LoadImage("Black_Circled_Number_1.png");
                var blackCircledNumber2 = LoadImage("Black_Circled_Number_2.png");
                var blackCircledNumber3 = LoadImage("Black_Circled_Number_3.png");
                var blackCircledNumber4 = LoadImage("Black_Circled_Number_4.png");

                var phoneImageBase64   = LoadImage("Contact_Us.png");
                var websiteImageBase64 = LoadImage("Visit_Us.png");
                var emailImageBase64   = LoadImage("Email_To_Us.png");
                var qrCodeImageBase64  = LoadImage("Etiqa_QR_EN.png");
                var questionMarkBase64 = LoadImage("Question_Mark.png");

                var perlindunganTenang = string.Empty;
                var websiteUrl         = string.Empty;

                var xmlTree = new XDocument(
                    new XElement("root",

                        new XElement("ImageEgibEnHeader",   egibHeaderEnImage),
                        new XElement("ImageEgibBmHeader",   egibHeaderBmImage),

                        new XElement("P_Date",                DateTime.Now.ToString("dd/MM/yyyy")),
                        new XElement("P_IsBanca",             isBanca),
                        new XElement("P_IsAgency",            isAgency),
                        new XElement("P_IsCommissionAgency",  isCommissionAgency),
                        new XElement("P_IsCommissionBanca",   isCommissionBanca),

                        new XElement("P_PaymentDate",         (string?)null),
                        new XElement("P_CoverageAmount",      coverageAmount),
                        new XElement("P_PlanPremium",         planPremium),
                        new XElement("P_HasAddOn",            hasAddOn),
                        addOnList.Select(a =>
                            new XElement("P_AddOn",
                                new XElement("Name",    a.Name),
                                new XElement("Premium", a.Premium)
                            )
                        ),

                        new XElement("P_DiscountRate",        discountRate),
                        new XElement("P_DiscountAmount",      discountAmount),
                        new XElement("P_CommissionRate",      commissionRate),
                        new XElement("P_CommissionAmount",    commissionAmount),
                        new XElement("P_NetPremium",          netPremium),
                        new XElement("P_ServiceTaxRate",      serviceTaxRate),
                        new XElement("P_ServiceTaxAmount",    serviceTaxAmount),
                        new XElement("P_StampDuty",           stampDuty),
                        new XElement("P_TotalPremium",        totalPremium),

                        new XElement("P_PerlindunganTenang",  perlindunganTenang),
                        new XElement("P_LogoImage",           logoImageBase64),
                        new XElement("P_Number1Image",        blackCircledNumber1),
                        new XElement("P_Number2Image",        blackCircledNumber2),
                        new XElement("P_Number3Image",        blackCircledNumber3),
                        new XElement("P_Number4Image",        blackCircledNumber4),
                        new XElement("P_PhoneImage",          phoneImageBase64),
                        new XElement("P_WebsiteImage",        websiteImageBase64),
                        new XElement("P_EmailImage",          emailImageBase64),
                        new XElement("P_QRCodeImage",         qrCodeImageBase64),
                        new XElement("P_QuestionMarkImage",   questionMarkBase64),
                        new XElement("P_WebsiteUrl",          websiteUrl)
                    )
                );

                if (!string.IsNullOrEmpty(xslPath) && File.Exists(xslPath))
                {
                    var xslt = new XslCompiledTransform();

                    // FIX #8 — Pass null as XmlResolver to prevent the XSL from resolving
                    // external resources (file includes, UNC paths, HTTP requests).
                    xslt.Load(xslPath, XsltSettings.Default, null);

                    var results = new StringWriter();
                    using (var reader = XmlReader.Create(new StringReader(xmlTree.ToString())))
                    {
                        xslt.Transform(reader, null, results);
                    }
                    return results.ToString();
                }
                else
                {
                    _logger.LogError("XSL template not found at: {XslPath}", xslPath);
                    return null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in BuildProposalXml for ProposalId={ProposalId}: {Message}",
                    proposal.ProposalId, ex.Message);
                return null;
            }
        }

        private static string BuildPdfPassword(Proposal proposal)
        {
            var dob      = (proposal.DateOfBirth ?? string.Empty).Replace("/", "").Replace("-", "");
            var idNumber = proposal.IdNumber ?? string.Empty;
            var last4    = idNumber.Length >= 4 ? idNumber[^4..] : idNumber;
            return $"{dob}{last4}";
        }

        private static byte[]? ZipPolicyDocuments(string storeDir, string policyNumber)
        {
            if (!Directory.Exists(storeDir))
                return null;

            var pdfFiles = Directory.GetFiles(storeDir, "*.pdf");
            if (pdfFiles.Length == 0)
                return null;

            using var memoryStream = new MemoryStream();
            using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, leaveOpen: true))
            {
                foreach (var file in pdfFiles)
                {
                    var entryName = Path.GetFileName(file);
                    var entry     = archive.CreateEntry(entryName, CompressionLevel.Optimal);
                    using var entryStream = entry.Open();
                    using var fileStream  = File.OpenRead(file);
                    fileStream.CopyTo(entryStream);
                }
            }

            return memoryStream.ToArray();
        }

        /// <summary>Replaces SMS template placeholders.</summary>
        private static string ReplaceSmsPlaceholders(string template, Dictionary<string, string> replacements)
        {
            foreach (var kv in replacements)
                template = template.Replace(kv.Key, kv.Value);
            return template;
        }

        // FIX #5 — Escape policyNumber (was raw in the string interpolation).
        private static string BuildFallbackEmailHtml(Proposal proposal, string policyNumber) =>
            $@"<html><body>
                <p>Dear {Escape(proposal.Name)},</p>
                <p>Your Home Insurance policy <strong>{Escape(policyNumber)}</strong> has been issued successfully.</p>
                <p>Please find your policy documents attached.</p>
                <p>Thank you.</p>
               </body></html>";

        /// <summary>XML/HTML-escapes a nullable string value.</summary>
        private static string Escape(string? value) =>
            string.IsNullOrEmpty(value) ? string.Empty
            : value.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;");

        // FIX #4 — PII masking helpers.
        // Email: show only the domain part  e.g.  "****@gmail.com"
        private static string MaskEmail(string? email)
        {
            if (string.IsNullOrEmpty(email)) return "***";
            var at = email.IndexOf('@');
            return at > 0 ? $"****@{email[(at + 1)..]}" : "***";
        }

        // Mobile: show only the last 4 digits  e.g.  "****1234"
        private static string MaskMobile(string? mobile)
        {
            if (string.IsNullOrEmpty(mobile)) return "***";
            return mobile.Length > 4 ? $"****{mobile[^4..]}" : "***";
        }
    }
}
