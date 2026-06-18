param(
    [switch]$SkipInstall,
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$frontendDir = Join-Path $repoRoot "frontend"
$mavenWrapper = Join-Path $repoRoot "mvnw.cmd"

function Invoke-BuildStep {
    param(
        [string]$Message,
        [scriptblock]$Command
    )

    Write-Host ""
    Write-Host "==> $Message"
    & $Command
}

function Invoke-NativeCommand {
    param(
        [string]$FilePath,
        [string[]]$Arguments
    )

    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $FilePath $($Arguments -join ' ')"
    }
}

if (-not (Test-Path $frontendDir)) {
    throw "Frontend directory not found: $frontendDir"
}

if (-not (Test-Path $mavenWrapper)) {
    throw "Maven wrapper not found: $mavenWrapper"
}

Invoke-BuildStep "Building React frontend into Spring static resources" {
    Push-Location $frontendDir
    try {
        if (-not $SkipInstall) {
            if (Test-Path "package-lock.json") {
                Invoke-NativeCommand "npm.cmd" @("ci")
            } else {
                Invoke-NativeCommand "npm.cmd" @("install")
            }
        }

        Invoke-NativeCommand "npm.cmd" @("run", "build")
    } finally {
        Pop-Location
    }
}

Invoke-BuildStep "Packaging Spring Boot application" {
    $mavenArgs = @("clean", "package")
    if ($SkipTests) {
        $mavenArgs += "-DskipTests"
    }

    Invoke-NativeCommand $mavenWrapper $mavenArgs
}

$jar = Get-ChildItem -Path (Join-Path $repoRoot "target") -Filter "*.jar" |
    Where-Object { $_.Name -notlike "*.original" } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if (-not $jar) {
    throw "Build finished, but no jar was found in target."
}

Write-Host ""
Write-Host "Build finished successfully."
Write-Host "Jar: $($jar.FullName)"
Write-Host "Run: java -jar `"$($jar.FullName)`""
