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
echo "=== EAS Build (mağaza APK/IPA) ==="
echo "1. npm install -g eas-cli && eas login"
echo "2. eas build:configure"
echo "3. eas build --platform android --profile production"
echo "4. eas build --platform ios --profile production"
echo ""
echo "=== App Store Connect ==="
echo "Yayın sonrası APP_STORE_ID değerini src/constants/appLinks.ts içine yazın."
