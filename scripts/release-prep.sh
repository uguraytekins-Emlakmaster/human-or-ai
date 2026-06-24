#!/usr/bin/env bash
# İlk yayın: GitHub Pages + EAS build adımları
set -e
cd "$(dirname "$0")/.."

echo "→ Görselleri kontrol et..."
npm run generate-assets

echo "→ TypeScript + test..."
npm run prebuild:check

echo ""
echo "=== GitHub Pages (gizlilik) ==="
echo "1. git init && git add . && git commit -m 'Initial release'"
echo "2. GitHub'da 'human-or-ai' reposu oluştur"
echo "3. git remote add origin git@github.com:uguraytekin/human-or-ai.git"
echo "4. git push -u origin main"
echo "5. Repo Settings → Pages → Build and deployment → GitHub Actions"
echo "6. privacy.html: https://uguraytekin.github.io/human-or-ai/privacy.html"
echo ""
echo "=== EAS Build (mağaza APK/AAB) ==="
echo "Detay: docs/EAS-KURULUM.md"
echo "1. npm install"
echo "2. npm run eas:login        # tarayıcıda Expo girişi"
echo "3. npm run eas:init         # projeyi Expo'ya bağlar"
echo "4. npm run build:android    # Play Store .aab"
echo "   npm run build:android:apk # test APK (opsiyonel)"
echo ""
echo "=== App Store Connect ==="
echo "Yayın sonrası APP_STORE_ID değerini src/constants/appLinks.ts içine yazın."
