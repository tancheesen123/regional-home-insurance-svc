using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using ApplicationService.Core.Application.ProfileService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.ProfileService.Features.Customer.Command
{
    public class UploadProfilePictureCommand : IRequest<Response<UploadProfilePictureResponse>>
    {
        public string   CustomerId  { get; set; }
        public Stream   FileStream  { get; set; }
        public string   FileName    { get; set; }
        public string   ContentType { get; set; }
        public long     FileSize    { get; set; }

        public class UploadProfilePictureCommandHandler
            : IRequestHandler<UploadProfilePictureCommand, Response<UploadProfilePictureResponse>>
        {
            private readonly ILogger<UploadProfilePictureCommandHandler> _logger;
            private readonly ICustomerService _customerService;

            public UploadProfilePictureCommandHandler(
                ILogger<UploadProfilePictureCommandHandler> logger,
                ICustomerService customerService)
            {
                _logger = logger;
                _customerService = customerService;
            }

            public async Task<Response<UploadProfilePictureResponse>> Handle(
                UploadProfilePictureCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start UploadProfilePictureCommandHandler ===");

                var result = await _customerService.UploadProfilePictureAsync(request);

                return new Response<UploadProfilePictureResponse>(result);
            }
        }
    }
}
