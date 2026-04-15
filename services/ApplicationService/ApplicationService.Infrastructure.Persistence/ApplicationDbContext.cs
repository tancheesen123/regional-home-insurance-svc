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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // UserAccount
            modelBuilder.Entity<UserAccount>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.UserId).HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.HashedPassword).IsRequired().HasColumnType("TEXT");
                entity.Property(e => e.IsVerified).IsRequired();
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
                entity.Property(e => e.QuotationId).HasMaxLength(50);
                entity.Property(e => e.Premium).HasColumnType("decimal(10,2)");
                entity.Property(e => e.ExpiryDate).IsRequired();
                entity.Property(e => e.Region).IsRequired().HasMaxLength(2);
                entity.Property(e => e.CustomerId).HasMaxLength(50);
                entity.Property(e => e.ProductId).HasMaxLength(50);

                entity.HasOne(e => e.Customer)
                      .WithMany(c => c.Quotations)
                      .HasForeignKey(e => e.CustomerId);

                entity.HasOne(e => e.Product)
                      .WithMany(p => p.Quotations)
                      .HasForeignKey(e => e.ProductId);
            });

            // ValuableItem
            modelBuilder.Entity<ValuableItem>(entity =>
            {
                entity.HasKey(e => e.ItemId);
                entity.Property(e => e.ItemId).HasMaxLength(50);
                entity.Property(e => e.Description).HasColumnType("TEXT");
                entity.Property(e => e.Value).HasColumnType("decimal(10,2)");
                entity.Property(e => e.QuotationId).HasMaxLength(50);

                entity.HasOne(e => e.Quotation)
                      .WithMany(q => q.ValuableItems)
                      .HasForeignKey(e => e.QuotationId);
            });

            // Proposal
            modelBuilder.Entity<Proposal>(entity =>
            {
                entity.HasKey(e => e.ProposalId);
                entity.Property(e => e.ProposalId).HasMaxLength(50);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.CustomerId).HasMaxLength(50);
                entity.Property(e => e.QuotationId).HasMaxLength(50);

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
                entity.Property(e => e.PolicyId).HasMaxLength(50);
                entity.Property(e => e.PolicyNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.StartDate).IsRequired();
                entity.Property(e => e.EndDate).IsRequired();
                entity.Property(e => e.CoverageAmount).HasColumnType("decimal(10,2)");
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
                entity.Property(e => e.Name).HasMaxLength(50);
                entity.Property(e => e.ApiKey).IsRequired().HasColumnType("TEXT");
                entity.Property(e => e.SupportedRegions).HasColumnType("TEXT");
            });

            // Payment
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.PaymentId);
                entity.Property(e => e.PaymentId).HasMaxLength(50);
                entity.Property(e => e.Amount).HasColumnType("decimal(10,2)");
                entity.Property(e => e.Currency).HasMaxLength(10);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.GatewayName).HasMaxLength(50);
                entity.Property(e => e.TransactionId).HasMaxLength(100);
                entity.Property(e => e.PaymentDate).IsRequired();
                entity.Property(e => e.ProposalId).HasMaxLength(50);

                entity.HasOne(e => e.Proposal)
                      .WithMany(p => p.Payments)
                      .HasForeignKey(e => e.ProposalId);

                entity.HasOne(e => e.PaymentGateway)
                      .WithMany(g => g.Payments)
                      .HasForeignKey(e => e.GatewayName);
            });
        }
    }
}
