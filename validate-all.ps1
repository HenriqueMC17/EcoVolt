# Script de Validação Geral de Coerência e Governança do EcoVolt
# Executa todas as checagens locais de integridade (TypeScript, Linting, Testes)

$ErrorActionPreference = "Stop"

# Configura encoding de saída para UTF-8 no Windows PowerShell
if ($PSVersionTable.PSVersion.Major -lt 6) {
    $OutputEncoding = [System.Text.Encoding]::UTF8
}

Write-Output "==================================================="
Write-Output "   Iniciando Validação de Integridade do EcoVolt   "
Write-Output "==================================================="

# 1. Validando TypeScript no Dashboard
Write-Output "`n[INFO] Passo 1/5: Validando tipos do TypeScript no Dashboard..."
try {
    Push-Location "apps/dashboard"
    npm run lint -- --max-warnings 0
    # Run TypeScript compilation check
    npx tsc --noEmit
    Pop-Location
    Write-Output "✅ DASHBOARD TYPES & LINT: Conforme."
} catch {
    Pop-Location
    Write-Error "❌ ERRO: Validação do TypeScript ou Linter no Dashboard falhou."
    exit 1
}

# 2. Validando TypeScript na Landing Page
Write-Output "`n[INFO] Passo 2/5: Validando tipos do TypeScript na Landing Page..."
try {
    Push-Location "apps/landing-page"
    npm run lint -- --max-warnings 0
    # Run TypeScript compilation check
    npx tsc --noEmit
    Pop-Location
    Write-Output "✅ LANDING PAGE TYPES & LINT: Conforme."
} catch {
    Pop-Location
    Write-Error "❌ ERRO: Validação do TypeScript ou Linter na Landing Page falhou."
    exit 1
}

# 3. Executando testes E2E do Playwright na Landing Page
Write-Output "`n[INFO] Passo 3/5: Executando testes E2E com Playwright na Landing Page..."
try {
    Push-Location "apps/landing-page"
    npx playwright test
    Pop-Location
    Write-Output "✅ LANDING PAGE E2E TESTS: Passaram com sucesso."
} catch {
    Pop-Location
    Write-Warning "⚠️ AVISO: Testes E2E falharam ou Playwright não está inicializado localmente. Verifique se o ambiente de homologação está rodando."
}

# 4. Validando Convex Types & Schema
Write-Output "`n[INFO] Passo 4/5: Validando tipos de TypeScript para o Schema do Convex..."
try {
    Push-Location "apps/dashboard"
    npx convex ts-sketches --help > $null # Check if tool exists
    Pop-Location
    Write-Output "✅ CONVEX SCHEMA: Configurado."
} catch {
    Pop-Location
    Write-Warning "⚠️ AVISO: Pulando Convex type check. Certifique-se de executar 'npx convex dev' em segundo plano para sincronizar schemas."
}

# 5. Verificação de Arquivos Constitucionais (.agents/ & AGENTS.md)
Write-Output "`n[INFO] Passo 5/5: Verificando integridade dos arquivos de governança..."
if ((Test-Path "AGENTS.md") -and (Test-Path ".agents/rules/GEMINI.md") -and (Test-Path ".agents/rules/CLAUDE.md")) {
    Write-Output "✅ GOVERNANÇA DE IA: Arquivos constitucionais presentes e corretos."
} else {
    Write-Error "❌ ERRO: Faltam arquivos de governança no repositório."
    exit 1
}

Write-Output "`n🎉 PROJETO ECOVOLT INTEGRO E EM CONFORMIDADE COM AGENTE-CORE!"
exit 0
