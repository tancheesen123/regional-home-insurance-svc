using ApplicationService.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected ApplicationDbContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<UserAccount> UserAccounts { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<AddressEntity> Addresses { get; set; }
        public DbSet<CustomerPaymentMethod> CustomerPaymentMethods { get; set; }
        public DbSet<Quotation> Quotations { get; set; }
        public DbSet<ValuableItem> ValuableItems { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Proposal> Proposals { get; set; }
        public DbSet<Policy> Policies { get; set; }
        public DbSet<PolicyDocument> PolicyDocuments { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PaymentGateway> PaymentGateways { get; set; }

        // ── Product / Rate tables ─────────────────────────────────────────────
        public DbSet<ProductPremiumRate> ProductPremiumRates { get; set; }
        public DbSet<AddOn> AddOns { get; set; }
        public DbSet<AddOnRate> AddOnRates { get; set; }
        public DbSet<TaxConfig> TaxConfigs { get; set; }

        // ── Quotation premium breakdown ───────────────────────────────────────
        public DbSet<QuotationPremium> QuotationPremiums { get; set; }

        // ── Valuable item category rates (per region) ─────────────────────────
        public DbSet<ValuableCategoryRate> ValuableCategoryRates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // UserAccount
            modelBuilder.Entity<UserAccount>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.Ignore(e => e.Id);
                entity.Property(e => e.UserId).HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.HashedPassword).IsRequired().HasColumnType("TEXT");
                entity.Property(e => e.IsVerified).IsRequired();
                entity.Property(e => e.Role).IsRequired().HasMaxLength(20).HasDefaultValue("User");
            });

            // Address
            modelBuilder.Entity<AddressEntity>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.AddressLine1).HasMaxLength(100);
                entity.Property(e => e.AddressLine2).HasMaxLength(100);
                entity.Property(e => e.City).HasMaxLength(100);
                entity.Property(e => e.Postcode).HasMaxLength(10);
                entity.Property(e => e.State).HasMaxLength(100);
                entity.Property(e => e.Country).HasMaxLength(100);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);
            });

            // Customer
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.CustomerId);
                entity.Ignore(e => e.Id);
                entity.Property(e => e.CustomerId).HasMaxLength(50);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.DateOfBirth).HasMaxLength(20);
                entity.Property(e => e.Gender).HasMaxLength(10);
                entity.Property(e => e.Nationality).HasMaxLength(100);
                entity.Property(e => e.IdType).HasMaxLength(20);
                entity.Property(e => e.IdNumber).HasMaxLength(30);
                entity.Property(e => e.AddressId).HasMaxLength(50);
                entity.Property(e => e.Contact).HasMaxLength(20);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Region).IsRequired().HasMaxLength(2);
                entity.Property(e => e.UserId).HasMaxLength(50);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.HasOne(e => e.UserAccount)
                      .WithOne(u => u.Customer)
                      .HasForeignKey<Customer>(e => e.UserId);

                entity.HasOne(e => e.Address)
                      .WithOne(a => a.Customer)
                      .HasForeignKey<Customer>(e => e.AddressId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // CustomerPaymentMethod
            modelBuilder.Entity<CustomerPaymentMethod>(entity =>
            {
                entity.HasKey(e => e.PaymentMethodId);
                entity.Ignore(e => e.Id);
                entity.Property(e => e.PaymentMethodId).HasMaxLength(50);
                entity.Property(e => e.CustomerId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.CardType).IsRequired().HasMaxLength(20);
                entity.Property(e => e.LastFourDigits).IsRequired().HasMaxLength(4);
                entity.Property(e => e.ExpiryMonth).IsRequired().HasMaxLength(2);
                entity.Property(e => e.ExpiryYear).IsRequired().HasMaxLength(4);
                entity.Property(e => e.CardHolderName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.IsPrimary).IsRequired();
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.HasOne(e => e.Customer)
                      .WithMany(c => c.PaymentMethods)
                      .HasForeignKey(e => e.CustomerId);
            });

            // Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.ProductId);
                entity.Ignore(e => e.Id);
                entity.Property(e => e.ProductId).HasMaxLength(50);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.RegionalRate).HasColumnType("TEXT");
                entity.Property(e => e.Description).HasColumnType("TEXT");
                entity.Property(e => e.IsActive).IsRequired();
            });

            // Quotation
            modelBuilder.Entity<Quotation>(entity =>
            {
                entity.HasKey(e => e.QuotationId);
                entity.Ignore(e => e.Id);
                entity.Property(e => e.QuotationId).HasMaxLength(50);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Premium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ExpiryDate).IsRequired();
                entity.Property(e => e.Region).IsRequired().HasMaxLength(2);
                entity.Property(e => e.CustomerId).HasMaxLength(50);
                entity.Property(e => e.ProductId).HasMaxLength(50);
                entity.Property(e => e.OwnershipType).HasMaxLength(10);
                entity.Property(e => e.PropertyType).HasMaxLength(20);
                entity.Property(e => e.PropertySubType).HasMaxLength(50);
                entity.Property(e => e.ConstructionType).HasMaxLength(20);
                entity.Property(e => e.Postcode).HasMaxLength(10);
                entity.Property(e => e.IdType).HasMaxLength(20);
                entity.Property(e => e.IdNumber).HasMaxLength(30);
                entity.Property(e => e.Nationality).HasMaxLength(50);
                entity.Property(e => e.DateOfBirth).HasMaxLength(20);

                // Plan & Sums Insured
                entity.Property(e => e.PlanType).HasMaxLength(20);
                entity.Property(e => e.BuildingSum).HasColumnType("decimal(15,2)");
                entity.Property(e => e.ContentsSum).HasColumnType("decimal(15,2)");

                // Add-on flags stored as bit columns (EF Core default for bool)
                entity.Property(e => e.HasRiotStrike).HasDefaultValue(false);
                entity.Property(e => e.HasExtendedTheft).HasDefaultValue(false);
                entity.Property(e => e.HasAlternativeAccommodation).HasDefaultValue(false);
                entity.Property(e => e.HasPublicLiability).HasDefaultValue(false);

                entity.HasOne(e => e.Customer)
                      .WithMany(c => c.Quotations)
                      .HasForeignKey(e => e.CustomerId);

                entity.HasOne(e => e.Product)
                      .WithMany(p => p.Quotations)
                      .HasForeignKey(e => e.ProductId)
                      .IsRequired(false);
            });

            // ValuableItem
            modelBuilder.Entity<ValuableItem>(entity =>
            {
                entity.HasKey(e => e.ItemId);
                entity.Ignore(e => e.Id);
                entity.Property(e => e.ItemId).HasMaxLength(50);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(30);
                entity.Property(e => e.Description).HasColumnType("TEXT");
                entity.Property(e => e.Value).HasColumnType("decimal(18,2)");
                entity.Property(e => e.QuotationId).HasMaxLength(50);

                entity.HasOne(e => e.Quotation)
                      .WithMany(q => q.ValuableItems)
                      .HasForeignKey(e => e.QuotationId);
            });

            // Proposal
            modelBuilder.Entity<Proposal>(entity =>
            {
                entity.HasKey(e => e.ProposalId);
                entity.Ignore(e => e.Id);
                entity.Property(e => e.ProposalId).HasMaxLength(50);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.CustomerId).HasMaxLength(50);
                entity.Property(e => e.QuotationId).HasMaxLength(50);
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.IdType).HasMaxLength(20);
                entity.Property(e => e.IdNumber).HasMaxLength(30);
                entity.Property(e => e.Nationality).HasMaxLength(50);
                entity.Property(e => e.Race).HasMaxLength(30);
                entity.Property(e => e.Gender).HasMaxLength(10);
                entity.Property(e => e.DateOfBirth).HasMaxLength(20);
                entity.Property(e => e.MobileNumber).HasMaxLength(20);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.PropAddressLine1).HasMaxLength(100);
                entity.Property(e => e.PropAddressLine2).HasMaxLength(100);
                entity.Property(e => e.PropCity).HasMaxLength(100);
                entity.Property(e => e.PropPostcode).HasMaxLength(10);
                entity.Property(e => e.PropState).HasMaxLength(100);
                entity.Property(e => e.PropCountry).HasMaxLength(100);
                entity.Property(e => e.MailAddressLine1).HasMaxLength(100);
                entity.Property(e => e.MailAddressLine2).HasMaxLength(100);
                entity.Property(e => e.MailCity).HasMaxLength(100);
                entity.Property(e => e.MailPostcode).HasMaxLength(10);
                entity.Property(e => e.MailState).HasMaxLength(100);
                entity.Property(e => e.MailCountry).HasMaxLength(100);
                entity.Property(e => e.BankName).HasMaxLength(50);
                entity.Property(e => e.BankAccountNumber).HasMaxLength(30);

                entity.HasOne(e => e.Customer)
                      .WithMany(c => c.Proposals)
                      .HasForeignKey(e => e.CustomerId);

                entity.HasOne(e => e.Quotation)
                      .WithOne(q => q.Proposal)
                      .HasForeignKey<Proposal>(e => e.QuotationId)
                      .OnDelete(DeleteBehavior.NoAction);
            });

            // Policy
            modelBuilder.Entity<Policy>(entity =>
            {
                entity.HasKey(e => e.PolicyId);
                entity.Ignore(e => e.Id);
                entity.Property(e => e.PolicyId).HasMaxLength(50);
                entity.Property(e => e.PolicyNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.StartDate).IsRequired();
                entity.Property(e => e.EndDate).IsRequired();
                entity.Property(e => e.CoverageAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.IssuedAt).IsRequired();
                entity.Property(e => e.IssuedBy).HasMaxLength(100);
                entity.Property(e => e.ProposalId).HasMaxLength(50);

                entity.HasOne(e => e.Proposal)
                      .WithOne(p => p.Policy)
                      .HasForeignKey<Policy>(e => e.ProposalId);
            });

            // PolicyDocument
            modelBuilder.Entity<PolicyDocument>(entity =>
            {
                entity.HasKey(e => e.DocumentId);
                entity.Ignore(e => e.Id);
                entity.Property(e => e.DocumentId).HasMaxLength(50);
                entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FileUrl).IsRequired().HasColumnType("TEXT");
                entity.Property(e => e.UploadedAt).IsRequired();
                entity.Property(e => e.FileType).HasMaxLength(20);
                entity.Property(e => e.PolicyId).HasMaxLength(50);

                entity.HasOne(e => e.Policy)
                      .WithMany(p => p.PolicyDocuments)
                      .HasForeignKey(e => e.PolicyId);
            });

            // PaymentGateway
            modelBuilder.Entity<PaymentGateway>(entity =>
            {
                entity.HasKey(e => e.Name);
                entity.Ignore(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(50);
                entity.Property(e => e.ApiKey).IsRequired().HasColumnType("TEXT");
                entity.Property(e => e.SupportedRegions).HasColumnType("TEXT");
            });

            // ProductPremiumRate
            modelBuilder.Entity<ProductPremiumRate>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.Region).IsRequired().HasMaxLength(2);
                entity.Property(e => e.BuildingRate).HasColumnType("decimal(10,6)");
                entity.Property(e => e.ContentRate).HasColumnType("decimal(10,6)");
                entity.Property(e => e.MinBuildingSum).HasColumnType("decimal(18,2)");
                entity.Property(e => e.MaxBuildingSum).HasColumnType("decimal(18,2)");
                entity.Property(e => e.MinContentSum).HasColumnType("decimal(18,2)");
                entity.Property(e => e.MaxContentSum).HasColumnType("decimal(18,2)");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.HasIndex(e => new { e.Region, e.IsActive });
            });

            // AddOn
            modelBuilder.Entity<AddOn>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.Code).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasColumnType("TEXT");
                entity.Property(e => e.EligiblePlanTypes).IsRequired().HasMaxLength(20);
                entity.Property(e => e.SumInsuredBasis).IsRequired().HasMaxLength(10);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.HasIndex(e => e.Code).IsUnique();
            });

            // AddOnRate
            modelBuilder.Entity<AddOnRate>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.AddOnCode).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Region).IsRequired().HasMaxLength(2);
                entity.Property(e => e.Rate).HasColumnType("decimal(10,6)");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.HasIndex(e => new { e.AddOnCode, e.Region }).IsUnique();

                entity.HasOne(e => e.AddOn)
                      .WithMany(a => a.Rates)
                      .HasForeignKey(e => e.AddOnCode)
                      .HasPrincipalKey(a => a.Code)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // TaxConfig
            modelBuilder.Entity<TaxConfig>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.Region).IsRequired().HasMaxLength(2);
                entity.Property(e => e.ServiceTaxRate).HasColumnType("decimal(5,2)");
                entity.Property(e => e.StampDutyAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.StampDutyWaiverEligiblePremium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.HasIndex(e => new { e.Region, e.IsActive });
            });

            // ValuableCategoryRate
            modelBuilder.Entity<ValuableCategoryRate>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.Region).IsRequired().HasMaxLength(2);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(30);
                entity.Property(e => e.MaxPerItem).HasColumnType("decimal(18,2)");
                entity.Property(e => e.MaxTotal).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Rate).HasColumnType("decimal(10,6)");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.HasIndex(e => new { e.Region, e.Category, e.IsActive });
            });

            // QuotationPremium
            modelBuilder.Entity<QuotationPremium>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.QuotationId).IsRequired().HasMaxLength(50);

                entity.Property(e => e.PlanPremium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.AddOnPremium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.GrossPremium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.DiscountAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.NetPremium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TaxRate).HasColumnType("decimal(5,2)");
                entity.Property(e => e.TaxAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.StampDuty).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalPremium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalBeforeDiscount).HasColumnType("decimal(18,2)");

                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.HasOne(e => e.Quotation)
                      .WithOne(q => q.QuotationPremium)
                      .HasForeignKey<QuotationPremium>(e => e.QuotationId)
                      .HasPrincipalKey<Quotation>(q => q.QuotationId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Payment
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.PaymentId);
                entity.Ignore(e => e.Id);
                entity.Property(e => e.PaymentId).HasMaxLength(50);
                entity.Property(e => e.ReferenceNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Currency).HasMaxLength(10);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.PaymentMethod).HasMaxLength(30);
                entity.Property(e => e.GatewayName).HasMaxLength(50);
                entity.Property(e => e.TransactionId).HasMaxLength(100);
                entity.Property(e => e.PaymentUrl).HasColumnType("TEXT");
                entity.Property(e => e.PaymentDate).IsRequired();
                entity.Property(e => e.ProposalId).HasMaxLength(50);

                entity.HasIndex(e => e.ReferenceNumber).IsUnique();

                entity.HasOne(e => e.Proposal)
                      .WithMany(p => p.Payments)
                      .HasForeignKey(e => e.ProposalId);

                entity.HasOne(e => e.PaymentGateway)
                      .WithMany(g => g.Payments)
                      .HasForeignKey(e => e.GatewayName)
                      .IsRequired(false);
            });
        }
    }
}
