using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using ApplicationService.Core.Application.ProfileService.Features.Customer.Command;
using ApplicationService.Core.Application.ProfileService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProfileService.Interfaces.Services;
using ApplicationService.Core.Application.ProfileService.Settings;
using ApplicationService.Core.Domain.Entities;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ApplicationService.Core.Application.ProfileService.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ILogger<CustomerService> _logger;
        private readonly IMapper _mapper;
        private readonly ICustomerRepository _customerRepository;
        private readonly FileStorageSettings _fileStorageSettings;

        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB

        public CustomerService(
            ILogger<CustomerService> logger,
            IMapper mapper,
            ICustomerRepository customerRepository,
            IOptions<FileStorageSettings> fileStorageSettings)
        {
            _logger = logger;
            _mapper = mapper;
            _customerRepository = customerRepository;
            _fileStorageSettings = fileStorageSettings.Value;
        }

        // ── GetAll ────────────────────────────────────────────────────────────

        public async Task<CustomerGetAllResponse> GetAllCustomerAsync()
        {
            _logger.LogInformation("=== CustomerService.GetAllCustomerAsync ===");

            var customers = await _customerRepository.GetAllAsync();

            return new CustomerGetAllResponse
            {
                Customers = _mapper.Map<List<CustomerDetail>>(customers)
            };
        }

        // ── GetCustomerByUserId ───────────────────────────────────────────────

        public async Task<GetCustomerByUserIdResponse> GetCustomerByUserIdAsync(string userId)
        {
            _logger.LogInformation("=== CustomerService.GetCustomerByUserIdAsync ===");

            var customer = await _customerRepository.GetByUserIdAsync(userId);
            if (customer == null)
                throw new KeyNotFoundException($"No customer found for UserId '{userId}'.");

            var profilePictureUrl = string.IsNullOrEmpty(customer.ProfilePicturePath)
                ? null
                : $"{_fileStorageSettings.BaseUrl}/{customer.ProfilePicturePath}";

            return new GetCustomerByUserIdResponse
            {
                CustomerId        = customer.CustomerId,
                Name              = customer.Name,
                IcNumber          = customer.IcNumber,
                Contact           = customer.Contact,
                Email             = customer.Email,
                Region            = customer.Region,
                UserId            = customer.UserId,
                ProfilePictureUrl = profilePictureUrl,
                Address           = customer.Address == null ? null : new AddressDto
                {
                    AddressLine1 = customer.Address.AddressLine1,
                    AddressLine2 = customer.Address.AddressLine2,
                    City         = customer.Address.City,
                    Postcode     = customer.Address.Postcode,
                    State        = customer.Address.State
                }
            };
        }

        // ── UpdateCustomer ────────────────────────────────────────────────────

        public async Task<UpdateCustomerResponse> UpdateCustomerAsync(UpdateCustomerCommand request)
        {
            _logger.LogInformation("=== CustomerService.UpdateCustomerAsync ===");

            var customer = await _customerRepository.GetByUserIdAsync(request.CustomerId);
            if (customer == null)
                throw new KeyNotFoundException($"Customer '{request.CustomerId}' not found.");

            customer.Name     = request.Request.Name;
            customer.IcNumber = request.Request.IcNumber;
            customer.Contact  = request.Request.Contact;

            // Update or create address
            if (request.Request.Address != null)
            {
                if (customer.Address != null)
                {
                    customer.Address.AddressLine1 = request.Request.Address.AddressLine1;
                    customer.Address.AddressLine2 = request.Request.Address.AddressLine2;
                    customer.Address.City         = request.Request.Address.City;
                    customer.Address.Postcode     = request.Request.Address.Postcode;
                    customer.Address.State        = request.Request.Address.State;
                    customer.Address.UpdatedAt    = DateTime.UtcNow;
                }
                else
                {
                    customer.Address = new AddressEntity
                    {
                        Id           = Guid.NewGuid().ToString(),
                        AddressLine1 = request.Request.Address.AddressLine1,
                        AddressLine2 = request.Request.Address.AddressLine2,
                        City         = request.Request.Address.City,
                        Postcode     = request.Request.Address.Postcode,
                        State        = request.Request.Address.State
                    };
                }
            }

            _customerRepository.Update(customer);
            await _customerRepository.SaveChangesAsync();

            return new UpdateCustomerResponse
            {
                CustomerId = customer.CustomerId,
                Name       = customer.Name,
                IcNumber   = customer.IcNumber,
                Contact    = customer.Contact,
                Address    = customer.Address == null ? null : new AddressDto
                {
                    AddressLine1 = customer.Address.AddressLine1,
                    AddressLine2 = customer.Address.AddressLine2,
                    City         = customer.Address.City,
                    Postcode     = customer.Address.Postcode,
                    State        = customer.Address.State
                },
                Message    = "Customer data updated successfully."
            };
        }

        // ── UploadProfilePicture ──────────────────────────────────────────────

        public async Task<UploadProfilePictureResponse> UploadProfilePictureAsync(UploadProfilePictureCommand request)
        {
            _logger.LogInformation("=== CustomerService.UploadProfilePictureAsync ===");

            var customer = await _customerRepository.GetByIdAsync(request.CustomerId);
            if (customer == null)
                throw new KeyNotFoundException($"Customer '{request.CustomerId}' not found.");

            if (request.FileSize > MaxFileSizeBytes)
                throw new InvalidOperationException("File size exceeds the 5MB limit.");

            var extension = Path.GetExtension(request.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
                throw new InvalidOperationException($"File type '{extension}' is not allowed. Allowed: jpg, jpeg, png, gif.");

            if (!string.IsNullOrEmpty(customer.ProfilePicturePath))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), customer.ProfilePicturePath);
                if (File.Exists(oldFilePath))
                    File.Delete(oldFilePath);
            }

            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), _fileStorageSettings.UploadPath);
            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            var fileName     = $"{request.CustomerId}{extension}";
            var fullFilePath = Path.Combine(uploadFolder, fileName);

            using (var fileStream = new FileStream(fullFilePath, FileMode.Create))
            {
                await request.FileStream.CopyToAsync(fileStream);
            }

            var relativePath = Path.Combine(_fileStorageSettings.UploadPath, fileName).Replace("\\", "/");
            customer.ProfilePicturePath = relativePath;

            _customerRepository.Update(customer);
            await _customerRepository.SaveChangesAsync();

            return new UploadProfilePictureResponse
            {
                CustomerId        = customer.CustomerId,
                ProfilePictureUrl = $"{_fileStorageSettings.BaseUrl}/{relativePath}",
                Message           = "Profile picture uploaded successfully."
            };
        }
    }
}
