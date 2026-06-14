# PowerShell script to set Vercel env variables in parallel

$scope = "hmonteirohc-gmailcoms-projects"

# Dashboard Project Variables
$dashboardVars = @{
    "NEXT_PUBLIC_CONVEX_URL" = "https://knowing-porcupine-52.convex.cloud"
    "NEXT_PUBLIC_CONVEX_SITE_URL" = "https://knowing-porcupine-52.convex.site"
    "CONVEX_DEPLOY_KEY" = "dev:knowing-porcupine-52|eyJ2MiI6IjNlYmFiNDdiNjQ1NTQ2MTE5YjA3NmI1NWJmYzIxMzI0In0="
    "CONVEX_DEPLOY_KEY_ECOVOLT_DASHBOARD" = "dev:knowing-porcupine-52|eyJ2MiI6IjNlYmFiNDdiNjQ1NTQ2MTE5YjA3NmI1NWJmYzIxMzI0In0="
    "GEMINI_API_KEY" = "AIzaSyCh0inpsCapMXHIXcdIWhqI5rF0Pxy-M_w"
    "GOOGLE_AI_STUDIO_API_KEY" = "AIzaSyCh0inpsCapMXHIXcdIWhqI5rF0Pxy-M_w"
}

Write-Host "Starting Dashboard Project Env Variable configuration..."
foreach ($key in $dashboardVars.Keys) {
    $val = $dashboardVars[$key]
    foreach ($env in "production", "development") {
        Write-Host "Starting background process to add $key to $env..."
        Start-Process cmd -ArgumentList "/c npx -y vercel env add $key $env --value `"$val`" --force -y --scope $scope" -WorkingDirectory "C:\Dev\EcoVolt\apps\dashboard" -WindowStyle Hidden
        Start-Sleep -Seconds 1
    }
}

# Landing Page Project Variables
$landingVars = @{
    "NEXT_PUBLIC_CONVEX_URL" = "https://intent-meerkat-859.convex.cloud"
    "CONVEX_URL" = "https://intent-meerkat-859.convex.cloud"
    "NEXT_PUBLIC_CONVEX_SITE_URL" = "https://intent-meerkat-859.convex.site"
    "CONVEX_DEPLOY_KEY" = "dev:intent-meerkat-859|eyJ2MiI6IjMyOWU5NzdjMzhmZDRjZjY5MGFhOGY2NjkxMjdkZGUwIn0="
    "CONVEX_DEPLOY_KEY_ECOVOLT_LEAND-PEAGE" = "dev:intent-meerkat-859|eyJ2MiI6IjMyOWU5NzdjMzhmZDRjZjY5MGFhOGY2NjkxMjdkZGUwIn0="
}

Write-Host "Starting Landing Page Project Env Variable configuration..."
foreach ($key in $landingVars.Keys) {
    $val = $landingVars[$key]
    foreach ($env in "production", "development") {
        Write-Host "Starting background process to add $key to $env..."
        Start-Process cmd -ArgumentList "/c npx -y vercel env add $key $env --value `"$val`" --force -y --scope $scope" -WorkingDirectory "C:\Dev\EcoVolt\apps\landing-page" -WindowStyle Hidden
        Start-Sleep -Seconds 1
    }
}

Write-Host "All background processes started. Waiting 30 seconds for them to complete..."
Start-Sleep -Seconds 30
Write-Host "Done!"