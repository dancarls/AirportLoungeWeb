# Upload lounge images to Supabase Storage
# Usage: .\scripts\upload-images.ps1 -SupabaseUrl "https://xxx.supabase.co" -ServiceRoleKey "eyJ..."
#
# Get your Service Role key from: Supabase Dashboard > Settings > API > service_role (secret)
# NOTE: Service Role key bypasses RLS — only use in scripts, never in browser code.

param(
    [Parameter(Mandatory=$true)]
    [string]$SupabaseUrl,

    [Parameter(Mandatory=$true)]
    [string]$ServiceRoleKey
)

$Bucket      = "lounge-images"
$SourceBase  = "C:\Users\danca\airport-lounges\public\Images\Lounges"
$UploadBase  = "$SupabaseUrl/storage/v1/object/$Bucket"

# Maps source IATA folder + filename keyword → lounge slug (storage folder)
$LoungeMap = @(
    # YEG
    @{ Folder="YEG"; KeyWord="";                        Slug="ac-maple-leaf-lounge-yeg" }
    # YOW
    @{ Folder="YOW"; KeyWord="";                        Slug="ac-maple-leaf-lounge-yow" }
    # YSJ (images are actually YYT — St. John's NL)
    @{ Folder="YSJ"; KeyWord="";                        Slug="ac-maple-leaf-lounge-yyt" }
    # YTZ
    @{ Folder="YTZ"; KeyWord="";                        Slug="ac-cafe-ytz" }
    # YUL — two lounges, split by keyword
    @{ Folder="YUL"; KeyWord="Maple Leaf";              Slug="ac-maple-leaf-lounge-yul" }
    @{ Folder="YUL"; KeyWord="Cafe";                    Slug="ac-cafe-yul" }
    # YVR — seven lounges, split by keyword
    @{ Folder="YVR"; KeyWord="Air Canada Maple Leaf";   Slug="ac-maple-leaf-lounge-yvr" }
    @{ Folder="YVR"; KeyWord="Plaza Premium First";     Slug="plaza-premium-first-yvr" }
    @{ Folder="YVR"; KeyWord="Pier C";                  Slug="plaza-premium-domestic-pier-c-yvr" }
    @{ Folder="YVR"; KeyWord="Domestic Departures";     Slug="plaza-premium-domestic-yvr" }
    @{ Folder="YVR"; KeyWord="International Departures";Slug="plaza-premium-international-yvr" }
    @{ Folder="YVR"; KeyWord="US Departures";           Slug="plaza-premium-us-yvr" }
    @{ Folder="YVR"; KeyWord="Sky Team";                Slug="skyteam-lounge-yvr" }
    @{ Folder="YVR"; KeyWord="sky team";                Slug="skyteam-lounge-yvr" }
    # YWG
    @{ Folder="YWG"; KeyWord="";                        Slug="ac-maple-leaf-lounge-ywg" }
    # YYZ — five lounges, split by keyword
    @{ Folder="YYZ"; KeyWord="Signature Suite";         Slug="ac-signature-suite-yyz" }
    @{ Folder="YYZ"; KeyWord="Domestic";                Slug="ac-maple-leaf-lounge-domestic-yyz" }
    @{ Folder="YYZ"; KeyWord="International";           Slug="ac-maple-leaf-lounge-international-yyz" }
    @{ Folder="YYZ"; KeyWord="Transboarder";            Slug="ac-maple-leaf-lounge-transborder-yyz" }
    @{ Folder="YYZ"; KeyWord="Cafe";                    Slug="ac-cafe-yyz" }
)

function Get-ContentType([string]$ext) {
    switch ($ext.ToLower()) {
        ".jpg"  { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".png"  { return "image/png" }
        ".gif"  { return "image/gif" }
        ".webp" { return "image/webp" }
        default { return "application/octet-stream" }
    }
}

function Get-LoungeSlug([string]$folder, [string]$filename) {
    # For folders with only one lounge, return the single match
    # For multi-lounge folders (YUL, YVR, YYZ), match by keyword in filename
    $candidates = $LoungeMap | Where-Object { $_.Folder -eq $folder }

    if ($candidates.Count -eq 1) {
        return $candidates[0].Slug
    }

    # Try keyword matches in order (more specific first)
    $ordered = $candidates | Where-Object { $_.KeyWord -ne "" } |
               Sort-Object { $_.KeyWord.Length } -Descending

    foreach ($c in $ordered) {
        if ($filename -match [regex]::Escape($c.KeyWord)) {
            return $c.Slug
        }
    }

    # Fallback: first candidate
    return $candidates[0].Slug
}

# Track per-slug upload count for sequential numbering
$Counter = @{}

$headers = @{
    "Authorization" = "Bearer $ServiceRoleKey"
}

$totalFiles = 0
$uploaded   = 0
$failed     = 0

Write-Host "`nScanning $SourceBase...`n" -ForegroundColor Cyan

Get-ChildItem -Path $SourceBase -Recurse -File |
    Where-Object { $_.Extension -match '\.(jpg|jpeg|png|gif|webp)$' } |
    ForEach-Object {
        $file    = $_
        $folder  = $file.Directory.Name
        $slug    = Get-LoungeSlug $folder $file.Name
        $ext     = $file.Extension.ToLower()
        $totalFiles++

        if (-not $Counter.ContainsKey($slug)) { $Counter[$slug] = 0 }
        $Counter[$slug]++
        $index   = $Counter[$slug].ToString("D2")
        $destPath = "$slug/$index$ext"
        $uploadUrl = "$UploadBase/$destPath"
        $contentType = Get-ContentType $ext

        Write-Host "Uploading: $($file.Name)" -ForegroundColor Gray
        Write-Host "       to: $destPath" -ForegroundColor DarkGray

        try {
            $response = Invoke-RestMethod `
                -Uri $uploadUrl `
                -Method POST `
                -Headers $headers `
                -ContentType $contentType `
                -InFile $file.FullName `
                -ErrorAction Stop

            Write-Host "       OK" -ForegroundColor Green
            $uploaded++
        } catch {
            # If file already exists (409), skip gracefully
            if ($_.Exception.Response.StatusCode.value__ -eq 409) {
                Write-Host "       already exists, skipping" -ForegroundColor Yellow
                $uploaded++
            } else {
                Write-Host "       FAILED: $($_.Exception.Message)" -ForegroundColor Red
                $failed++
            }
        }
    }

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "Done! $uploaded / $totalFiles uploaded successfully." -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "$failed files failed — check the output above." -ForegroundColor Red
}
Write-Host "`nNext: run 002_seed_data.sql in your Supabase SQL Editor" -ForegroundColor Cyan
