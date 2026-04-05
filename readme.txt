

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
