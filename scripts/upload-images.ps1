param(
    [Parameter(Mandatory=$true)][string]$SupabaseUrl,
    [Parameter(Mandatory=$true)][string]$ServiceRoleKey
)

$Bucket     = "lounge-images"
$SourceBase = "C:\Users\danca\airport-lounges\public\Images\Lounges"
$UploadBase = "$SupabaseUrl/storage/v1/object/$Bucket"

function Get-Slug([string]$folder, [string]$name) {
    if ($folder -eq "YEG") { return "ac-maple-leaf-lounge-yeg" }
    if ($folder -eq "YOW") { return "ac-maple-leaf-lounge-yow" }
    if ($folder -eq "YSJ") { return "ac-maple-leaf-lounge-yyt" }
    if ($folder -eq "YTZ") { return "ac-cafe-ytz" }
    if ($folder -eq "YWG") { return "ac-maple-leaf-lounge-ywg" }

    if ($folder -eq "YUL") {
        if ($name -match "Maple Leaf") { return "ac-maple-leaf-lounge-yul" }
        return "ac-cafe-yul"
    }

    if ($folder -eq "YVR") {
        if ($name -match "Signature")                { return "ac-signature-suite-yvr" }
        if ($name -match "Air Canada Maple")         { return "ac-maple-leaf-lounge-yvr" }
        if ($name -match "Plaza Premium First")      { return "plaza-premium-first-yvr" }
        if ($name -match "Pier C")                   { return "plaza-premium-domestic-pier-c-yvr" }
        if ($name -match "Domestic Departures")      { return "plaza-premium-domestic-yvr" }
        if ($name -match "International Departures") { return "plaza-premium-international-yvr" }
        if ($name -match "US Departures")            { return "plaza-premium-us-yvr" }
        if ($name -match "Sky.?[Tt]eam")             { return "skyteam-lounge-yvr" }
        return "ac-maple-leaf-lounge-yvr"
    }

    if ($folder -eq "YYZ") {
        if ($name -match "Signature Suite")  { return "ac-signature-suite-yyz" }
        if ($name -match "Domestic")         { return "ac-maple-leaf-lounge-domestic-yyz" }
        if ($name -match "International")    { return "ac-maple-leaf-lounge-international-yyz" }
        if ($name -match "Transboarder")     { return "ac-maple-leaf-lounge-transborder-yyz" }
        if ($name -match "Cafe")             { return "ac-cafe-yyz" }
        return "ac-maple-leaf-lounge-domestic-yyz"
    }

    return $folder.ToLower()
}

function Get-Mime([string]$ext) {
    if ($ext -eq ".jpg" -or $ext -eq ".jpeg") { return "image/jpeg" }
    if ($ext -eq ".png")  { return "image/png" }
    if ($ext -eq ".gif")  { return "image/gif" }
    if ($ext -eq ".webp") { return "image/webp" }
    return "application/octet-stream"
}

$counter  = @{}
$uploaded = 0
$failed   = 0

$headers = @{ "Authorization" = "Bearer $ServiceRoleKey" }

Write-Host ""
Write-Host "Scanning $SourceBase ..." -ForegroundColor Cyan
Write-Host ""

$files = Get-ChildItem -Path $SourceBase -Recurse -File |
         Where-Object { $_.Extension -match "\.(jpg|jpeg|png|gif|webp)$" }

foreach ($file in $files) {
    $folder = $file.Directory.Name
    $slug   = Get-Slug $folder $file.Name
    $ext    = $file.Extension.ToLower()
    $mime   = Get-Mime $ext

    if (-not $counter.ContainsKey($slug)) { $counter[$slug] = 0 }
    $counter[$slug]++
    $index    = $counter[$slug].ToString("D2")
    $destPath = "$slug/$index$ext"
    $url      = "$UploadBase/$destPath"

    Write-Host "$($file.Name)" -ForegroundColor Gray
    Write-Host "  -> $destPath" -ForegroundColor DarkGray

    try {
        Invoke-RestMethod -Uri $url -Method POST -Headers $headers `
            -ContentType $mime -InFile $file.FullName -ErrorAction Stop | Out-Null
        Write-Host "  OK" -ForegroundColor Green
        $uploaded++
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq 409) {
            Write-Host "  Already exists, skipping" -ForegroundColor Yellow
            $uploaded++
        } else {
            Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
            $failed++
        }
    }
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Done: $uploaded uploaded, $failed failed" -ForegroundColor Green
Write-Host ""
Write-Host "Next: paste 002_seed_data.sql into Supabase SQL Editor and run it" -ForegroundColor Cyan
