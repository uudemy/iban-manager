#!/bin/bash

echo "🚀 IBAN Manager Mobile - iOS Setup Script"
echo "=========================================="

# Check if we're in the mobile directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Bu script mobile/ klasöründe çalıştırılmalıdır"
    echo "   cd mobile && ./setup_ios.sh"
    exit 1
fi

echo "📦 Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "🍎 Installing iOS pods..."
cd ios
pod install

if [ $? -ne 0 ]; then
    echo "❌ pod install failed"
    echo "💡 Try: cd ios && pod deintegrate && pod install"
    exit 1
fi

cd ..

echo "✅ Setup complete!"
echo ""
echo "🚀 To run the app:"
echo "   npm run ios"
echo ""
echo "📱 To run on specific simulator:"
echo "   npx react-native run-ios --simulator=\"iPhone 15 Pro\""
echo ""
echo "🔧 To open in Xcode:"
echo "   open ios/IBANManager.xcworkspace"
