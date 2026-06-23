#!/usr/bin/env bash
# Android emülatörü başlatır (yoksa), ardından Expo ile uygulamayı açar.
# macOS / Linux; ANDROID_HOME veya ~/Library/Android/sdk gerekir.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

# Cursor/CI ortamında Metro "CI mode"a girmesin
export CI=""

# Cihaz bağlı mı?
if ! adb devices | grep -q "emulator.*device"; then
  echo "Emülatör bulunamadı, başlatılıyor..."
  AVD=$(emulator -list-avds 2>/dev/null | head -1)
  if [ -z "$AVD" ]; then
    echo "Hata: Hiç AVD yok. Android Studio > Device Manager'dan bir emülatör oluşturun."
    exit 1
  fi
  emulator -avd "$AVD" -no-snapshot-load &
  EMU_PID=$!
  echo "Emülatör başlatıldı (PID $EMU_PID), boot bekleniyor..."
  adb wait-for-device
  n=0
  while [ $n -lt 30 ]; do
    if [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ]; then
      echo "Emülatör hazır."
      break
    fi
    sleep 2
    n=$((n + 1))
  done
fi

echo "Expo Android başlatılıyor..."
exec npx expo start --android --clear
