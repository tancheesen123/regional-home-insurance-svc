

cd UserService.WebAPI
dotnet add package Swashbuckle.AspNetCore --version 6.9.0
dotnet add package Microsoft.OpenApi --version 1.6.22


migration

cd D:\regional-home-insurance-svc\services\ApplicationService

for 3 region db

dotnet ef migrations add Init --context PHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI

dotnet ef migrations add Init --context IDApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI

dotnet ef migrations add Init --context KHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI

db update

dotnet ef database update --context PHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI

dotnet ef database update --context IDApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI

dotnet ef database update --context KHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI


dotnet ef migrations add NewSchema --context KHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI



dotnet ef database update --context KHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI



sql script

USE IDUnityDb;

INSERT INTO UserAccounts (UserId, Email, HashedPassword, IsVerified) VALUES
('USR-ID-001', 'budi.santoso@email.id',  'hashed_password_1', 1),
('USR-ID-002', 'siti.rahayu@email.id',   'hashed_password_2', 1),
('USR-ID-003', 'agus.widodo@email.id',   'hashed_password_3', 0);

INSERT INTO Customers (CustomerId, Name, IcNumber, Address, Contact, Email, Region, UserId) VALUES
('CUST-ID-001', 'Budi Santoso', 'ID-KTP-3201012345', 'Jl. Sudirman No. 10, Jakarta Pusat, DKI Jakarta', '+62 812 1234 5678', 'budi.santoso@email.id', 'ID', 'USR-ID-001'),
('CUST-ID-002', 'Siti Rahayu',  'ID-KTP-3578029876', 'Jl. Raya Darmo No. 55, Surabaya, Jawa Timur',    '+62 813 2345 6789', 'siti.rahayu@email.id',  'ID', 'USR-ID-002'),
('CUST-ID-003', 'Agus Widodo',  'ID-KTP-3471034567', 'Jl. Malioboro No. 88, Yogyakarta, DIY',           '+62 814 3456 7890', 'agus.widodo@email.id',  'ID', 'USR-ID-003');


Step to Add new API
- Create new controller
- create query (inside feature)
- create response (inside DTO)\
- create service
- create service interface
- create repository
-update mapping customerMappingProfile (webAPI -> Extension ->ApplicationServiceExtension)
-update persistenceServiceExtension (webAPI -> Extension ->PersistenceServiceExtension)

//ignore jwt token
Adding [AllowAnonymous] to future public endpoints (e.g., registration):

[AllowAnonymous]
[HttpPost("[action]")]
public async Task<IActionResult> Register(...) { }

dotnet ef migrations add AddProfilePictureToCustomer --context KHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI
dotnet ef database update --context KHApplicationDbContext --project ApplicationService.Infrastructure.Persistence --startup-project ApplicationService.WebAPI


cd D:\regional-home-insurance-svc\services\ApplicationService\ApplicationService.Infrastructure.Persistence

dotnet ef migrations add UpdateCustomerAndAddPaymentMethod --context PHApplicationDbContext --startup-project "..\ApplicationService.WebAPI"
dotnet ef migrations add UpdateCustomerAndAddPaymentMethod --context IDApplicationDbContext --startup-project "..\ApplicationService.WebAPI"
dotnet ef migrations add UpdateCustomerAndAddPaymentMethod --context KHApplicationDbContext --startup-project "..\ApplicationService.WebAPI"

dotnet ef database update --context PHApplicationDbContext --startup-project "..\ApplicationService.WebAPI"
dotnet ef database update --context IDApplicationDbContext --startup-project "..\ApplicationService.WebAPI"
dotnet ef database update --context KHApplicationDbContext --startup-project "..\ApplicationService.WebAPI"


cd D:\regional-home-insurance-svc\services\ApplicationService\ApplicationService.Infrastructure.Persistence

dotnet ef migrations add RemoveProfilePicturePath --context PHApplicationDbContext --startup-project "..\ApplicationService.WebAPI"
dotnet ef migrations add RemoveProfilePicturePath --context IDApplicationDbContext --startup-project "..\ApplicationService.WebAPI"
dotnet ef migrations add RemoveProfilePicturePath --context KHApplicationDbContext --startup-project "..\ApplicationService.WebAPI"

dotnet ef database update --context PHApplicationDbContext --startup-project "..\ApplicationService.WebAPI"
dotnet ef database update --context IDApplicationDbContext --startup-project "..\ApplicationService.WebAPI"
dotnet ef database update --context KHApplicationDbContext --startup-project "..\ApplicationService.WebAPI"

s

