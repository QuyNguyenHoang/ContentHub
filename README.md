# ContentHub 

This project is a RESTful API built with ASP.NET Core.
It provides authentication, category management, and content management features.

---

## Architecture

The project follows a layered architecture.

Client
→ Controllers (API Layer)
→ Application Services
→ Repository Layer (Domain)
→ Infrastructure

Or Clean Architecture:

API
→ Application
→ Domain
→ Infrastructure

---

## Tech Stack

* ASP.NET Core Web API
* Entity Framework Core
* PostgreSQL / SQL Server
* Redis (optional)
* JWT Authentication
* Docker (optional)
* Deploy with Railway/Vercel

---

## Features

* User authentication with JWT
* Role-based authorization
* CRUD APIs
* Pagination and filtering
* Global exception handling
* Input validation
* Logging

---

## Project Structure

```


---

## Prerequisites

Install the following tools before running the project.

* .NET SDK 8+
* PostgreSQL or SQL Server
* Visual Studio / VS Code
* Docker (optional)

---

## Environment Variables

Configure environment variables in `appsettings.json` or 'appsetting.product.json'

Example configuration:

```
ConnectionStrings:DefaultConnection=

Jwt:Key=

Jwt:Issuer=

Jwt:Audience=
```

---

## Database Setup

Add-Migration  [name]
Update-Database [name]

---

## Running the Application

Clone the repository.

```
git clone https://github.com/QuyNguyenHoang/ContentHub.git
```

Navigate to the project directory.

```
cd ContentHub.Api
```

Run the application.

```
dotnet run
```

The API will run at:

```
https://localhost:7202
```

---

## API Documentation

Swagger UI is available at:

```
https://localhost:5001/swagger
```

API 

```
*Authenticated*

##Login

POST /api/admin/auth/login

Request

```json
{
  "userName": "string",
  "password": "string"
}
```
Response
```
{
  "token": "string",
  "refreshToken": "string"
}
```
##Register

POST /api/admin/auth/register

request

```
{
  "firstName": "string",
  "lastName": "string",
  "email": "user@example.com",
  "userName": "string",
  "password": "string",
  "confirmPassword": "string",
  "dob": "2026-03-06T16:18:20.793Z"
}
```

Role

GET /api/role/{id}

response

```
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "displayName": "string"
}
```

PUT /api/role/{id}

request

```
{
  "name": "string",
  "displayName": "string"
}
```
DELETE /api/role/{id}


GET /api/role/paging 

reponse

```
{
  "currentPage": 0,
  "pageCount": 0,
  "pageSize": 0,
  "rowCount": 0,
  "firstRowOnPage": 0,
  "lastRowOnPage": 0,
  "additionalData": "string",
  "results": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "displayName": "string"
    }
  ]
}
```
GET /api/role/all
GET /api/roles/{roleId}/permissions

response
```
{
  "roleId": "string",
  "roleClaims": [
    {
      "type": "string",
      "value": "string",
      "displayName": "string",
      "selected": true
    }
  ]
}
```

PUT /api/roles/permissions

request
``` 
{
  "roleId": "string",
  "roleClaims": [
    {
      "type": "string",
      "value": "string",
      "displayName": "string",
      "selected": true
    }
  ]
}
```
### USER MANAGER

GET /api/users/all

request
```
{
  "currentPage": 0,
  "pageCount": 0,
  "pageSize": 0,
  "rowCount": 0,
  "firstRowOnPage": 0,
  "lastRowOnPage": 0,
  "additionalData": "string",
  "results": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "firstName": "string",
      "lastName": "string",
      "fullName": "string",
      "isActive": true,
      "dateCreated": "2026-03-06T16:26:24.955Z",
      "dob": "2026-03-06T16:26:24.955Z",
      "avatar": "string",
      "lastLoginDate": "2026-03-06T16:26:24.955Z",
      "userName": "string",
      "email": "string",
      "emailConfirmed": true
    }
  ]
}
```

GET /api/users/{id}

response
```
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "firstName": "string",
  "lastName": "string",
  "fullName": "string",
  "isActive": true,
  "dateCreated": "2026-03-06T16:27:25.427Z",
  "dob": "2026-03-06T16:27:25.427Z",
  "avatar": "string",
  "lastLoginDate": "2026-03-06T16:27:25.427Z",
  "userName": "string",
  "email": "string",
  "emailConfirmed": true
}
```
PUT /api/users/{id}
request
```
{
  "firstName": "string",
  "lastName": "string",
  "dob": "2026-03-06T16:28:40.097Z",
  "avatar": "string"
}
```

### Categories

POST /api/categories/create

response
```
{
  "name": "string",
  "slug": "string",
  "parentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "isActive": true,
  "sortOrder": 0
}
```
PUT /api/categories/update/{id}

request
```
{
  "name": "string",
  "slug": "string",
  "parentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "isActive": true,
  "sortOrder": 0
}
```
DELETE /api/categories/delete/{id}
GET /api/categories

response
```
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "slug": "string",
  "parentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "isActive": true,
  "dateCreated": "2026-03-06T16:31:53.703Z",
  "dateModified": "2026-03-06T16:31:53.703Z",
  "sortOrder": 0
}
```
GET /api/categories/list

response 
```
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "slug": "string",
    "children": [
      "string"
    ]
  }
]
```
GET /api/categories/all

response
```
{
  "currentPage": 0,
  "pageCount": 0,
  "pageSize": 0,
  "rowCount": 0,
  "firstRowOnPage": 0,
  "lastRowOnPage": 0,
  "additionalData": "string",
  "results": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "slug": "string",
      "parentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "isActive": true,
      "dateCreated": "2026-03-06T16:33:29.697Z",
      "dateModified": "2026-03-06T16:33:29.697Z",
      "sortOrder": 0
    }
  ]
}
```
---

## Testing

Run unit tests.

```
dotnet test
```

---

## Docker

Build Docker image.

```
docker build -t project-api .
```

Run container.

```
docker run -p 5000:5000 project-api
```

---

## Deployment

Example deployment stack:

* Linux Server
* Nginx
* Docker
* PostgreSQL

Publish the project.

```
dotnet publish -c Release
```

Run the published application.

```
dotnet Project.Api.dll
```

---

## Security

* JWT authentication
* Input validation
* HTTPS enforcement
* Rate limiting (optional)

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## License

MIT License
