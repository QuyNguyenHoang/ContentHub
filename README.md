# ContentHub

ContentHub is a scalable RESTful API built with ASP.NET Core for content management.
The project demonstrates Clean Architecture, JWT authentication, and role-based access control in a real-world backend system.

---

## Architecture

The project follows Clean Architecture:

```
API → Application → Domain → Infrastructure
```

This structure ensures separation of concerns, maintainability, and scalability.

---

## Tech Stack

* ASP.NET Core Web API (.NET 8)
* Entity Framework Core
* PostgreSQL / SQL Server
* Redis (optional)
* JWT Authentication
* Docker (optional)

---

## Key Highlights

* Designed using Clean Architecture for maintainability and scalability
* Implemented JWT authentication with refresh token
* Built role-based authorization system
* Applied pagination and filtering for large datasets
* Centralized exception handling and logging

---

## Features

* JWT authentication
* Role-based authorization
* CRUD APIs
* Pagination and filtering
* Input validation
* Logging

---

## Project Structure

```
src/
 ├── ContentHub.Api
 ├── ContentHub.Application
 ├── ContentHub.Domain
 └── ContentHub.Infrastructure
```

---

## Prerequisites

* .NET SDK 8+
* PostgreSQL or SQL Server
* Visual Studio or VS Code
* Docker (optional)

---

## Configuration

Configure environment variables in:

```
appsettings.json
```

or

```
appsettings.Production.json
```

Example:

```
ConnectionStrings:DefaultConnection=

Jwt:Key=
Jwt:Issuer=
Jwt:Audience=
```

For production, use environment variables or secret management instead of hardcoding sensitive data.

---

## Database Setup

Run migrations:

```
Add-Migration InitialCreate
Update-Database
```

---

## Running the Application

Clone the repository:

```
git clone https://github.com/QuyNguyenHoang/ContentHub.git
```

Navigate to the project:

```
cd ContentHub.Api
```

Run the application:

```
dotnet run
```

The API will be available at:

```
https://localhost:7202
```

---

## API Documentation

Swagger UI:

```
https://localhost:5001/swagger
```

Full API details are available via Swagger.

---

## Testing

Run unit tests:

```
dotnet test
```

---

## Docker

Build image:

```
docker build -t contenthub-api .
```

Run container:

```
docker run -p 5000:80 contenthub-api
```

---

## Deployment

Example production stack:

* Linux Server
* Nginx
* Docker
* PostgreSQL

Publish:

```
dotnet publish -c Release
```

Run:

```
dotnet ContentHub.Api.dll
```

---

## Security

* JWT authentication
* Input validation
* HTTPS enforcement
* Rate limiting (optional)

Do not commit sensitive information such as JWT keys or connection strings.
Use environment variables or a secure secret management solution in production.

---

## Contributing

Pull requests are welcome. Please open an issue for major changes.

---

## License

MIT License
