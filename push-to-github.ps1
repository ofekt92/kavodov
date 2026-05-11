# ═══════════════════════════════════════════════════════════════
#   MashPro — סקריפט push אוטומטי ל-GitHub
# ═══════════════════════════════════════════════════════════════
#
#  הסקריפט הזה:
#  1. בודק אם יש לך Form ID מ-Formspree (ומזכיר לערוך אם לא)
#  2. דוחף את כל ה-commits ל-mosheisr/Mashpro
#  3. Cloudflare Pages יבנה ויפרסם תוך 90 שניות
#
#  הוראות הפעלה:
#  ───────────────────────────────────────────────────────────
#  1. חלץ את ה-ZIP לתיקייה כלשהי
#  2. פתח PowerShell ב-תיקייה הזו
#  3. הרץ:    .\push-to-github.ps1
#
#  אם תקבל שגיאה "execution policy", הרץ קודם:
#    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
#
# ═══════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       MashPro - Push to GitHub                        ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Git
Write-Host "▶ Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "  ✓ $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Git is not installed!" -ForegroundColor Red
    Write-Host "    Install from: https://git-scm.com/download/win"
    exit 1
}

# Step 2: Check we're in the right place
Write-Host ""
Write-Host "▶ Verifying project structure..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "  ✗ package.json not found!" -ForegroundColor Red
    Write-Host "    Make sure you're running this from the mortgage-react folder"
    exit 1
}
if (-not (Test-Path ".git")) {
    Write-Host "  ✗ .git folder not found!" -ForegroundColor Red
    Write-Host "    Re-extract the ZIP and try again"
    exit 1
}
Write-Host "  ✓ Project structure OK" -ForegroundColor Green

# Step 3: Check Formspree ID
Write-Host ""
Write-Host "▶ Checking Formspree configuration..." -ForegroundColor Yellow
$homeFile = "src\pages\Home.jsx"
$content = Get-Content $homeFile -Raw
if ($content -match "YOUR_FORM_ID") {
    Write-Host "  ⚠ Formspree Form ID not configured!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "    The contact form won't send emails until you set this up."
    Write-Host "    1. Sign up at https://formspree.io with shlomo@mashpro.co.il"
    Write-Host "    2. Create a new form and copy the Form ID (e.g., 'xayzgwbp')"
    Write-Host "    3. Edit src\pages\Home.jsx"
    Write-Host "       Find: const FORMSPREE_ENDPOINT = `"https://formspree.io/f/YOUR_FORM_ID`""
    Write-Host "       Replace YOUR_FORM_ID with your actual ID"
    Write-Host ""
    $continue = Read-Host "    Continue anyway? Calendly will still work. (y/n)"
    if ($continue -ne "y") {
        Write-Host "    Aborted. Edit Home.jsx and run again."
        exit 0
    }
} else {
    Write-Host "  ✓ Formspree configured" -ForegroundColor Green
}

# Step 4: Show what we're pushing
Write-Host ""
Write-Host "▶ Commits ready to push:" -ForegroundColor Yellow
git log --oneline -10
Write-Host ""

# Step 5: Confirm
$confirm = Read-Host "Push to mosheisr/Mashpro? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Aborted."
    exit 0
}

# Step 6: Push
Write-Host ""
Write-Host "▶ Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "  (If prompted, log in with your GitHub credentials)"
Write-Host ""

try {
    git push -u origin main --force-with-lease
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                 ✓ Push successful!                    ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  • GitHub:     https://github.com/mosheisr/Mashpro"
    Write-Host "  • Cloudflare: https://dash.cloudflare.com (check Pages > mashpro)"
    Write-Host "  • Live site:  https://mashpro.co.il (live in ~90 seconds)"
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "✗ Push failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common fixes:"
    Write-Host "  1. Authentication failed?"
    Write-Host "     - GitHub requires a Personal Access Token (not your password)"
    Write-Host "     - Get one at: https://github.com/settings/tokens"
    Write-Host "     - Select scope: 'repo', use as password when prompted"
    Write-Host ""
    Write-Host "  2. Repository has unrelated history?"
    Write-Host "     - Run:  git pull origin main --rebase --allow-unrelated-histories"
    Write-Host "     - Then: git push -u origin main"
    Write-Host ""
    Write-Host "  3. Branch protection?"
    Write-Host "     - Check repo Settings > Branches on GitHub"
    Write-Host ""
    exit 1
}
