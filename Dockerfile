# ===== BUILD STAGE =====
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy toàn bộ source code
COPY . .

# Publish project
RUN dotnet publish ContentHub.Api/ContentHub.Api.csproj -c Release -o /app/publish

# ===== RUNTIME STAGE =====
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy file đã publish từ build stage
COPY --from=build /app/publish .

# Railway sẽ truyền biến PORT
ENV ASPNETCORE_URLS=http://0.0.0.0:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "ContentHub.Api.dll"]