# EAS Build – Adım adım (Türkçe)

Global `eas` komutu yoksa sorun değil; projede `npm run` kullanın.

## 1. Bağımlılıkları kur

```bash
cd "/Users/uguraytekin/Yeni Projeler Oyun/human-or-ai"
npm install
```

## 2. Expo hesabı

1. https://expo.dev/signup adresinden **ücretsiz** hesap açın (GitHub ile de olur).
2. Terminalde giriş:

```bash
npm run eas:login
```

Tarayıcı açılır → Expo hesabınızla onaylayın.

Kontrol:

```bash
npm run eas:whoami
```

`Logged in as ...` görmelisiniz.

## 3. Projeyi Expo’ya bağla (sadece bir kez)

```bash
npm run eas:init
```

Sorular:
- **Create a new project?** → **Yes**
- Proje adı: `human-or-ai` (Enter)

Bu komut `app.json` içine `extra.eas.projectId` ekler. **Commit edip push edin.**

## 4. Android build (Play Store için)

```bash
npm run build:android
```

İlk seferde Android **keystore** sorulursa → **Generate new keystore** (Expo saklasın).

Build bittiğinde terminalde veya https://expo.dev hesabınızda `.aab` indirilir → Google Play Console’a yüklersiniz.

## 5. (İsteğe bağlı) Telefonda test APK

Apple hesabı gerekmez:

```bash
npm run build:android:apk
```

Bitince QR/link ile APK’yı telefona kurabilirsiniz.

## 6. iOS (Apple Developer gerekir)

Yıllık Apple Developer üyeliği ($99) şart:

```bash
npm run build:ios
```

---

## Sık hatalar

| Hata | Çözüm |
|------|--------|
| `eas: command not found` | `npm install` sonra `npm run eas:login` kullanın |
| `Not logged in` | `npm run eas:login` |
| `EAS project not configured` | `npm run eas:init` |
| `eas build:configure` bulunamıyor | Artık gerek yok; `eas.json` zaten var, doğrudan `npm run build:android` |

---

## Özet – sizin yapmanız gereken 3 komut

```bash
npm install
npm run eas:login
npm run eas:init
npm run build:android
```

İlk build 10–20 dakika sürebilir (Expo sunucusunda derlenir).
