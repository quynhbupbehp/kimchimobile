$ErrorActionPreference = "Stop"
$v = Get-Date -Format "yyyyMMdd_HHmmss"
$htmlPath = Join-Path $PSScriptRoot "index.html"

# Cap nhat index.html
if (Test-Path $htmlPath) {
    $content = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)
    
    # Cap nhat Query Version cho CSS va JS
    $content = [regex]::Replace($content, 'css/style\.css\?v=[^"''\s>]+', "css/style.css?v=$v")
    $content = [regex]::Replace($content, 'js/main\.js\?v=[^"''\s>]+', "js/main.js?v=$v")
    $content = [regex]::Replace($content, 'js/seed_data\.js\?v=[^"''\s>]+', "js/seed_data.js?v=$v")
    $content = [regex]::Replace($content, 'baogia\.html\?v=[^"''\s>]+', "baogia.html?v=$v")
    
    # Cap nhat bien CURRENT_PAGE_VERSION
    $content = [regex]::Replace($content, 'var CURRENT_PAGE_VERSION = "[^"]*";', "var CURRENT_PAGE_VERSION = `"$v`";")
    
    [System.IO.File]::WriteAllText($htmlPath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "[OK] Da tu dong cap nhat Version Query moi vao index.html: v=$v" -ForegroundColor Green
    
    # Tao va cap nhat version.json de trinh duyet mobile / Safari tu dong pha cache
    $versionJsonPath = Join-Path $PSScriptRoot "version.json"
    $versionJsonContent = @"
{
  "version": "$v",
  "updated": "$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))"
}
"@
    [System.IO.File]::WriteAllText($versionJsonPath, $versionJsonContent, [System.Text.Encoding]::UTF8)
    Write-Host "[OK] Da tao va cap nhat file version.json: v=$v" -ForegroundColor Cyan
} else {
    Write-Host "[WARNING] Khong tim thay file index.html" -ForegroundColor Yellow
}

