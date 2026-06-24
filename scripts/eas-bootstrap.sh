#!/usr/bin/env bash
# Expo EAS – tek seferlik token ile otomatik bağlama + Android APK build
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -z "${EXPO_TOKEN:-}" ]]; then
  echo ""
  echo "❌ EXPO_TOKEN tanımlı değil."
  echo ""
  echo "1) Tarayıcıda açın:"
  echo "   https://expo.dev/accounts/uguraytekins/settings/access-tokens"
  echo "2) 'Create token' → isim: human-or-ai-build → Create"
  echo "3) Token'ı kopyalayın (bir kez gösterilir)"
  echo "4) Terminalde (token'ı yapıştırın):"
  echo ""
  echo '   export EXPO_TOKEN="buraya_token_yapıştır"'
  echo "   npm run eas:bootstrap"
  echo ""
  exit 1
fi

echo "→ Expo hesabı kontrol..."
npx eas-cli whoami

echo "→ Proje Expo'ya bağlanıyor (eas init)..."
npx eas-cli init --non-interactive --force

echo ""
echo "✅ Proje bağlandı. Kontrol panelini yenileyin: https://expo.dev/accounts/uguraytekins/projects"
echo ""
read -r -p "Android test APK build başlasın mı? (e/h) " ans
if [[ "${ans,,}" == "e" || "${ans,,}" == "y" || "${ans,,}" == "yes" ]]; then
  echo "→ Build başlıyor (10–20 dk sürebilir)..."
  CI=false npx eas-cli build --platform android --profile preview
  echo "✅ Build tamamlandığında link terminalde ve expo.dev → Builds'te görünür."
else
  echo "Build atlandı. Sonra: npm run build:android:apk"
fi

echo ""
echo "→ app.json değiştiyse GitHub'a push edin:"
echo "   git add app.json && git commit -m 'Link EAS project' && git push"
