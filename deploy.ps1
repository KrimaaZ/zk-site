param([string]$msg = "Update site")

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Set-Location $PSScriptRoot

git add -A

$status = git status --porcelain
if (-not $status) {
  Write-Host "Nothing to deploy - no changes detected." -ForegroundColor Yellow
  exit 0
}

git commit -m $msg
git push

Write-Host ""
Write-Host "Deployed! Vercel is building now." -ForegroundColor Green
Write-Host "https://github.com/KrimaaZ/zk-site" -ForegroundColor Cyan
