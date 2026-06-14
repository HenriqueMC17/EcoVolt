# PowerShell script to set Vercel env variables

$scope = "hmonteirohc-gmailcoms-projects"

# Dashboard Project
$dashboardVars = @{
    "NEXT_PUBLIC_CONVEX_URL" = "https://knowing-porcupine-52.convex.cloud"
    "NEXT_PUBLIC_CONVEX_SITE_URL" = "https://knowing-porcupine-52.convex.site"
    "CONVEX_DEPLOY_KEY" = "dev:knowing-porcupine-52|eyJ2MiI6IjNlYmFiNDdiNjQ1NTQ2MTE5YjA3NmI1NWJmYzIxMzI0In0="
    "CONVEX_DEPLOY_KEY_ECOVOLT_DASHBOARD" = "dev:knowing-porcupine-52|eyJ2MiI6IjNlYmFiNDdiNjQ1NTQ2MTE5YjA3NmI1NWJmYzIxMzI0In0="
    "GEMINI_API_KEY" = "AIzaSyCh0inpsCapMXHIXcdIWhqI5rF0Pxy-M_w"
    "GOOGLE_AI_STUDIO_API_KEY" = "AIzaSyCh0inpsCapMXHIXcdIWhqI5rF0Pxy-M_w"
}

Write-Host "Setting Dashboard Project Env Variables..."
cd C:\Dev\EcoVolt\apps\dashboard
foreach ($key in $dashboardVars.Keys) {
    $val = $dashboardVars[$key]
    foreach ($env in "production", "preview", "development") {
        Write-Host "Adding $key to $env..."
        npx vercel env add $key $env --value "$val" --force -y --scope $scope
    }
}

# Landing Page Project
$landingVars = @{
    "NEXT_PUBLIC_CONVEX_URL" = "https://intent-meerkat-859.convex.cloud"
    "CONVEX_URL" = "https://intent-meerkat-859.convex.cloud"
    "NEXT_PUBLIC_CONVEX_SITE_URL" = "https://intent-meerkat-859.convex.site"
    "CONVEX_DEPLOY_KEY" = "dev:intent-meerkat-859|eyJ2MiI6IjMyOWU5NzdjMzhmZDRjZjY5MGFhOGY2NjkxMjdkZGUwIn0="
    "CONVEX_DEPLOY_KEY_ECOVOLT_LEAND-PEAGE" = "dev:intent-meerkat-859|eyJ2MiI6IjMyOWU5NzdjMzhmZDRjZjY5MGFhOGY2NjkxMjdkZGUwIn0="
}

Write-Host "`nSetting Landing Page Project Env Variables..."
cd C:\Dev\EcoVolt\apps\landing-page
foreach ($key in $landingVars.Keys) {
    $val = $landingVars[$key]
    foreach ($env in "production", "preview", "development") {
        Write-Host "Adding $key to $env..."
        npx vercel env add $key $env --value "$val" --force -y --scope $scope
    }
}

Write-Host "`nFinished setting environment variables!"