using Microsoft.AspNetCore.Mvc;
using ApplicationService.Core.Application.Interfaces;
using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _repository;
        private readonly IQuotationServiceClient _quotationClient;

        public CustomerController(
            ICustomerRepository repository,
            IQuotationServiceClient quotationClient)
        {
            _repository = repository;
            _quotationClient = quotationClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var applications = await _repository.GetAllAsync();
            return Ok(applications);
        }

        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetById(Guid id)
        //{
        //    var application = await _repository.GetByIdAsync(id);
        //    if (application == null) return NotFound();
        //    return Ok(application);
        //}

        //[HttpPost]
        //public async Task<IActionResult> Create([FromBody] ApplicationEntity application)
        //{
        //    await _repository.AddAsync(application);
        //    await _repository.SaveChangesAsync();
        //    return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
        //}
    }
}