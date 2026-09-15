$ErrorActionPreference = 'Stop'
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
try {
  $resp = Invoke-WebRequest -Uri "https://portfolio2025-9zi.pages.dev/recruiter?cb=$ts" -UseBasicParsing -TimeoutSec 20
  Write-Output $resp.Content.Substring(0, [Math]::Min(2000, $resp.Content.Length))
} catch {
  $resp = $_.Exception.Response
  if ($resp) {
    $stream = $resp.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $body = $reader.ReadToEnd()
    Write-Output $body.Substring(0, [Math]::Min(3000, $body.Length))
  } else {
    Write-Output "Error: $($_.Exception.Message)"
  }
}
