# React Native iOS IBAN Manager

## 🚀 Kurulum Talimatları

### Ön Gereksinimler

1. **Node.js** (18+)
2. **Xcode** (14.0+)
3. **iOS Simulator** or **iPhone**
4. **Cocoapods**

### Adım 1: Bağımlılıkları Yükle

```bash
cd mobile
npm install
```

### Adım 2: iOS Pods Yükle

```bash
cd ios
pod install
cd ..
```

### Adım 3: iOS'u Çalıştır

```bash
# Simulator için
npm run ios

# Belirli bir simulator için
npx react-native run-ios --simulator="iPhone 15 Pro"

# Fiziksel cihaz için
npm run ios --device
```

## 📁 Proje Yapısı

```
mobile/
├── src/
│   ├── components/          # Reusable components
│   │   └── IBANCard.tsx
│   ├── context/            # React Context
│   │   └── IBANContext.tsx
│   ├── screens/            # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── AddIBANScreen.tsx
│   │   ├── EditIBANScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/           # API services
│   │   └── IBANService.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── ibanUtils.ts
│   └── App.tsx            # Main app component
├── ios/                   # iOS native code
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Geliştirme

### Debug Menu

iOS Simulator'da:
- **⌘ + D** (Command + D)

Fiziksel cihazda:
- **Cihazı sallayin**

### Metro Bundler

```bash
npm start
```

### Build Release

```bash
npm run build:ios
```

## 📱 Özellikler

- ✅ **Native iOS Tasarım**: iOS Design Guidelines
- ✅ **Touch ID/Face ID**: Güvenlik (gelecek sürüm)
- ✅ **Offline Support**: AsyncStorage cache
- ✅ **IBAN Validation**: Real-time validation
- ✅ **Auto TR Format**: Otomatik Türkiye format
- ✅ **Copy to Clipboard**: IBAN kopyalama
- ✅ **Search & Filter**: IBAN arama
- ✅ **Pull to Refresh**: Yenileme
- ✅ **Error Handling**: Hata yönetimi
- ✅ **Toast Messages**: Bildirimler

## 🔌 API Entegrasyonu

Uygulama backend API'si ile entegre çalışır:
- **Base URL**: `https://web-production-e9d13.up.railway.app/api`
- **Endpoints**: `/ibans`, `/ibans/validate`
- **Auth**: Şu anda auth yok (gelecek sürüm)

## 🐛 Sorun Giderme

### Pod Install Hatası
```bash
cd ios
pod deintegrate
pod install
```

### Metro Bundle Hatası
```bash
npx react-native start --reset-cache
```

### Xcode Build Hatası
1. Xcode'u açın
2. Product → Clean Build Folder
3. Product → Build

## 🚀 App Store Deployment

1. **Bundle ID**: `com.yourcompany.ibanmanager`
2. **Version**: `1.0.0`
3. **Build**: Archive in Xcode
4. **Upload**: App Store Connect
