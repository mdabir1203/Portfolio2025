$ErrorActionPreference = 'Stop'
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$urls = @(
  "https://abir.getwaved.ai/",
  "https://abir.getwaved.ai/work",
  "https://abir.getwaved.ai/recruiter",
  "https://portfolio2025-9zi.pages.dev/",
  "https://portfolio2025-9zi.pages.dev/work",
  "https://portfolio2025-9zi.pages.dev/recruiter"
)
foreach ($u in $urls) {
  Write-Output "==== $u ===="
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 15 -Method Head
    Write-Output ("Status: $($r.StatusCode)")
    Write-Output ("Server: $($r.Headers['Server'])")
    Write-Output ("CF-Ray: $($r.Headers['Cf-Ray'])")
    Write-Output ("Age: $($r.Headers['Age'])")
    Write-Output ("Cache: $($r.Headers['Cache-Control'])")
  } catch {
    Write-Output "Error: $($_.Exception.Message)"
  }
}
