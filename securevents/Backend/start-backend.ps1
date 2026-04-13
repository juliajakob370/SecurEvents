Write-Host "Starting SecureEvents backend services..."
Write-Host ""

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Drop the old database so every launch starts completely fresh.
Write-Host "Dropping old SecureEvent database (if any)..."
try {
    SqlLocalDB.exe stop MSSQLLocalDB 2>$null
    SqlLocalDB.exe start MSSQLLocalDB 2>$null
    $dropQuery = "IF DB_ID('SecureEvent') IS NOT NULL BEGIN ALTER DATABASE [SecureEvent] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [SecureEvent]; END"
    Invoke-Sqlcmd -ServerInstance "(localdb)\MSSQLLocalDB" -Query $dropQuery -ErrorAction SilentlyContinue
    Write-Host "Old database dropped."
} catch {
    Write-Host "No existing database to drop (or SqlLocalDB not ready). Continuing..."
}

Write-Host ""

# Start the API Gateway first (it doesn't touch the database).
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; dotnet run --project ApiGateway/ApiGateway.csproj"
Write-Host "Started ApiGateway on http://localhost:5000"
Start-Sleep -Seconds 2

# Start UserManagementService first — it creates the database.
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; dotnet run --project UserManagementService/UserManagementService.csproj"
Write-Host "Started UserManagementService on http://localhost:5001"
Start-Sleep -Seconds 4

# Start EventManagementService — database should exist by now, just adds its tables.
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; dotnet run --project EventManagementService/EventManagementService.csproj"
Write-Host "Started EventManagementService on http://localhost:5002"
Start-Sleep -Seconds 4

# Start LoggingService last — database and other tables already created.
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; dotnet run --project LoggingService/LoggingService.csproj"
Write-Host "Started LoggingService on http://localhost:5003"

Write-Host ""
Write-Host "All services started (fresh database)."
Write-Host ""
Write-Host "Health checks:"
Write-Host "  http://localhost:5000/health"
Write-Host "  http://localhost:5001/health"
Write-Host "  http://localhost:5002/health"
Write-Host "  http://localhost:5003/health"