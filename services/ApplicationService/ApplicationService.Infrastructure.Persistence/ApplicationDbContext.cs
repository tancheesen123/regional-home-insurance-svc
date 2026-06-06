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

        // ── Core domain ───────────────────────────────────────────────────────
        public DbSet<UserAccount> UserAccounts { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Quotation> Quotations { get; set; }
        public DbSet<Proposal> Proposals { get; set; }
        public DbSet<Policy> Policies { get; set; }
        public DbSet<Payment> Payments { get; set; }

        // ── Rate configuration ────────────────────────────────────────────────
        public DbSet<RegionConfig> RegionConfigs { get; set; }
        public DbSet<AddOn> AddOns { get; set; }
        public DbSet<RateMultiplierConfig> RateMultiplierConfigs { get; set; }
        public DbSet<RateConfigSnapshot> RateConfigSnapshots { get; set; }

        // ── Junction tables ───────────────────────────────────────────────────
        public DbSet<QuotationAddOn> QuotationAddOns { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ── UserAccount ───────────────────────────────────────────────────
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

            // ── Customer (address embedded) ───────────────────────────────────
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
                entity.Property(e => e.Contact).HasMaxLength(20);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Region).IsRequired().HasMaxLength(2);
                entity.Property(e => e.UserId).HasMaxLength(50);
                entity.Property(e => e.AddressLine1).HasMaxLength(100);
                entity.Property(e => e.AddressLine2).HasMaxLength(100);
                entity.Property(e => e.City).HasMaxLength(100);
                entity.Property(e => e.Postcode).HasMaxLength(10);
                entity.Property(e => e.State).HasMaxLength(100);
                entity.Property(e => e.Country).HasMaxLength(100);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.HasOne(e => e.UserAccount)
                      .WithOne(u => u.Customer)
                      .HasForeignKey<Customer>(e => e.UserId);
            });

            // ── Quotation (premium breakdown + valuables embedded) ─────────────
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
                entity.Property(e => e.OwnershipType).HasMaxLength(10);
                entity.Property(e => e.PropertyType).HasMaxLength(20);
                entity.Property(e => e.PropertySubType).HasMaxLength(50);
                entity.Property(e => e.ConstructionType).HasMaxLength(20);
                entity.Property(e => e.Postcode).HasMaxLength(10);
                entity.Property(e => e.IdType).HasMaxLength(20);
                entity.Property(e => e.IdNumber).HasMaxLength(30);
                entity.Property(e => e.Nationality).HasMaxLength(50);
                entity.Property(e => e.DateOfBirth).HasMaxLength(20);
                entity.Property(e => e.PlanType).HasMaxLength(20);
                entity.Property(e => e.BuildingSum).HasColumnType("decimal(15,2)");
                entity.Property(e => e.ContentsSum).HasColumnType("decimal(15,2)");
                entity.Property(e => e.HasRiotStrike).HasDefaultValue(false);
                entity.Property(e => e.HasExtendedTheft).HasDefaultValue(false);
                entity.Property(e => e.HasAlternativeAccommodation).HasDefaultValue(false);
                entity.Property(e => e.HasPublicLiability).HasDefaultValue(false);
                // Premium breakdown columns
                entity.Property(e => e.PlanPremium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.AddOnPremium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.GrossPremium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.DiscountAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.NetPremium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TaxRate).HasColumnType("decimal(5,2)");
                entity.Property(e => e.TaxAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.StampDuty).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalBeforeDiscount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ValuableItemsJson).HasColumnType("TEXT");

                entity.Property(e => e.RegionConfigId).HasMaxLength(50);

                entity.HasOne(e => e.Customer)
                      .WithMany(c => c.Quotations)
                      .HasForeignKey(e => e.CustomerId);

                entity.HasOne(e => e.RegionConfig)
                      .WithMany(r => r.Quotations)
                      .HasForeignKey(e => e.RegionConfigId)
                      .IsRequired(false)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ── Proposal ──────────────────────────────────────────────────────
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

            // ── Policy (documents embedded) ───────────────────────────────────
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
                entity.Property(e => e.DocumentsJson).HasColumnType("TEXT");

                entity.HasOne(e => e.Proposal)
                      .WithOne(p => p.Policy)
                      .HasForeignKey<Policy>(e => e.ProposalId);
            });

            // ── Payment ───────────────────────────────────────────────────────
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
            });

            // ── RegionConfig ──────────────────────────────────────────────────
            modelBuilder.Entity<RegionConfig>(entity =>
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
                entity.Property(e => e.ServiceTaxRate).HasColumnType("decimal(5,2)");
                entity.Property(e => e.StampDutyAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.StampDutyWaiverEligiblePremium).HasColumnType("decimal(18,2)");
                entity.Property(e => e.AreaUnit).IsRequired().HasMaxLength(5);
                entity.Property(e => e.AreaMin).HasColumnType("decimal(10,2)");
                entity.Property(e => e.AreaMax).HasColumnType("decimal(10,2)");
                entity.Property(e => e.StoreyIncrementPct).HasColumnType("decimal(5,4)");
                entity.Property(e => e.ProfessionalFeeRate).HasColumnType("decimal(5,4)");
                entity.Property(e => e.BuildingRatesJson).HasColumnType("TEXT");
                entity.Property(e => e.ValuableRatesJson).HasColumnType("TEXT");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.HasIndex(e => new { e.Region, e.IsActive });
            });

            // ── AddOn ─────────────────────────────────────────────────────────
            modelBuilder.Entity<AddOn>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.Code).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasColumnType("TEXT");
                entity.Property(e => e.EligiblePlanTypes).IsRequired().HasMaxLength(20);
                entity.Property(e => e.SumInsuredBasis).IsRequired().HasMaxLength(10);
                entity.Property(e => e.RatesJson).HasColumnType("TEXT");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.HasIndex(e => e.Code).IsUnique();
            });

            // ── RateMultiplierConfig ──────────────────────────────────────────
            modelBuilder.Entity<RateMultiplierConfig>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.Region).IsRequired().HasMaxLength(5);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
                entity.Property(e => e.FactorKey).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Multiplier).HasColumnType("decimal(10,4)");
                entity.Property(e => e.Label).IsRequired().HasMaxLength(200);
                entity.Property(e => e.KeywordsJson).HasColumnType("TEXT");
                entity.Property(e => e.Description).HasColumnType("TEXT");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);

                entity.Property(e => e.RegionConfigId).HasMaxLength(50);
                entity.HasIndex(e => new { e.Region, e.Type, e.FactorKey, e.IsActive });

                entity.HasOne(e => e.RegionConfig)
                      .WithMany(r => r.RateMultiplierConfigs)
                      .HasForeignKey(e => e.RegionConfigId)
                      .IsRequired(false)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ── RateConfigSnapshot ────────────────────────────────────────────
            modelBuilder.Entity<RateConfigSnapshot>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.Region).IsRequired().HasMaxLength(2);
                entity.Property(e => e.Label).IsRequired().HasMaxLength(200);
                entity.Property(e => e.SnapshotJson).IsRequired().HasColumnType("TEXT");
                entity.Property(e => e.SnapshotType).IsRequired().HasMaxLength(10);
                entity.Property(e => e.ChangeLogsJson).HasColumnType("TEXT");
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);
                entity.Property(e => e.RegionConfigId).HasMaxLength(50);

                entity.HasIndex(e => new { e.Region, e.CreatedAt });

                entity.HasOne(e => e.RegionConfig)
                      .WithMany(r => r.RateConfigSnapshots)
                      .HasForeignKey(e => e.RegionConfigId)
                      .IsRequired(false)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ── QuotationAddOn (junction: Quotation ↔ AddOn M:N) ─────────────
            modelBuilder.Entity<QuotationAddOn>(entity =>
            {
                entity.HasKey(e => new { e.QuotationId, e.AddOnId });
                entity.Property(e => e.QuotationId).HasMaxLength(50).IsRequired();
                entity.Property(e => e.AddOnId).HasMaxLength(50).IsRequired();

                entity.HasOne(e => e.Quotation)
                      .WithMany(q => q.QuotationAddOns)
                      .HasForeignKey(e => e.QuotationId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.AddOn)
                      .WithMany(a => a.QuotationAddOns)
                      .HasForeignKey(e => e.AddOnId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
