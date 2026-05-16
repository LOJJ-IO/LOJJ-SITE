# Opens Google Search Console and Bing Webmaster Tools for manual sitemap submission.
# Run after deploying to production:  .\scripts\open-search-console.ps1

$sitemap = "https://www.lojj.io/sitemap.xml"
$home = "https://www.lojj.io/"

Write-Host "Canonical sitemap: $sitemap"
Write-Host ""
Write-Host "Google Search Console:"
Write-Host "  1. Add property https://www.lojj.io (Domain or URL prefix)"
Write-Host "  2. Sitemaps -> Submit: sitemap.xml"
Write-Host "  3. URL Inspection -> $home -> Request indexing"
Write-Host ""
Write-Host "Bing Webmaster Tools:"
Write-Host "  1. Add site https://www.lojj.io"
Write-Host "  2. Sitemaps -> Submit: $sitemap"
Write-Host ""

Start-Process "https://search.google.com/search-console"
Start-Process "https://www.bing.com/webmasters"
