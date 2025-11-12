# Stage 1: Build the Blazor WebAssembly application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
EXPOSE 80

# Copy the project file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the entire source code and publish the application
COPY . .
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Serve the published application with Nginx
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html

# Remove default Nginx configuration (optional, if you have custom config)
# RUN rm /etc/nginx/conf.d/default.conf

# Copy the published Blazor WASM output from the build stage
COPY --from=build /app/publish/wwwroot .

# Copy custom Nginx configuration (if needed)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]