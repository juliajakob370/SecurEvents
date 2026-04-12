Write-Host "Starting SecureEvents backend services..."

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; dotnet run --project ApiGateway/ApiGateway.csproj"
Start-Sleep -Seconds 1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; dotnet run --project UserManagementService/UserManagementService.csproj"
Start-Sleep -Seconds 1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; dotnet run --project EventManagementService/EventManagementService.csproj"
Start-Sleep -Seconds 1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; dotnet run --project LoggingService/LoggingService.csproj"

Write-Host "Started:"
Write-Host "- ApiGateway: http://localhost:5000"
Write-Host "- UserManagementService: http://localhost:5001"
Write-Host "- EventManagementService: http://localhost:5002"
Write-Host "- LoggingService: http://localhost:5003"
Write-Host ""
Write-Host "Health checks:"
Write-Host "http://localhost:5000/health"
Write-Host "http://localhost:5001/health"
Write-Host "http://localhost:5002/health"
Write-Host "http://localhost:5003/health"