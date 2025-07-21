@echo off
echo 🚀 Railway Deployment Script - IBAN Manager
echo.

echo 🧹 Gereksiz dosyalar temizlendi!
echo.

echo 📁 Git repo başlatılıyor...
git init

echo 📦 Dosyalar ekleniyor...
git add .

echo 📝 Commit yapılıyor...
git commit -m "Railway deployment ready - IBAN Manager v1.0 - Clean version"

echo 🌿 Main branch ayarlanıyor...
git branch -M main

echo.
echo ✅ Git repo hazır!
echo.
echo 📋 Sonraki adımlar:
echo 1. GitHub'da yeni repository oluşturun: https://github.com/new
echo 2. Repository adı: iban-manager
echo 3. Aşağıdaki komutları çalıştırın:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/iban-manager.git
echo    git push -u origin main
echo.
echo 4. Railway'de deploy edin: https://railway.app
echo    - Deploy from GitHub repo seçin
echo    - PostgreSQL database ekleyin
echo    - SECRET_KEY environment variable ekleyin
echo.
echo 📁 Temizlenmiş dosya yapısı:
echo    - ✅ Python Flask backend (src/)
echo    - ✅ Railway deployment dosyaları
echo    - ✅ PostgreSQL desteği
echo    - ✅ PWA özellikleri
echo    - ❌ Gereksiz node_modules, cache dosyaları silindi
echo.
pause
