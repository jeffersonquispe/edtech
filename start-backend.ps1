$env:PATH = "C:\nodejs-20;$env:PATH"
Write-Host "✅ Iniciando Backend EdTech en http://localhost:3001" -ForegroundColor Green
Set-Location "C:\Users\Jeff\Desktop\edtech\backend"
npm run dev -- -p 3001
