@echo off
set scope=hmonteirohc-gmailcoms-projects

echo === Setting Dashboard Project Env Variables ===
cd C:\Dev\EcoVolt\apps\dashboard

call npx vercel env add NEXT_PUBLIC_CONVEX_URL production --value "https://knowing-porcupine-52.convex.cloud" --force -y --scope %scope%
call npx vercel env add NEXT_PUBLIC_CONVEX_URL development --value "https://knowing-porcupine-52.convex.cloud" --force -y --scope %scope%

call npx vercel env add NEXT_PUBLIC_CONVEX_SITE_URL production --value "https://knowing-porcupine-52.convex.site" --force -y --scope %scope%
call npx vercel env add NEXT_PUBLIC_CONVEX_SITE_URL development --value "https://knowing-porcupine-52.convex.site" --force -y --scope %scope%

call npx vercel env add CONVEX_DEPLOY_KEY production --value "dev:knowing-porcupine-52|eyJ2MiI6IjNlYmFiNDdiNjQ1NTQ2MTE5YjA3NmI1NWJmYzIxMzI0In0=" --force -y --scope %scope%
call npx vercel env add CONVEX_DEPLOY_KEY development --value "dev:knowing-porcupine-52|eyJ2MiI6IjNlYmFiNDdiNjQ1NTQ2MTE5YjA3NmI1NWJmYzIxMzI0In0=" --force -y --scope %scope%

call npx vercel env add CONVEX_DEPLOY_KEY_ECOVOLT_DASHBOARD production --value "dev:knowing-porcupine-52|eyJ2MiI6IjNlYmFiNDdiNjQ1NTQ2MTE5YjA3NmI1NWJmYzIxMzI0In0=" --force -y --scope %scope%
call npx vercel env add CONVEX_DEPLOY_KEY_ECOVOLT_DASHBOARD development --value "dev:knowing-porcupine-52|eyJ2MiI6IjNlYmFiNDdiNjQ1NTQ2MTE5YjA3NmI1NWJmYzIxMzI0In0=" --force -y --scope %scope%

call npx vercel env add GEMINI_API_KEY production --value "AIzaSyCh0inpsCapMXHIXcdIWhqI5rF0Pxy-M_w" --force -y --scope %scope%
call npx vercel env add GEMINI_API_KEY development --value "AIzaSyCh0inpsCapMXHIXcdIWhqI5rF0Pxy-M_w" --force -y --scope %scope%

call npx vercel env add GOOGLE_AI_STUDIO_API_KEY production --value "AIzaSyCh0inpsCapMXHIXcdIWhqI5rF0Pxy-M_w" --force -y --scope %scope%
call npx vercel env add GOOGLE_AI_STUDIO_API_KEY development --value "AIzaSyCh0inpsCapMXHIXcdIWhqI5rF0Pxy-M_w" --force -y --scope %scope%


echo === Setting Landing Page Project Env Variables ===
cd C:\Dev\EcoVolt\apps\landing-page

call npx vercel env add NEXT_PUBLIC_CONVEX_URL production --value "https://intent-meerkat-859.convex.cloud" --force -y --scope %scope%
call npx vercel env add NEXT_PUBLIC_CONVEX_URL development --value "https://intent-meerkat-859.convex.cloud" --force -y --scope %scope%

call npx vercel env add CONVEX_URL production --value "https://intent-meerkat-859.convex.cloud" --force -y --scope %scope%
call npx vercel env add CONVEX_URL development --value "https://intent-meerkat-859.convex.cloud" --force -y --scope %scope%

call npx vercel env add NEXT_PUBLIC_CONVEX_SITE_URL production --value "https://intent-meerkat-859.convex.site" --force -y --scope %scope%
call npx vercel env add NEXT_PUBLIC_CONVEX_SITE_URL development --value "https://intent-meerkat-859.convex.site" --force -y --scope %scope%

call npx vercel env add CONVEX_DEPLOY_KEY production --value "dev:intent-meerkat-859|eyJ2MiI6IjMyOWU5NzdjMzhmZDRjZjY5MGFhOGY2NjkxMjdkZGUwIn0=" --force -y --scope %scope%
call npx vercel env add CONVEX_DEPLOY_KEY development --value "dev:intent-meerkat-859|eyJ2MiI6IjMyOWU5NzdjMzhmZDRjZjY5MGFhOGY2NjkxMjdkZGUwIn0=" --force -y --scope %scope%

call npx vercel env add CONVEX_DEPLOY_KEY_ECOVOLT_LEAND-PEAGE production --value "dev:intent-meerkat-859|eyJ2MiI6IjMyOWU5NzdjMzhmZDRjZjY5MGFhOGY2NjkxMjdkZGUwIn0=" --force -y --scope %scope%
call npx vercel env add CONVEX_DEPLOY_KEY_ECOVOLT_LEAND-PEAGE development --value "dev:intent-meerkat-859|eyJ2MiI6IjMyOWU5NzdjMzhmZDRjZjY5MGFhOGY2NjkxMjdkZGUwIn0=" --force -y --scope %scope%

echo === Finished setting environment variables! ===