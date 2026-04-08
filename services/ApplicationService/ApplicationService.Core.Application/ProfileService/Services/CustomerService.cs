using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using ApplicationService.Core.Application.ProfileService.Features.Customer.Command;
using ApplicationService.Core.Application.ProfileService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProfileService.Interfaces.Services;
using ApplicationService.Core.Application.ProfileService.Settings;
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

        public async Task<CustomerGetAllResponse> GetAllCustomerAsync()
        {
            _logger.LogInformation("=== CustomerService.GetAllCustomerAsync ===");

            var customers = await _customerRepository.GetAllAsync();

            return new CustomerGetAllResponse
            {
                Customers = _mapper.Map<List<CustomerDetail>>(customers)
            };
        }

        public async Task<GetCustomerByUserIdResponse> GetCustomerByUserIdAsync(string userId)
        {
            _logger.LogInformation("=== CustomerService.GetCustomerByIdAsync ===");

            var customer = await _customerRepository.FindAsync(c => c.UserId == userId);
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
                Address           = customer.Address,
                Contact           = customer.Contact,
                Email             = customer.Email,
                Region            = customer.Region,
                UserId            = customer.UserId,
                ProfilePictureUrl = profilePictureUrl
            };
        }

        public async Task<UpdateCustomerResponse> UpdateCustomerAsync(UpdateCustomerCommand request)
        {
            _logger.LogInformation("=== CustomerService.UpdateCustomerAsync ===");

            var customer = await _customerRepository.GetByIdAsync(request.CustomerId);
            if (customer == null)
                throw new KeyNotFoundException($"Customer '{request.CustomerId}' not found.");

            customer.Name     = request.Request.Name;
            customer.IcNumber = request.Request.IcNumber;
            customer.Address  = request.Request.Address;
            customer.Contact  = request.Request.Contact;

            _customerRepository.Update(customer);
            await _customerRepository.SaveChangesAsync();

            return new UpdateCustomerResponse
            {
                CustomerId = customer.CustomerId,
                Name       = customer.Name,
                IcNumber   = customer.IcNumber,
                Address    = customer.Address,
                Contact    = customer.Contact,
                Message    = "Customer data updated successfully."
            };
        }

        // ── UploadProfilePicture ──────────────────────────────────────────────

        public async Task<UploadProfilePictureResponse> UploadProfilePictureAsync(UploadProfilePictureCommand request)
        {
            _logger.LogInformation("=== CustomerService.UploadProfilePictureAsync ===");

            // Validate customer exists
            var customer = await _customerRepository.GetByIdAsync(request.CustomerId);
            if (customer == null)
                throw new KeyNotFoundException($"Customer '{request.CustomerId}' not found.");

            // Validate file size
            if (request.FileSize > MaxFileSizeBytes)
                throw new InvalidOperationException("File size exceeds the 5MB limit.");

            // Validate file extension
            var extension = Path.GetExtension(request.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
                throw new InvalidOperationException($"File type '{extension}' is not allowed. Allowed: jpg, jpeg, png, gif.");

            // Delete old profile picture if exists
            if (!string.IsNullOrEmpty(customer.ProfilePicturePath))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), customer.ProfilePicturePath);
                if (File.Exists(oldFilePath))
                    File.Delete(oldFilePath);
            }

            // Ensure upload directory exists
            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), _fileStorageSettings.UploadPath);
            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            // Save file as {customerId}{extension}
            var fileName     = $"{request.CustomerId}{extension}";
            var fullFilePath = Path.Combine(uploadFolder, fileName);

            using (var fileStream = new FileStream(fullFilePath, FileMode.Create))
            {
                await request.FileStream.CopyToAsync(fileStream);
            }

            // Store relative path in DB
            var relativePath = Path.Combine(_fileStorageSettings.UploadPath, fileName).Replace("\\", "/");
            customer.ProfilePicturePath = relativePath;

            _customerRepository.Update(customer);
            await _customerRepository.SaveChangesAsync();

            // Build public URL
            var profilePictureUrl = $"{_fileStorageSettings.BaseUrl}/{relativePath}";

            return new UploadProfilePictureResponse
            {
                CustomerId       = customer.CustomerId,
                ProfilePictureUrl = profilePictureUrl,
                Message          = "Profile picture uploaded successfully."
            };
        }
    }
}
