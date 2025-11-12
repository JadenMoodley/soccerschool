# Installation Guide for iOS

## ⚠️ IMPORTANT: Installing on iPhone WITHOUT a Mac

**You don't need a Mac!** The easiest way is to use **Expo Go** (see Option A below). This works entirely from Windows and your iPhone.

## Prerequisites

### For Expo Go (Recommended - No Mac Required)
1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **Expo Go app** - Install from App Store on your iPhone

### For Direct Installation (Requires Mac)
1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Xcode** (latest version from App Store)
4. **CocoaPods** (install with `sudo gem install cocoapods`)

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. For iOS Development

If you want to run on iOS Simulator or device:

```bash
cd ios
pod install
cd ..
```

### 3. Start the Development Server

```bash
npm start
```

This will start the Expo development server and show a QR code.

### 4. Run on iOS

#### Option A: Using Expo Go (RECOMMENDED - Works from Windows!)

**This is the easiest method and works entirely from Windows - no Mac needed!**

1. **On your iPhone:**
   - Open the App Store
   - Search for "Expo Go"
   - Install the Expo Go app (it's free)

2. **On your Windows computer:**
   - Make sure your phone and computer are on the same Wi-Fi network
   - Run `npm start` (if not already running)
   - A QR code will appear in the terminal

3. **On your iPhone:**
   - Open the Expo Go app
   - Tap "Scan QR Code" or use your iPhone's Camera app
   - Point the camera at the QR code in your terminal
   - The app will load in Expo Go

**Note:** The app will work perfectly in Expo Go. You can use it normally, and all your data will be saved locally on your iPhone.

#### Option B: Build Standalone App (Requires Mac or Cloud Service)

**If you want a standalone app (not Expo Go), you have these options:**

**Option B1: Using Expo's Cloud Build Service (No Mac Required!)**

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Create an Expo account (free):
```bash
eas login
```

3. Configure the build:
```bash
eas build:configure
```

4. Build for iOS:
```bash
eas build --platform ios
```

This will:
- Build your app in the cloud (no Mac needed!)
- Create an IPA file you can download
- You'll need an Apple Developer account ($99/year) to install it on your iPhone

**Option B2: Build on Mac (If you have access to one)**

1. Connect your iPhone to your Mac via USB
2. Trust your computer on the iPhone if prompted
3. Run:
```bash
npx expo run:ios --device
```

This will:
- Build the app
- Install it on your connected iPhone
- Launch it automatically

## Troubleshooting

### Issue: "Command not found: pod"
- Install CocoaPods: `sudo gem install cocoapods`

### Issue: Build fails
- Make sure Xcode is up to date
- Run `cd ios && pod install && cd ..` again
- Clean build: `cd ios && xcodebuild clean && cd ..`

### Issue: App won't install on device
- Make sure your device is trusted
- Check that your Apple Developer account is configured in Xcode
- For development, you may need to add your device UDID in Apple Developer Portal

## Default PIN

The default PIN to access the app is: **2005**

You can change it in the Settings screen after logging in.

